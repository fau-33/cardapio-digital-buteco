import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { GoogleOAuthGuard } from './guards/google-oauth.guard.js';

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

  // rota para registrar um novo usuário
  // Protegida: exige o código ADMIN_REGISTRATION_SECRET enviado no header
  // "x-admin-registration-secret" ou no campo "registrationSecret" do body.
  @Post('register')
  async register(
    @Headers('x-admin-registration-secret') headerSecret: string | undefined,
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      registrationSecret?: string;
    },
  ) {
    const { registrationSecret, ...data } = body;
    this.authService.assertValidRegistrationSecret(
      headerSecret ?? registrationSecret,
    );
    return await this.authService.register(data);
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
  // Responde 503 enquanto as credenciais do Google não estiverem configuradas.
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    // O GoogleOAuthGuard cuida do redirecionamento.
  }

  // Callback do Google: gera o JWT e devolve o usuário para o frontend
  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as unknown as GoogleUser | undefined;

    if (!user) {
      throw new UnauthorizedException(
        'Falha na autenticação com o Google.',
      );
    }

    const accessToken = this.authService.generateAccessToken(user);
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      'http://localhost:3001';

    return res.redirect(
      `${frontendUrl}/admin/dashboard?token=${encodeURIComponent(accessToken)}`,
    );
  }
}
