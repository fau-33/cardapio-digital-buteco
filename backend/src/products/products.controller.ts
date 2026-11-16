import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import { ProductsService } from './products.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CloudinaryService } from '../upload/cloudinary.service.js';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // 🔒 PROTEGIDO: Upload e padronização de imagem via Sharp + Cloudinary (800x520px .jpg)
  @UseGuards(JwtAuthGuard)
  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 15 * 1024 * 1024 }, // Até 15MB (fotos diretas da câmera do celular)
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException(
              'Apenas arquivos de imagem são permitidos.',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadImage(@UploadedFile() file?: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new BadRequestException('Nenhuma imagem foi enviada.');
    }
    return await this.cloudinaryService.uploadProductImage(file.buffer);
  }

  // 🔓 PÚBLICO: Qualquer cliente no QR Code vê apenas produtos ativos/disponíveis
  @Get()
  async findAll() {
    return await this.productsService.findAll();
  }

  // 🔒 PROTEGIDO: Admin logado vê todos os produtos (ativos e inativos)
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async findAllAdmin() {
    return await this.productsService.findAllAdmin();
  }

  // 🔓 PÚBLICO: Busca um produto ativo por ID (retorna 404 se não existir)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }

  // 🔒 PROTEGIDO: Apenas o Admin logado pode criar produtos
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body()
    body: {
      name: string;
      description?: string;
      price: string;
      imageUrl?: string | null;
      categoryId: string;
      isNovelty?: boolean;
      isActive?: boolean;
    },
  ) {
    return await this.productsService.create(body);
  }

  // 🔒 PROTEGIDO: Apenas o Admin logado pode atualizar completo (PUT)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      description?: string;
      price?: string;
      imageUrl?: string | null;
      categoryId?: string;
      isNovelty?: boolean;
      isActive?: boolean;
    },
  ) {
    return await this.productsService.update(id, body);
  }

  // 🔒 PROTEGIDO: Apenas o Admin logado pode atualizar parcial (PATCH)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patch(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      description?: string;
      price?: string;
      imageUrl?: string | null;
      categoryId?: string;
      isNovelty?: boolean;
      isActive?: boolean;
    },
  ) {
    return await this.productsService.update(id, body);
  }

  // 🔒 PROTEGIDO: Apenas o Admin logado pode deletar produtos
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(id);
  }
}
