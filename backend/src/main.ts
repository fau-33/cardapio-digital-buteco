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

  const allowedOrigins = Array.from(
    new Set(
      [
        'https://cardapio-buteco-papa.vercel.app',
        process.env.FRONTEND_URL?.trim().replace(/\/+$/, ''),
        'http://localhost:3000',
        'http://localhost:3001',
      ].filter(Boolean) as string[],
    ),
  );

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origem não autorizada pelo CORS.'), false);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-admin-registration-secret',
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
