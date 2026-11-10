import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import {
  GoogleOAuthGuard,
  type GoogleAuthRequest,
} from './guards/google-oauth.guard.js';

type GoogleUser = {
  id: string;
  email: string;
  name: string;
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private resolveFrontendUrl(req: GoogleAuthRequest): string {
    const configured = this.configService
      .get<string>('FRONTEND_URL')
      ?.trim()
      .replace(/\/+$/, '');

    // Se a requisição veio de um domínio público (ex.: Vercel) e FRONTEND_URL
    // ainda aponta para localhost ou não foi definida, prioriza a origem real.
    const referer = req.headers.referer || req.headers.origin;
    if (typeof referer === 'string') {
      try {
        const origin = new URL(referer).origin;
        if (
          origin &&
          (!configured ||
            (configured.includes('localhost') && !origin.includes('localhost')))
        ) {
          return origin;
        }
      } catch {
        // Ignora referer malformado
      }
    }

    if (configured) {
      return configured;
    }

    return this.configService.get<string>('NODE_ENV') === 'production'
      ? 'https://cardapio-buteco-papa.vercel.app'
      : 'http://localhost:3001';
  }

  // rota para registrar um novo usuário (apenas e-mail e senha obrigatórios;
  // se name não for enviado, usa a parte inicial do e-mail antes do @)
  @Post('register')
  async register(
    @Body()
    body: {
      name?: string;
      email: string;
      password: string;
    },
  ) {
    return await this.authService.register(body);
  }

  // rota para login de usuário
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return await this.authService.login(body);
  }

  // rota para solicitar redefinição de senha
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return await this.authService.forgotPassword(body);
  }

  // rota para redefinir a senha usando o token
  @Post('reset-password')
  async resetPassword(
    @Body() body: { email: string; token: string; newPassword: string },
  ) {
    return await this.authService.resetPassword(body);
  }

  // Inicia o fluxo OAuth 2.0 redirecionando para o consentimento do Google.
  // Caso as variáveis GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET ainda não estejam
  // configuradas no servidor, redireciona de volta para a tela de login com aviso.
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req: GoogleAuthRequest, @Res() res: Response) {
    if (req.googleNotConfigured) {
      const frontendUrl = this.resolveFrontendUrl(req);
      return res.redirect(
        `${frontendUrl}/admin/login?error=google_not_configured`,
      );
    }
  }

  // Callback do Google: gera o JWT e devolve o usuário para o frontend
  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthCallback(
    @Req() req: GoogleAuthRequest,
    @Res() res: Response,
  ) {
    const frontendUrl = this.resolveFrontendUrl(req);

    if (req.googleNotConfigured) {
      return res.redirect(
        `${frontendUrl}/admin/login?error=google_not_configured`,
      );
    }

    const user = req.user as unknown as GoogleUser | undefined;

    if (!user) {
      return res.redirect(
        `${frontendUrl}/admin/login?error=google_auth_failed`,
      );
    }

    const accessToken = this.authService.generateAccessToken(user);

    return res.redirect(
      `${frontendUrl}/admin/dashboard?token=${encodeURIComponent(accessToken)}`,
    );
  }
}
