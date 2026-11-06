import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

// Variáveis obrigatórias: sem elas a API não deve subir.
// (O ConfigModule já carregou o .env ao importar o AppModule.)
const REQUIRED_ENV_VARS = ['DATABASE_URL', 'JWT_SECRET'] as const;

function assertRequiredEnv() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]?.trim());

  if (missing.length > 0) {
    throw new Error(
      `Variáveis de ambiente obrigatórias ausentes: ${missing.join(', ')}. ` +
        'Configure o arquivo .env (veja .env.example).',
    );
  }
}

async function bootstrap() {
  assertRequiredEnv();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
