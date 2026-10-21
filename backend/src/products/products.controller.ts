import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Rota GET: Lista todos os produtos
  @Get()
  async findAll() {
    return await this.productsService.findAll();
  }

  // Rota POST: Cria um novo produto
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
}
