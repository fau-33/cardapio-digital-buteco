import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../database/database.provider.js';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema.js';
import * as crypto from 'crypto';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProductsService {
  constructor(@Inject(DRIZZLE) private db: NeonHttpDatabase<typeof schema>) {}

  // Listar todos os produtos
  async findAll() {
    return await this.db.select().from(schema.products);
  }

  // Criar um novo produto
  async create(data: {
    name: string;
    description?: string;
    price: string;
    categoryId: string;
  }) {
    const [newProduct] = await this.db
      .insert(schema.products)
      .values({
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description || '',
        price: data.price,
        categoryId: data.categoryId,
        isActive: true,
      })
      .returning();

    return newProduct;
  }

  // Atualizar um produto pelo ID (ex: mudar preço ou nome)
  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: string;
      categoryId?: string;
      isActive?: boolean;
    },
  ) {
    const [updatedProduct] = await this.db
      .update(schema.products)
      .set(data)
      .where(eq(schema.products.id, id)) // <--- Usando eq() diretamente
      .returning();

    return updatedProduct;
  }

  // Deletar um produto pelo ID
  async remove(id: string) {
    const [deletedProduct] = await this.db
      .delete(schema.products)
      .where(eq(schema.products.id, id)) // <--- Usando eq() diretamente
      .returning();

    return deletedProduct;
  }
}
