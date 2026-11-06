import {
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard do fluxo OAuth do Google.
 * Enquanto GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET não estiverem configurados
 * (ausentes ou com placeholder), responde 503 em vez de redirecionar o usuário
 * para um consentimento inválido.
 */
@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');

    // Um Client ID real do Google sempre termina em ".apps.googleusercontent.com";
    // qualquer outro valor é tratado como placeholder.
    const isConfigured =
      !!clientSecret && !!clientId?.endsWith('.apps.googleusercontent.com');

    if (!isConfigured) {
      throw new ServiceUnavailableException(
        'Login com Google ainda não está configurado.',
      );
    }

    return super.canActivate(context);
  }
}
