import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import type { Profile, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service.js';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID:
        configService.get<string>('GOOGLE_CLIENT_ID') ||
        'GOOGLE_CLIENT_ID_NOT_CONFIGURED',
      clientSecret:
        configService.get<string>('GOOGLE_CLIENT_SECRET') ||
        'GOOGLE_CLIENT_SECRET_NOT_CONFIGURED',
      callbackURL:
        configService.get<string>('GOOGLE_CALLBACK_URL') ||
        'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const email = profile.emails?.[0]?.value;
      const isEmailVerified = profile.emails?.[0]?.verified !== false;

      if (!email || !isEmailVerified) {
        return done(
          new Error(
            'Não foi possível autenticar: o Google não retornou um e-mail verificado.',
          ),
          false,
        );
      }

      const name =
        profile.displayName ||
        profile.name?.givenName ||
        email.split('@')[0];

      const user = await this.authService.validateGoogleUser({
        email,
        name,
        photo: profile.photos?.[0]?.value,
      });

      done(null, user);
    } catch (error) {
      done(error as Error, false);
    }
  }
}
