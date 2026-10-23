import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback_secret',
    });
  }

  // O que estiver aqui é injetado no objeto `req.user` quando o token for válido
  async validate(payload: { sub: string; email: string; name: string }) {
    return { userId: payload.sub, email: payload.email, name: payload.name };
  }
}
