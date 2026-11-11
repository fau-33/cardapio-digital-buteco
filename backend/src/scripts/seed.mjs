// =============================================================================
// 🌱 SEED OFICIAL - Buteco do Papá
// Drizzle ORM + Neon Postgres
// Popula: 7 categorias, ~115 produtos + 1 usuário admin inicial
// Executar: node --env-file=.env src/scripts/seed.mjs
// =============================================================================

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, text, integer, varchar, timestamp, boolean, decimal } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// ---------------------------------------------------------------------------
// Schema inline (espelha src/db/schema.ts)
// ---------------------------------------------------------------------------
const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

const products = pgTable('products', {
  id: text('id').primaryKey(),
  categoryId: text('category_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
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
const prod = (categoryId, name, price, isNovelty = false, imageUrl = null) => ({
  id: uid(),
  categoryId,
  name,
  description: '',
  price: String(price.toFixed(2)),
  imageUrl,
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
      ['Arrumadinho',                              45.00, false, '/images/petiscos/arrumadinho.jpg'],
      ['Batata Fritas (500g)',                     25.00, false, '/images/petiscos/batatas-fritas.jpg'],
      ['Bolinho de Feijoada',                      35.00, false, '/images/petiscos/bolinho-feijoada.jpg'],
      ['Calabresa c/ Farofa e Salada',             35.00, false, '/images/petiscos/calabresa-farofa-salada.jpg'],
      ['Calabresa c/ Fritas',                      38.00, false, '/images/petiscos/calabresa-fritas.jpg'],
      ['Camarão Alho e Óleo',                      40.00, false, '/images/petiscos/camarao-alho-oleo.jpg'],
      ['Carne do Sol c/ Farofa e Salada',          40.00, false, '/images/petiscos/carne-sol-farofa-salada.jpg'],
      ['Carne do Sol c/ Fritas',                   45.00, false, '/images/petiscos/carne-sol-fritas.jpg'],
      ['Charque c/ Farofa e Salada',               40.00, false, '/images/petiscos/charque-farofa-salada.jpg'],
      ["Charque c/ Feijão Verde e Farofa d'Água",  50.00, false, '/images/petiscos/charque-feijao-farofa.jpg'],
      ['Charque c/ Fritas',                        45.00, false, '/images/petiscos/charque-fritas.jpg'],
      ['Coxinha da Asa c/ Farofa e Salada',        38.00, false, '/images/petiscos/coxinha-asa-farofa-salada.jpg'],
      ['Coxinha da Asa c/ Fritas',                 40.00, false, '/images/petiscos/coxinha-asa-fritas.jpg'],
      ['Cupim c/ Aipim',                           50.00, false, '/images/petiscos/cupim-aipim.jpg'],
      ['Escondidinho',                             50.00, false, '/images/petiscos/escondidinho.jpg'],
      ['Filé de Tilápia c/ Farofa e Salada',       40.00, false, '/images/petiscos/tilapia-farofa-salada.jpg'],
      ['Filé de Tilápia c/ Fritas',                45.00, false, '/images/petiscos/tilapia-fritas.jpg'],
      ['Frango à Passarinha c/ Farofa e Salada',   38.00, false, '/images/petiscos/frango-passarinha-farofa.jpg'],
      ['Frango à Passarinha c/ Fritas',            40.00, false, '/images/petiscos/frango-passarinha-fritas.jpg'],
      ['Moela c/ Pão',                             25.00, false, '/images/petiscos/moela-pao.jpg'],
      ['Ovos de Codorna (dúzia)',                  12.00, false, '/images/petiscos/ovos-codorna.jpg'],
      ['Pitttinga c/ Farofa e Salada',             38.00, false, '/images/petiscos/pititinga-farofa-salada.jpg'],
      ['Siri Catado',                              50.00, true,  '/images/petiscos/siri-catado.jpg'], // NOVIDADE
    ],
  },

  // ─── 2. CALDOS ───────────────────────────────────────────────────────────
  {
    id: catId('caldos'), name: 'Caldos', order: '2',
    products: [
      ['Caldo de Camarão',  18.00, false, '/images/caldos/caldo-camarao.jpg'],
      ['Caldo de Feijão',   15.00, false, '/images/caldos/caldo-feijao.jpg'],
      ['Caldo de Mocotó',   15.00, false, '/images/caldos/caldo-mocoto.jpg'],
      ['Caldo de Quenga',   18.00, false, '/images/caldos/caldo-quenga.jpg'],
      ['Caldo de Sururu',   18.00, false, '/images/caldos/caldo-sururu.jpg'],
      ['Caldo Verde',       18.00, false, '/images/caldos/caldo-verde.jpg'],
    ],
  },

  // ─── 3. REFEIÇÕES ────────────────────────────────────────────────────────
  {
    id: catId('refeicoes'), name: 'Refeições', order: '3',
    products: [
      ['Dobradinha (1 pessoa)',      35.00, false, '/images/refeicoes/dobradinha-1.jpg'],
      ['Dobradinha (2 pessoas)',     60.00, false, '/images/refeicoes/dobradinha-2.jpg'],
      ['Feijão Verde (1 pessoa)',    35.00, false, '/images/refeicoes/feijao-verde-1.jpg'],
      ['Feijão Verde (2 pessoas)',   60.00, false, '/images/refeicoes/feijao-verde-2.jpg'],
      ['Feijoada (1 pessoa)',        40.00, false, '/images/refeicoes/feijoada-1.jpg'],
      ['Feijoada (2 pessoas)',       70.00, false, '/images/refeicoes/feijoada-2.jpg'],
      ['Maniçoba',                   70.00, false, '/images/refeicoes/manicoba.jpg'],
      ['Mocofato (1 pessoa)',        35.00, false, '/images/refeicoes/mocofato-1.jpg'],
      ['Mocofato (2 pessoas)',       60.00, false, '/images/refeicoes/mocofato-2.jpg'],
      ['Sarapatel (1 pessoa)',       30.00, false, '/images/refeicoes/sarapatel-1.jpg'],
      ['Sarapatel (2 pessoas)',      55.00, false, '/images/refeicoes/sarapatel-2.jpg'],
      ['Xixim de Bofe (1 pessoa)',   30.00, false, '/images/refeicoes/xinxim-bofe-1.jpg'],
      ['Xixim de Bofe (2 pessoas)',  50.00, false, '/images/refeicoes/xinxim-bofe-2.jpg'],
    ],
  },

  // ─── 4. CERVEJA ──────────────────────────────────────────────────────────
  {
    id: catId('cerveja'), name: 'Cerveja', order: '4',
    products: [
      ['Amstel (600ml)',          12.00, false, '/images/cervejas/amstel-600.jpg'],
      ['Brahma Shopp (600ml)',    11.00, false, '/images/cervejas/brahma-shopp-600.jpg'],
      ['Budweiser (600ml)',       12.00, false, '/images/cervejas/budweiser-600.jpg'],
      ['Chopp de Vinho (300ml)', 15.00, false, '/images/cervejas/chopp-vinho-300.jpg'],
      ['Devassa (600ml)',         10.00, false, '/images/cervejas/devassa-600.jpg'],
      ['Eisenbahn (600ml)',       13.00, false, '/images/cervejas/eisenbahn-600.jpg'],
      ['Heineken (600ml)',        17.00, false, '/images/cervejas/heineken-600.jpg'],
      ['Império (600ml)',         14.00, false, '/images/cervejas/imperio-600.jpg'],
      ['Itaipava (600ml)',        10.00, false, '/images/cervejas/itaipava-600.jpg'],
      ['Original (600ml)',        12.00, false, '/images/cervejas/original-600.jpg'],
      ['Skol (600ml)',            10.00, false, '/images/cervejas/skol-600.jpg'],
      ['Spaten (600ml)',          13.00, false, '/images/cervejas/spaten-600.jpg'],
      ['Stella Artois (600ml)',   14.00, false, '/images/cervejas/stella-artois-600.jpg'],
      ['Stella Gold (600ml)',     17.00, false, '/images/cervejas/stella-gold-600.jpg'],
    ],
  },

  // ─── 5. LONG NECK E LATA ─────────────────────────────────────────────────
  {
    id: catId('longneck'), name: 'Long Neck e Lata', order: '5',
    products: [
      ['Amstel Ultra (269ml)',      6.00, false, '/images/longnecks-latas/amstel-ultra-lata.jpg'],
      ['Brahma Malzbier (330ml)',  10.00, false, '/images/longnecks-latas/brahma-malzbier.jpg'],
      ['Brahma Zero (lata)',        7.00, false, '/images/longnecks-latas/brahma-zero-lata.jpg'],
      ['Corona (330ml)',           12.00, false, '/images/longnecks-latas/corona-330.jpg'],
      ['Corona Zero (330ml)',      12.00, false, '/images/longnecks-latas/corona-zero-330.jpg'],
      ['Heineken (330ml)',         12.00, false, '/images/longnecks-latas/heineken-330.jpg'],
      ['Heineken Zero (330ml)',    12.00, false, '/images/longnecks-latas/heineken-zero-330.jpg'],
      ['Império (330ml)',          10.00, false, '/images/longnecks-latas/imperio-330.jpg'],
      ['Império Ultra (330ml)',     7.00, false, '/images/longnecks-latas/imperio-ultra-330.jpg'],
      ['Itaipava (330ml)',          5.00, false, '/images/longnecks-latas/itaipava-330.jpg'],
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
      order: Number(cat.order),
    });

    // Monta e insere produtos em lote
    const rows = cat.products.map(([name, price, isNovelty, imageUrl]) =>
      prod(cat.id, name, price, isNovelty ?? false, imageUrl ?? null)
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

  const ADMIN_EMAIL = process.env.ADMIN_INITIAL_EMAIL || 'admin@buteco.com';
  const ADMIN_NAME  = process.env.ADMIN_INITIAL_NAME || 'Administrador';
  const ADMIN_PASS  = process.env.ADMIN_INITIAL_PASSWORD; // ← definido no .env, nunca no código

  const [existing] = await db.select().from(users).where(eq(users.email, ADMIN_EMAIL));

  if (existing) {
    console.log(`   ⚠  Admin "${ADMIN_EMAIL}" já existe — mantido sem alterações.`);
  } else if (!ADMIN_PASS) {
    console.log('   ⚠  ADMIN_INITIAL_PASSWORD não definida no .env — admin inicial NÃO foi criado.');
  } else {
    const hashedPassword = await bcrypt.hash(ADMIN_PASS, 10);
    await db.insert(users).values({
      id: uid(),
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
    });
    console.log(`   ✔ Admin criado: ${ADMIN_EMAIL} (senha definida em ADMIN_INITIAL_PASSWORD)`);
    console.log('   ⚠  Troque a senha após o primeiro login!');
  }

  console.log('\n✅  Seed concluído! Banco 100% pronto.\n');
}

seed().catch((err) => {
  console.error('\n❌  Erro durante o seed:', err);
  process.exit(1);
});
