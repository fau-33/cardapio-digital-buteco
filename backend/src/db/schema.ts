import {
  pgTable,
  text,
  timestamp,
  boolean,
  decimal,
} from 'drizzle-orm/pg-core';

// 1. Tabela de Categorias / Seções
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  order: text('order').default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Tabela de Produtos / Itens do Cardápio
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  isNovelty: boolean('is_novelty').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Tabela de Logs (Tela de Dev)
export const devLogs = pgTable('dev_logs', {
  id: text('id').primaryKey(),
  level: text('level').notNull(), // 'info', 'warn', 'error'
  message: text('message').notNull(),
  endpoint: text('endpoint'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
