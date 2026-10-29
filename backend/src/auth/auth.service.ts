import {
  Injectable,
  Inject,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { DRIZZLE } from '../database/database.provider.js';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema.js';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { formatToBrazilTime } from '../common/utils/date.helper.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private db: NeonHttpDatabase<typeof schema>,
    private jwtService: JwtService,
  ) {}

  // Registar um novo Administrador com Validação de Senha
  async register(data: { name: string; email: string; password: string }) {
    // 1. Validar requisitos de senha forte (mínimo 6 caracteres, 1 maiúscula, 1 minúscula)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(data.password)) {
      throw new BadRequestException(
        'A senha deve ter no mínimo 6 caracteres, contendo pelo menos uma letra maiúscula e uma minúscula.',
      );
    }

    // 2. Verifica se o e-mail já existe
    const existingUser = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, data.email));

    if (existingUser.length > 0) {
      throw new BadRequestException('E-mail já cadastrado no sistema.');
    }

    // 3. Criptografa a senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 4. Salva no banco Neon
    const [newUser] = await this.db
      .insert(schema.users)
      .values({
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        password: hashedPassword,
      })
      .returning({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        createdAt: schema.users.createdAt,
      });

    // 5. Retorna o usuário com a data formatada para o horário do Brasil
    return {
      ...newUser,
      createdAt: formatToBrazilTime(newUser.createdAt),
    };
  }

  // Autenticar / Login do Administrador
  async login(data: { email: string; password: string }) {
    // 1. Buscar o usuário pelo e-mail
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, data.email));

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    // 2. Comparar a senha informada com o hash salvo no banco
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    // 3. Gerar o Token JWT de Acesso
    const accessToken = this.generateAccessToken(user);

    return {
      message: 'Login realizado com sucesso!',
      accessToken, // Crachá digital para as rotas protegidas
      admin: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: formatToBrazilTime(user.createdAt),
      },
    };
  }

  // Gera o token JWT de acesso para um usuário autenticado
  generateAccessToken(user: { id: string; email: string; name: string }) {
    const payload = { sub: user.id, email: user.email, name: user.name };
    return this.jwtService.sign(payload);
  }

  // Busca ou registra um administrador autenticado via Google OAuth
  async validateGoogleUser(data: {
    email: string;
    name: string;
    photo?: string;
  }) {
    const [existingUser] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, data.email));

    if (existingUser) {
      return existingUser;
    }

    // Usuários do Google não possuem senha local. Geramos um hash aleatório
    // para satisfazer a coluna NOT NULL e impedir login por senha.
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const [newUser] = await this.db
      .insert(schema.users)
      .values({
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        password: hashedPassword,
      })
      .returning();

    return newUser;
  }

  // 1. Solicitar recuperação de senha
  async forgotPassword(data: { email: string }) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, data.email));

    if (!user) {
      return {
        message: 'Se o e-mail existir, um token de recuperação foi gerado.',
      };
    }

    // Gera um token aleatório seguro (ex: 32 bytes em hexadecimal)
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Validade de 15 minutos a partir de agora
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    // Salva o token no banco
    await this.db
      .update(schema.users)
      .set({
        resetToken,
        resetTokenExpiry,
      })
      .where(eq(schema.users.id, user.id));

    // No ambiente de produção, isso seria enviado por e-mail. Para testes, retornamos o token:
    return {
      message: 'Token de recuperação gerado com sucesso.',
      resetToken, // Copie este token para testar o reset no .http
    };
  }

  // 2. Redefinir a senha usando o token
  async resetPassword(data: {
    email: string;
    token: string;
    newPassword: string;
  }) {
    // Validar requisitos de senha forte na nova senha
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(data.newPassword)) {
      throw new BadRequestException(
        'A nova senha deve ter no mínimo 6 caracteres, contendo pelo menos uma letra maiúscula e uma minúscula.',
      );
    }

    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, data.email));

    if (!user || user.resetToken !== data.token) {
      throw new BadRequestException('Token inválido ou e-mail incorreto.');
    }

    // Verifica se o token expirou
    if (user.resetTokenExpiry && new Date() > new Date(user.resetTokenExpiry)) {
      throw new BadRequestException('O token de recuperação expirou.');
    }

    // Criptografa a nova senha
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    // Atualiza a senha e limpa o token de recuperação
    await this.db
      .update(schema.users)
      .set({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      })
      .where(eq(schema.users.id, user.id));

    return { message: 'Senha redefinida com sucesso! Já pode fazer login.' };
  }
}
