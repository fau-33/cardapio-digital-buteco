import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
