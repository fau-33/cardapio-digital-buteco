import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE } from '../database/database.provider.js';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema.js';
import * as crypto from 'crypto';
import * as dns from 'dns';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { formatToBrazilTime } from '../common/utils/date.helper.js';
import { JwtService } from '@nestjs/jwt';

const FORGOT_PASSWORD_MESSAGE =
  'Se o e-mail existir, as instruções de recuperação foram enviadas.';

const STRICT_EMAIL_REGEX =
  /^[a-zA-Z0-9]+([._+-][a-zA-Z0-9]+)*@([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,24}$/;

const BLOCKED_EMAIL_DOMAINS = new Set([
  'teste.com',
  'teste.com.br',
  'test.com',
  'test.org',
  'test.net',
  'example.com',
  'example.org',
  'example.net',
  'admin.com',
  'buteco.com',
  'localhost',
  'tempmail.com',
  'temp-mail.org',
  'mailinator.com',
  '10minutemail.com',
  'yopmail.com',
  'guerrillamail.com',
  'sharklasers.com',
  'trashmail.com',
  'maildrop.cc',
  'fakeinbox.com',
  'dispostable.com',
  'getnada.com',
]);

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(DRIZZLE) private db: NeonHttpDatabase<typeof schema>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private get isProduction() {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }

  // Valida o código secreto exigido para cadastrar novos administradores,
  // caso ADMIN_REGISTRATION_SECRET esteja configurado no ambiente.
  assertValidRegistrationSecret(providedSecret: string | undefined) {
    const expectedSecret = this.configService
      .get<string>('ADMIN_REGISTRATION_SECRET')
      ?.trim();

    if (!expectedSecret) {
      return;
    }

    // Compara os hashes em tempo constante (evita timing attack e
    // erro de tamanho diferente no timingSafeEqual).
    const expected = crypto.createHash('sha256').update(expectedSecret).digest();
    const provided = crypto
      .createHash('sha256')
      .update(providedSecret ?? '')
      .digest();

    if (!providedSecret || !crypto.timingSafeEqual(expected, provided)) {
      throw new ForbiddenException('Código de autorização de cadastro inválido.');
    }
  }

  // Valida formato estrito do e-mail, bloqueia domínios falsos/descartáveis
  // e verifica via DNS se o domínio possui servidores de e-mail (MX) reais.
  private async assertRealEmailWithMx(rawEmail: string): Promise<string> {
    const normalizedEmail = (rawEmail ?? '').trim().toLowerCase();

    if (!normalizedEmail || !STRICT_EMAIL_REGEX.test(normalizedEmail)) {
      throw new BadRequestException(
        'Por favor, utilize um endereço de e-mail real e válido (ex: Gmail, Outlook, iCloud ou corporativo).',
      );
    }

    const [localPart, domain] = normalizedEmail.split('@');

    if (
      !localPart ||
      localPart.length < 2 ||
      !domain ||
      BLOCKED_EMAIL_DOMAINS.has(domain) ||
      domain.endsWith('.test') ||
      domain.endsWith('.example') ||
      domain.endsWith('.invalid') ||
      domain.endsWith('.localhost')
    ) {
      throw new BadRequestException(
        'Domínio de e-mail inválido ou inexistente. Utilize um e-mail real.',
      );
    }

    try {
      const mxRecords = await dns.promises.resolveMx(domain);
      const hasValidMx =
        Array.isArray(mxRecords) &&
        mxRecords.length > 0 &&
        mxRecords.some(
          (record) =>
            Boolean(record?.exchange) &&
            record.exchange.trim().length > 0 &&
            record.exchange.trim() !== '.',
        );

      if (!hasValidMx) {
        throw new BadRequestException(
          'Domínio de e-mail inválido ou inexistente. Utilize um e-mail real.',
        );
      }
    } catch {
      throw new BadRequestException(
        'Domínio de e-mail inválido ou inexistente. Utilize um e-mail real.',
      );
    }

    return normalizedEmail;
  }

  // Registar um novo Administrador com Validação de E-mail Real (DNS MX) e Senha
  async register(data: { name: string; email: string; password: string }) {
    // 0. Validar se o e-mail é real e possui domínio com MX válido
    const normalizedEmail = await this.assertRealEmailWithMx(data.email);

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
      .where(eq(schema.users.email, normalizedEmail));

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
        name: data.name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      })
      .returning({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        createdAt: schema.users.createdAt,
      });

    // 5. Gera o token JWT e retorna o usuário com a data formatada para o horário do Brasil
    const accessToken = this.generateAccessToken(newUser);
    const formattedAdmin = {
      ...newUser,
      createdAt: formatToBrazilTime(newUser.createdAt),
    };

    return {
      ...formattedAdmin,
      message: 'Administrador cadastrado com sucesso!',
      accessToken,
      admin: formattedAdmin,
    };
  }

  // Autenticar / Login do Administrador
  async login(data: { email: string; password: string }) {
    const normalizedEmail = (data.email ?? '').trim().toLowerCase();

    // 1. Buscar o usuário pelo e-mail
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, normalizedEmail));

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

  // Lista de e-mails autorizados a virar admin via Google (ALLOWED_ADMIN_EMAILS,
  // separados por vírgula).
  private getAllowedAdminEmails(): string[] {
    return (this.configService.get<string>('ALLOWED_ADMIN_EMAILS') ?? '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
  }

  // Autentica um administrador via Google OAuth.
  // Só permite e-mails já cadastrados ou listados em ALLOWED_ADMIN_EMAILS.
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

    const allowedEmails = this.getAllowedAdminEmails();
    const isAllowed =
      allowedEmails.length === 0 ||
      allowedEmails.includes(data.email.toLowerCase());

    if (!isAllowed) {
      throw new UnauthorizedException(
        'Este e-mail do Google não tem permissão de administrador.',
      );
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

    // Mesma resposta para e-mail existente ou não (evita enumeração de contas)
    if (!user) {
      return { message: FORGOT_PASSWORD_MESSAGE };
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

    // Em produção o token NUNCA sai na resposta: deve ser enviado por e-mail.
    if (this.isProduction) {
      return { message: FORGOT_PASSWORD_MESSAGE };
    }

    // Apenas em desenvolvimento: loga e devolve o token para testes locais.
    this.logger.warn(
      `[DEV] Token de recuperação para ${user.email}: ${resetToken}`,
    );

    return {
      message: FORGOT_PASSWORD_MESSAGE,
      resetToken,
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

    if (!user || !user.resetToken || user.resetToken !== data.token) {
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
