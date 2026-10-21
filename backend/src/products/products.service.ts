import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../database/database.provider.js';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema.js';
import * as crypto from 'crypto';

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
}
