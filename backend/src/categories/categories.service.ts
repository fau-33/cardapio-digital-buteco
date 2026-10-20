import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../database/database.provider.js';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class CategoriesService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  // Listar todas as categorias
  async findAll() {
    return await this.db.select().from(schema.categories);
  }

  // Criar uma nova categoria
  async create(data: { id: string; name: string; order?: string }) {
    const [newCategory] = await this.db
      .insert(schema.categories)
      .values({
        id: data.id,
        name: data.name,
        order: data.order || '0',
      })
      .returning();

    return newCategory;
  }
}
