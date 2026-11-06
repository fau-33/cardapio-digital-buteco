import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Sem fallback: a aplicação não sobe sem JWT_SECRET (ver main.ts)
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // O que estiver aqui é injetado no objeto `req.user` quando o token for válido
  async validate(payload: { sub: string; email: string; name: string }) {
    return { userId: payload.sub, email: payload.email, name: payload.name };
  }
}
