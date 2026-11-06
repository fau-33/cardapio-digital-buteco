import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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
