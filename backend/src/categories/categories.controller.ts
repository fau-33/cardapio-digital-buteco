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
import { CategoriesService } from './categories.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // 🔓 PÚBLICO: Listar todas as categorias
  @Get()
  async findAll() {
    return await this.categoriesService.findAll();
  }

  // 🔓 PÚBLICO: Cardápio unificado (Categorias e Produtos)
  @Get('menu')
  async getMenu() {
    return await this.categoriesService.getMenu();
  }

  // 🔒 PROTEGIDO: Criar nova categoria
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: { name: string; order?: string }) {
    return await this.categoriesService.create(body);
  }

  // 🔒 PROTEGIDO: Atualizar categoria completo (PUT)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; order?: string },
  ) {
    return await this.categoriesService.update(id, body);
  }

  // 🔒 PROTEGIDO: Atualizar categoria parcial (PATCH)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patch(
    @Param('id') id: string,
    @Body() body: { name?: string; order?: string },
  ) {
    return await this.categoriesService.update(id, body);
  }

  // 🔒 PROTEGIDO: Deletar categoria (DELETE)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.categoriesService.remove(id);
  }
}
