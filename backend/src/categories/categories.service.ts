import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../database/database.provider.js';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema.js';
import * as crypto from 'crypto';

@Injectable()
export class CategoriesService {
  constructor(@Inject(DRIZZLE) private db: NeonHttpDatabase<typeof schema>) {}

  // Listar todas as categorias
  async findAll() {
    return await this.db.select().from(schema.categories);
  }

  // Criar uma nova categoria com ID e ordem automáticos se não forem informados
  async create(data: { id?: string; name: string; order?: string }) {
    const [newCategory] = await this.db
      .insert(schema.categories)
      .values({
        id: data.id || crypto.randomUUID(),
        name: data.name,
        order: data.order || '1',
      })
      .returning();

    return newCategory;
  }
}
