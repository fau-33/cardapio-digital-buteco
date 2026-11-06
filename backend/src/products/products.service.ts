import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../database/database.provider.js';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema.js';
import * as crypto from 'crypto';
import { and, asc, eq } from 'drizzle-orm';

export type UpdateProductInput = {
  name?: string;
  description?: string;
  price?: string;
  categoryId?: string;
  isNovelty?: boolean;
  isActive?: boolean;
};

@Injectable()
export class ProductsService {
  constructor(@Inject(DRIZZLE) private db: NeonHttpDatabase<typeof schema>) {}

  // Listar apenas os produtos ativos/disponíveis (rota pública)
  async findAll() {
    return await this.db
      .select()
      .from(schema.products)
      .where(eq(schema.products.isActive, true))
      .orderBy(asc(schema.products.name));
  }

  // Listar todos os produtos, inclusive inativos (rota protegida do Admin)
  async findAllAdmin() {
    return await this.db
      .select()
      .from(schema.products)
      .orderBy(asc(schema.products.name));
  }

  // Buscar produto ativo por ID (lança 404 se não existir ou estiver inativo)
  async findOne(id: string) {
    const [product] = await this.db
      .select()
      .from(schema.products)
      .where(
        and(eq(schema.products.id, id), eq(schema.products.isActive, true)),
      );

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    return product;
  }

  // Criar um novo produto
  async create(data: {
    name: string;
    description?: string;
    price: string;
    categoryId: string;
    isNovelty?: boolean;
    isActive?: boolean;
  }) {
    const [newProduct] = await this.db
      .insert(schema.products)
      .values({
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description || '',
        price: data.price,
        categoryId: data.categoryId,
        isNovelty: data.isNovelty ?? false,
        isActive: data.isActive ?? true,
      })
      .returning();

    return newProduct;
  }

  // Atualizar um produto pelo ID (ex: mudar preço, nome, novidade ou disponibilidade)
  async update(id: string, data: UpdateProductInput) {
    const [updatedProduct] = await this.db
      .update(schema.products)
      .set(data)
      .where(eq(schema.products.id, id))
      .returning();

    if (!updatedProduct) {
      throw new NotFoundException('Produto não encontrado.');
    }

    return updatedProduct;
  }

  // Atualização parcial de um produto (PATCH)
  async patch(id: string, data: UpdateProductInput) {
    return await this.update(id, data);
  }

  // Deletar um produto pelo ID
  async remove(id: string) {
    const [deletedProduct] = await this.db
      .delete(schema.products)
      .where(eq(schema.products.id, id))
      .returning();

    if (!deletedProduct) {
      throw new NotFoundException('Produto não encontrado.');
    }

    return deletedProduct;
  }
}
