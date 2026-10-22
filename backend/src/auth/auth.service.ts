import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { DRIZZLE } from '../database/database.provider.js';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema.js';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { formatToBrazilTime } from '../common/utils/date.helper.js';

@Injectable()
export class AuthService {
  constructor(@Inject(DRIZZLE) private db: NeonHttpDatabase<typeof schema>) {}

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
}
