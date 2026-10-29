import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

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
  @Post('register')
  async register(
    @Body() body: { name: string; email: string; password: string },
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

  // Inicia o fluxo OAuth 2.0 redirecionando para o consentimento do Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // O AuthGuard('google') cuida do redirecionamento.
  }

  // Callback do Google: gera o JWT e devolve o usuário para o frontend
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
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
