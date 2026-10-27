// =============================================================================
// 🌱 SEED OFICIAL - Buteco do Papá
// Drizzle ORM + Neon Postgres
// Popula: 7 categorias, ~115 produtos + 1 usuário admin inicial
// Executar: node --env-file=.env src/scripts/seed.mjs
// =============================================================================

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, text, varchar, timestamp, boolean, decimal } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// ---------------------------------------------------------------------------
// Schema inline (espelha src/db/schema.ts)
// ---------------------------------------------------------------------------
const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  order: text('order').default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

const products = pgTable('products', {
  id: text('id').primaryKey(),
  categoryId: text('category_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  isNovelty: boolean('is_novelty').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

const users = pgTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  resetToken: text('reset_token'),
  resetTokenExpiry: timestamp('reset_token_expiry'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// Conexão
// ---------------------------------------------------------------------------
const sql = neon(process.env.DATABASE_URL);
const db  = drizzle({ client: sql });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const uid  = () => crypto.randomUUID();
const catId = (slug) => `cat-${slug}`;

// Cria produto já formatado para insert
const prod = (categoryId, name, price, isNovelty = false) => ({
  id: uid(),
  categoryId,
  name,
  description: '',
  price: String(price.toFixed(2)),
  isNovelty,
  isActive: true,
});

// ---------------------------------------------------------------------------
// Dados do cardápio (fiel ao cardápio físico nas fotos)
// ---------------------------------------------------------------------------
const MENU = [
  // ─── 1. PETISCOS ─────────────────────────────────────────────────────────
  {
    id: catId('petiscos'), name: 'Petiscos', order: '1',
    products: [
      ['Arrumadinho',                              45.00],
      ['Batata Fritas (500g)',                     25.00],
      ['Bolinho de Feijoada',                      35.00],
      ['Calabresa c/ Farofa e Salada',             35.00],
      ['Calabresa c/ Fritas',                      38.00],
      ['Camarão Alho e Óleo',                      40.00],
      ['Carne do Sol c/ Farofa e Salada',          40.00],
      ['Carne do Sol c/ Fritas',                   45.00],
      ['Charque c/ Farofa e Salada',               40.00],
      ["Charque c/ Feijão Verde e Farofa d'Água",  50.00],
      ['Charque c/ Fritas',                        45.00],
      ['Coxinha da Asa c/ Farofa e Salada',        38.00],
      ['Coxinha da Asa c/ Fritas',                 40.00],
      ['Cupim c/ Aipim',                           50.00],
      ['Escondidinho',                             50.00],
      ['Filé de Tilápia c/ Farofa e Salada',       40.00],
      ['Filé de Tilápia c/ Fritas',                45.00],
      ['Frango à Passarinha c/ Farofa e Salada',   38.00],
      ['Frango à Passarinha c/ Fritas',            40.00],
      ['Moela c/ Pão',                             25.00],
      ['Ovos de Codorna (dúzia)',                  12.00],
      ['Pitttinga c/ Farofa e Salada',             38.00],
      ['Siri Catado',                              50.00, true], // NOVIDADE
    ],
  },

  // ─── 2. CALDOS ───────────────────────────────────────────────────────────
  {
    id: catId('caldos'), name: 'Caldos', order: '2',
    products: [
      ['Caldo de Camarão',  18.00],
      ['Caldo de Feijão',   15.00],
      ['Caldo de Mocotó',   15.00],
      ['Caldo de Quenga',   18.00],
      ['Caldo de Sururu',   18.00],
      ['Caldo Verde',       18.00],
    ],
  },

  // ─── 3. REFEIÇÕES ────────────────────────────────────────────────────────
  {
    id: catId('refeicoes'), name: 'Refeições', order: '3',
    products: [
      ['Dobradinha (1 pessoa)',      35.00],
      ['Dobradinha (2 pessoas)',     60.00],
      ['Feijão Verde (1 pessoa)',    35.00],
      ['Feijão Verde (2 pessoas)',   60.00],
      ['Feijoada (1 pessoa)',        40.00],
      ['Feijoada (2 pessoas)',       70.00],
      ['Maniçoba',                   70.00],
      ['Mocofato (1 pessoa)',        35.00],
      ['Mocofato (2 pessoas)',       60.00],
      ['Sarapatel (1 pessoa)',       30.00],
      ['Sarapatel (2 pessoas)',      55.00],
      ['Xixim de Bofe (1 pessoa)',   30.00],
      ['Xixim de Bofe (2 pessoas)',  50.00],
    ],
  },

  // ─── 4. CERVEJA ──────────────────────────────────────────────────────────
  {
    id: catId('cerveja'), name: 'Cerveja', order: '4',
    products: [
      ['Amstel (600ml)',          12.00],
      ['Brahma Shopp (600ml)',    11.00],
      ['Budweiser (600ml)',       12.00],
      ['Chopp de Vinho (300ml)', 15.00],
      ['Devassa (600ml)',         10.00],
      ['Eisenbahn (600ml)',       13.00],
      ['Heineken (600ml)',        17.00],
      ['Império (600ml)',         14.00],
      ['Itaipava (600ml)',        10.00],
      ['Original (600ml)',        12.00],
      ['Skol (600ml)',            10.00],
      ['Spaten (600ml)',          13.00],
      ['Stella Artois (600ml)',   14.00],
      ['Stella Gold (600ml)',     17.00],
    ],
  },

  // ─── 5. LONG NECK E LATA ─────────────────────────────────────────────────
  {
    id: catId('longneck'), name: 'Long Neck e Lata', order: '5',
    products: [
      ['Amstel Ultra (269ml)',      6.00],
      ['Brahma Malzbier (330ml)',  10.00],
      ['Brahma Zero (lata)',        7.00],
      ['Corona (330ml)',           12.00],
      ['Corona Zero (330ml)',      12.00],
      ['Heineken (330ml)',         12.00],
      ['Heineken Zero (330ml)',    12.00],
      ['Império (330ml)',          10.00],
      ['Império Ultra (330ml)',     7.00],
      ['Itaipava (330ml)',          5.00],
    ],
  },

  // ─── 6. REFRIGERANTE E NÃO ALCOÓLICOS ────────────────────────────────────
  {
    id: catId('naoalcoolicos'), name: 'Refrigerante e Não Alcoólicos', order: '6',
    products: [
      ['Água Mineral Sem Gás',      3.00],
      ['Água Mineral Com Gás',      3.00],
      ['Água Tônica Schweppes',     7.00],
      ['Antarctica (lata)',          6.00],
      ['Antarctica (1lt)',          10.00],
      ['Coca-cola (lata)',           7.00],
      ['Coca-cola Zero (lata)',      7.00],
      ['Coca-cola (1lt)',           11.00],
      ['Coca-cola Zero (1lt)',      11.00],
      ['Fanta (lata)',               6.00],
      ['H2O',                        7.00],
      ['Pepsi (lata)',               6.00],
      ['Pepsi (1lt)',               10.00],
      ['Sprite (lata)',              6.00],
      ['Suco Del Valle',             7.00],
      ['Gatorade (Isotônico)',       8.00],
      ['Powerade (Isotônico)',       8.00],
      ['Bivolt (Energético)',        7.00],
      ['Red Bull (Energético)',     15.00],
    ],
  },

  // ─── 7. DESTILADOS (DOSE) ────────────────────────────────────────────────
  {
    id: catId('destilados'), name: 'Destilados (Dose)', order: '7',
    products: [
      // Whisky
      ["Ballantine's (Whisky)",         12.00],
      ['Black & White (Whisky)',         12.00],
      ['Black Label (Whisky)',           30.00],
      ['Chivas (Whisky)',                25.00],
      ['Old Eight (Whisky)',              8.00],
      ['Old Parr (Whisky)',              20.00],
      ['Passport (Whisky)',              12.00],
      ['Red Label (Whisky)',             15.00],
      // Vodka
      ['Absolut (Vodka)',               15.00],
      ['Orloff (Vodka)',                12.00],
      ['Smirnoff (Vodka)',               8.00],
      // Gin
      ["Rock's (Gin)",                   8.00],
      ['Seagers (Gin)',                  10.00],
      // Cachaça
      ['51 (Cachaça)',                   4.00],
      ['Cabaré (Cachaça)',              10.00],
      ['Gengibre (Cachaça)',             7.00],
      ['Olhos Verde (Cachaça)',          5.00],
      ['Seleta (Cachaça)',              10.00],
      ['Tequila',                        12.00],
      // Rum
      ['Bacardí (Rum)',                  8.00],
      ['Montila (Rum)',                  8.00],
      // Bitter
      ['Campari (Bitter)',              12.00],
      // Conhaque
      ['5 Estrelas (Conhaque)',          7.00],
      ['Dreher (Conhaque)',              9.00],
      ['Domecq (Conhaque)',             10.00],
      ['São João da Barra (Conhaque)',   7.00],
      // Vermute
      ['Martini (Vermute)',              8.00],
      // Ice
      ['51 Ice',                        10.00],
      ['Smirnoff Ice',                  10.00],
      ['Skol Beats',                    10.00],
    ],
  },
];

// ---------------------------------------------------------------------------
// Seed principal
// ---------------------------------------------------------------------------
async function seed() {
  console.log('\n🧹  Limpando dados antigos...');
  await db.delete(products);
  await db.delete(categories);
  console.log('   ✔ Categorias e produtos removidos.');

  let totalProducts = 0;

  for (const cat of MENU) {
    // Insere categoria
    await db.insert(categories).values({
      id: cat.id,
      name: cat.name,
      order: cat.order,
    });

    // Monta e insere produtos em lote
    const rows = cat.products.map(([name, price, isNovelty]) =>
      prod(cat.id, name, price, isNovelty ?? false)
    );
    await db.insert(products).values(rows);
    totalProducts += rows.length;

    console.log(`   ✔ [${cat.order}/7] ${cat.name} — ${rows.length} produto(s)`);
  }

  console.log(`\n🍺  Cardápio: ${MENU.length} categorias, ${totalProducts} produtos inseridos.`);

  // -------------------------------------------------------------------------
  // Admin padrão
  // -------------------------------------------------------------------------
  console.log('\n👤  Verificando usuário admin...');

  const ADMIN_EMAIL = 'admin@buteco.com';
  const ADMIN_NAME  = 'Administrador';
  const ADMIN_PASS  = 'Admin@2026';   // ← troque após o primeiro login!

  const [existing] = await db.select().from(users).where(eq(users.email, ADMIN_EMAIL));

  if (existing) {
    console.log(`   ⚠  Admin "${ADMIN_EMAIL}" já existe — mantido sem alterações.`);
  } else {
    const hashedPassword = await bcrypt.hash(ADMIN_PASS, 10);
    await db.insert(users).values({
      id: uid(),
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
    });
    console.log(`   ✔ Admin criado: ${ADMIN_EMAIL} / senha: ${ADMIN_PASS}`);
    console.log('   ⚠  Troque a senha após o primeiro login!');
  }

  console.log('\n✅  Seed concluído! Banco 100% pronto.\n');
}

seed().catch((err) => {
  console.error('\n❌  Erro durante o seed:', err);
  process.exit(1);
});
