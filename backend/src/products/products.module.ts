import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { UploadModule } from '../upload/upload.module.js';

@Module({
  imports: [AuthModule, UploadModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
