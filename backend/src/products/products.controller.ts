import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Rota GET: Listar todos os produtos
  @Get()
  async findAll() {
    return await this.productsService.findAll();
  }

  // Rota POST: Criar novo produto
  @Post()
  async create(
    @Body()
    body: {
      name: string;
      description?: string;
      price: string;
      categoryId: string;
    },
  ) {
    return await this.productsService.create(body);
  }

  // Rota PUT: Atualizar produto
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      description?: string;
      price?: string;
      categoryId?: string;
      isActive?: boolean;
    },
  ) {
    return await this.productsService.update(id, body);
  }

  // Rota DELETE: Remover produto do cardápio
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(id);
  }
}
