import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Rota GET: Lista todas as categorias
  @Get()
  async findAll() {
    return await this.categoriesService.findAll();
  }

  // Rota POST: Cria uma nova categoria
  @Post()
  async create(@Body() body: { id: string; name: string; order?: string }) {
    return await this.categoriesService.create(body);
  }
}
