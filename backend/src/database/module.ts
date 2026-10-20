import { Module, Global } from '@nestjs/common';
import { databaseProviders } from './provider.js';

@Global()
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
