import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

export type GoogleAuthRequest = Request & {
  googleNotConfigured?: boolean;
  googleAuthError?: string;
};

/**
 * Guard do fluxo OAuth do Google.
 * Verifica se GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET estão configurados.
 * Caso ainda não estejam preenchidos no servidor (ex.: Render), sinaliza na
 * request para que o controller redirecione amigavelmente de volta ao login
 * (/admin/login?error=google_not_configured) em vez de exibir JSON 503 bruto.
 */
@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<GoogleAuthRequest>();
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID')?.trim();
    const clientSecret = this.configService
      .get<string>('GOOGLE_CLIENT_SECRET')
      ?.trim();

    const isConfigured =
      Boolean(clientSecret) &&
      clientSecret !== 'GOOGLE_CLIENT_SECRET_NOT_CONFIGURED' &&
      Boolean(clientId) &&
      clientId !== 'GOOGLE_CLIENT_ID_NOT_CONFIGURED' &&
      Boolean(clientId?.endsWith('.apps.googleusercontent.com'));

    if (!isConfigured) {
      req.googleNotConfigured = true;
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(
    err: unknown,
    user: TUser,
    _info: unknown,
    context: ExecutionContext,
  ): TUser {
    if (err || !user) {
      const req = context.switchToHttp().getRequest<GoogleAuthRequest>();
      req.googleAuthError =
        err instanceof Error ? err.message : 'google_auth_failed';
      return null as unknown as TUser;
    }
    return user;
  }
}
