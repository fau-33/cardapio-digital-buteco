import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../database/database.provider.js';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema.js';
import * as crypto from 'crypto';
import { eq, asc } from 'drizzle-orm';
import { formatToBrazilTime } from '../common/utils/date.helper.js';

@Injectable()
export class CategoriesService {
  constructor(@Inject(DRIZZLE) private db: NeonHttpDatabase<typeof schema>) {}

  // Listar todas as categorias
  async findAll() {
    const categories = await this.db
      .select()
      .from(schema.categories)
      .orderBy(asc(schema.categories.order));

    return categories.map((cat) => ({
      ...cat,
      createdAt: formatToBrazilTime(cat.createdAt),
    }));
  }

  // Criar nova categoria
  async create(data: { id?: string; name: string; order?: string }) {
    const [newCategory] = await this.db
      .insert(schema.categories)
      .values({
        id: data.id || `cat-${crypto.randomUUID().slice(0, 8)}`,
        name: data.name,
        order: data.order || '0',
      })
      .returning();

    return {
      ...newCategory,
      createdAt: formatToBrazilTime(newCategory.createdAt),
    };
  }

  // Atualizar Categoria
  async update(id: string, data: { name?: string; order?: string }) {
    const [existing] = await this.db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.id, id));

    if (!existing) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    const [updated] = await this.db
      .update(schema.categories)
      .set({
        ...(data.name && { name: data.name }),
        ...(data.order !== undefined && { order: data.order }),
      })
      .where(eq(schema.categories.id, id))
      .returning();

    return {
      ...updated,
      createdAt: formatToBrazilTime(updated.createdAt),
    };
  }

  // Deletar Categoria
  async remove(id: string) {
    const [existing] = await this.db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.id, id));

    if (!existing) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    await this.db
      .delete(schema.categories)
      .where(eq(schema.categories.id, id));

    return { message: 'Categoria removida com sucesso!' };
  }

  // Cardápio Público com filtro estrito de produtos ativos e ordenação
  async getMenu() {
    const categories = await this.db
      .select()
      .from(schema.categories)
      .orderBy(asc(schema.categories.order));

    const products = await this.db
      .select()
      .from(schema.products)
      .where(eq(schema.products.isActive, true));

    return categories.map((category) => ({
      ...category,
      createdAt: formatToBrazilTime(category.createdAt),
      products: products
        .filter((product) => product.categoryId === category.id)
        .map((product) => ({
          ...product,
          createdAt: formatToBrazilTime(product.createdAt),
        })),
    }));
  }
}
