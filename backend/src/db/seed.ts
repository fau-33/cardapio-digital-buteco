import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as crypto from 'crypto';
import * as schema from './schema.js';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error(
    '❌ DATABASE_URL não encontrada. Configure o arquivo .env antes de rodar o seed.',
  );
  process.exit(1);
}

const sql = neon(databaseUrl);
const db = drizzle({ client: sql, schema });

type SeedProduct = {
  name: string;
  price: number;
  isNovelty?: boolean;
  imageUrl?: string;
};

type SeedCategory = {
  name: string;
  order: number;
  products: SeedProduct[];
};

const menu: SeedCategory[] = [
  {
    name: 'Petiscos',
    order: 1,
    products: [
      {
        name: 'Arrumadinho',
        price: 45.0,
        imageUrl: '/images/petiscos/arrumadinho.jpg',
      },
      {
        name: 'Batata Fritas (500g)',
        price: 25.0,
        imageUrl: '/images/petiscos/batatas-fritas.jpg',
      },
      {
        name: 'Bolinho de Feijoada',
        price: 35.0,
        imageUrl: '/images/petiscos/bolinho-feijoada.jpg',
      },
      {
        name: 'Calabresa c/ Farofa e Salada',
        price: 35.0,
        imageUrl: '/images/petiscos/calabresa-farofa-salada.jpg',
      },
      {
        name: 'Calabresa c/ Fritas',
        price: 38.0,
        imageUrl: '/images/petiscos/calabresa-fritas.jpg',
      },
      {
        name: 'Camarão Alho e Óleo',
        price: 40.0,
        imageUrl: '/images/petiscos/camarao-alho-oleo.jpg',
      },
      {
        name: 'Carne do Sol c/ Farofa e Salada',
        price: 40.0,
        imageUrl: '/images/petiscos/carne-sol-farofa-salada.jpg',
      },
      {
        name: 'Carne do Sol c/ Fritas',
        price: 45.0,
        imageUrl: '/images/petiscos/carne-sol-fritas.jpg',
      },
      {
        name: 'Charque c/ Farofa e Salada',
        price: 40.0,
        imageUrl: '/images/petiscos/charque-farofa-salada.jpg',
      },
      {
        name: 'Charque c/ Feijão Verde e Farofa d’Água',
        price: 50.0,
        imageUrl: '/images/petiscos/charque-feijao-farofa.jpg',
      },
      {
        name: 'Charque c/ Fritas',
        price: 45.0,
        imageUrl: '/images/petiscos/charque-fritas.jpg',
      },
      {
        name: 'Coxinha da Asa c/ Farofa e Salada',
        price: 38.0,
        imageUrl: '/images/petiscos/coxinha-asa-farofa-salada.jpg',
      },
      {
        name: 'Coxinha da Asa c/ Fritas',
        price: 40.0,
        imageUrl: '/images/petiscos/coxinha-asa-fritas.jpg',
      },
      {
        name: 'Cupim c/ Aipim',
        price: 50.0,
        imageUrl: '/images/petiscos/cupim-aipim.jpg',
      },
      {
        name: 'Escondidinho',
        price: 50.0,
        imageUrl: '/images/petiscos/escondidinho.jpg',
      },
      {
        name: 'Filé de Tilápia c/ Farofa e Salada',
        price: 40.0,
        imageUrl: '/images/petiscos/tilapia-farofa-salada.jpg',
      },
      {
        name: 'Filé de Tilápia c/ Fritas',
        price: 45.0,
        imageUrl: '/images/petiscos/tilapia-fritas.jpg',
      },
      {
        name: 'Frango à Passarinha c/ Farofa e Salada',
        price: 38.0,
        imageUrl: '/images/petiscos/frango-passarinha-farofa.jpg',
      },
      {
        name: 'Frango à Passarinha c/ Fritas',
        price: 40.0,
        imageUrl: '/images/petiscos/frango-passarinha-fritas.jpg',
      },
      {
        name: 'Moela c/ Pão',
        price: 25.0,
        imageUrl: '/images/petiscos/moela-pao.jpg',
      },
      {
        name: 'Ovos de Codorna (dúzia)',
        price: 12.0,
        imageUrl: '/images/petiscos/ovos-codorna.jpg',
      },
      {
        name: 'Pitttinga c/ Farofa e Salada',
        price: 38.0,
        imageUrl: '/images/petiscos/pititinga-farofa-salada.jpg',
      },
      {
        name: 'Siri Catado',
        price: 50.0,
        isNovelty: true,
        imageUrl: '/images/petiscos/siri-catado.jpg',
      },
    ],
  },
  {
    name: 'Caldos',
    order: 2,
    products: [
      {
        name: 'Caldo de Camarão',
        price: 18.0,
        imageUrl: '/images/caldos/caldo-camarao.jpg',
      },
      {
        name: 'Caldo de Feijão',
        price: 15.0,
        imageUrl: '/images/caldos/caldo-feijao.jpg',
      },
      {
        name: 'Caldo de Mocotó',
        price: 15.0,
        imageUrl: '/images/caldos/caldo-mocoto.jpg',
      },
      {
        name: 'Caldo de Quenga',
        price: 18.0,
        imageUrl: '/images/caldos/caldo-quenga.jpg',
      },
      {
        name: 'Caldo de Sururu',
        price: 18.0,
        imageUrl: '/images/caldos/caldo-sururu.jpg',
      },
      {
        name: 'Caldo Verde',
        price: 18.0,
        imageUrl: '/images/caldos/caldo-verde.jpg',
      },
    ],
  },
  {
    name: 'Refeições',
    order: 3,
    products: [
      { name: 'Dobradinha (1 pessoa)', price: 35.0 },
      { name: 'Dobradinha (2 pessoas)', price: 60.0 },
      { name: 'Feijão Verde (1 pessoa)', price: 35.0 },
      { name: 'Feijão Verde (2 pessoas)', price: 60.0 },
      { name: 'Feijoada (1 pessoa)', price: 40.0 },
      { name: 'Feijoada (2 pessoas)', price: 70.0 },
      { name: 'Maniçoba', price: 70.0 },
      { name: 'Mocofato (1 pessoa)', price: 35.0 },
      { name: 'Mocofato (2 pessoas)', price: 60.0 },
      { name: 'Sarapatel (1 pessoa)', price: 30.0 },
      { name: 'Sarapatel (2 pessoas)', price: 55.0 },
      { name: 'Xixim de Bofe (1 pessoa)', price: 30.0 },
      { name: 'Xixim de Bofe (2 pessoas)', price: 50.0 },
    ],
  },
  {
    name: 'Cerveja',
    order: 4,
    products: [
      { name: 'Amstel (600ml)', price: 12.0 },
      { name: 'Brahma Shopp (600ml)', price: 11.0 },
      { name: 'Budweiser (600ml)', price: 12.0 },
      { name: 'Chopp de Vinho (300ml)', price: 15.0 },
      { name: 'Devassa (600ml)', price: 10.0 },
      { name: 'Eisenbahn (600ml)', price: 13.0 },
      { name: 'Heineken (600ml)', price: 17.0 },
      { name: 'Império (600ml)', price: 14.0 },
      { name: 'Itaipava (600ml)', price: 10.0 },
      { name: 'Original (600ml)', price: 12.0 },
      { name: 'Skol (600ml)', price: 10.0 },
      { name: 'Spaten (600ml)', price: 13.0 },
      { name: 'Stella Artois (600ml)', price: 14.0 },
      { name: 'Stella Gold (600ml)', price: 17.0 },
    ],
  },
  {
    name: 'Long Neck e Lata',
    order: 5,
    products: [
      { name: 'Amstel Ultra (269ml)', price: 6.0 },
      { name: 'Brahma Malzbier (330ml)', price: 10.0 },
      { name: 'Brahma Zero (lata)', price: 7.0 },
      { name: 'Corona (330ml)', price: 12.0 },
      { name: 'Corona Zero (330ml)', price: 12.0 },
      { name: 'Heineken (330ml)', price: 12.0 },
      { name: 'Heineken Zero (330ml)', price: 12.0 },
      { name: 'Império (330ml)', price: 10.0 },
      { name: 'Império Ultra (330ml)', price: 7.0 },
      { name: 'Itaipava (330ml)', price: 5.0 },
    ],
  },
  {
    name: 'Não Alcoólicos',
    order: 6,
    products: [
      { name: 'Água Mineral Sem Gás', price: 3.0 },
      { name: 'Água Mineral Com Gás', price: 3.0 },
      { name: 'Água Tônica Schweppes', price: 7.0 },
      { name: 'Antarctica (lata)', price: 6.0 },
      { name: 'Antarctica (1lt)', price: 10.0 },
      { name: 'Coca-cola (lata)', price: 7.0 },
      { name: 'Coca-cola Zero (lata)', price: 7.0 },
      { name: 'Coca-cola (1lt)', price: 11.0 },
      { name: 'Coca-cola Zero (1lt)', price: 11.0 },
      { name: 'Fanta (lata)', price: 6.0 },
      { name: 'H2O', price: 7.0 },
      { name: 'Pepsi (lata)', price: 6.0 },
      { name: 'Pepsi (1lt)', price: 10.0 },
      { name: 'Sprite (lata)', price: 6.0 },
      { name: 'Suco Del Valle', price: 7.0 },
      { name: 'Gatorade', price: 8.0 },
      { name: 'Powerade', price: 8.0 },
      { name: 'Bivolt (Energético)', price: 7.0 },
      { name: 'Red Bull', price: 15.0 },
    ],
  },
  {
    name: 'Destilados e Doses',
    order: 7,
    products: [
      // Whisky
      { name: 'Ballantine’s (Dose)', price: 12.0 },
      { name: 'Black & White (Dose)', price: 12.0 },
      { name: 'Black Label (Dose)', price: 30.0 },
      { name: 'Chivas (Dose)', price: 25.0 },
      { name: 'Old Eight (Dose)', price: 8.0 },
      { name: 'Old Parr (Dose)', price: 20.0 },
      { name: 'Passport (Dose)', price: 12.0 },
      { name: 'Red Label (Dose)', price: 15.0 },
      // Vodka
      { name: 'Absolut (Dose)', price: 15.0 },
      { name: 'Orloff (Dose)', price: 12.0 },
      { name: 'Smirnoff (Dose)', price: 8.0 },
      // Gin
      { name: 'Rock’s (Dose)', price: 8.0 },
      { name: 'Seagers (Dose)', price: 10.0 },
      // Cachaça
      { name: '51 (Dose)', price: 4.0 },
      { name: 'Cabaré (Dose)', price: 10.0 },
      { name: 'Gengibre (Dose)', price: 7.0 },
      { name: 'Olhos Verde (Dose)', price: 5.0 },
      { name: 'Seleta (Dose)', price: 10.0 },
      { name: 'Tequila (Dose)', price: 12.0 },
      // Rum
      { name: 'Bacardí (Dose)', price: 8.0 },
      { name: 'Montila (Dose)', price: 8.0 },
      // Outros
      { name: 'Campari (Bitter)', price: 12.0 },
      { name: '5 Estrelas (Conhaque)', price: 7.0 },
      { name: 'Dreher (Conhaque)', price: 9.0 },
      { name: 'Domecq (Conhaque)', price: 10.0 },
      { name: 'São João da Barra (Conhaque)', price: 7.0 },
      { name: 'Martini (Vermute)', price: 8.0 },
      // Ice
      { name: '51 Ice', price: 10.0 },
      { name: 'Smirnoff Ice', price: 10.0 },
      { name: 'Skol Beats', price: 10.0 },
    ],
  },
];

async function main() {
  console.log('🧹 Limpando dados antigos...');
  await db.delete(schema.products);
  await db.delete(schema.categories);

  console.log('🍺 Cadastrando o cardápio oficial do Buteco do Papá...');

  for (const category of menu) {
    const categoryId = `cat-${crypto.randomUUID().slice(0, 8)}`;

    await db.insert(schema.categories).values({
      id: categoryId,
      name: category.name,
      order: category.order,
    });

    await db.insert(schema.products).values(
      category.products.map((product) => ({
        id: crypto.randomUUID(),
        categoryId,
        name: product.name,
        price: product.price.toFixed(2),
        imageUrl: product.imageUrl ?? null,
        isNovelty: product.isNovelty ?? false,
        isActive: true,
      })),
    );

    console.log(`  ✓ ${category.name} (${category.products.length} itens)`);
  }

  console.log('✅ Cardápio oficial populado com sucesso!');
}

main().catch((error) => {
  console.error('❌ Falha ao popular o cardápio:', error);
  process.exitCode = 1;
});
