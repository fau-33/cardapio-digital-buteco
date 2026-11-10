import { Category, Product } from "@/types";

const MENU_CACHE_KEY = "buteco_papa_menu_cache_v3";

type RawSeedItem = [
  name: string,
  price: number,
  isNovelty?: boolean,
  imageUrl?: string,
];

function buildCategory(
  id: string,
  name: string,
  order: number,
  items: RawSeedItem[]
): Category {
  const products: Product[] = items
    .map(([prodName, price, isNovelty, imageUrl], idx) => ({
      id: `${id}-prod-${idx + 1}`,
      categoryId: id,
      name: prodName,
      description: "",
      price: price.toFixed(2),
      imageUrl,
      isNovelty: Boolean(isNovelty),
      isActive: true,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    id,
    name,
    order,
    products,
  };
}

/**
 * Cardápio oficial local do Buteco do Papá para carregamento instantâneo (0ms)
 * enquanto o backend sincroniza em background (Stale-While-Revalidate).
 */
export const INITIAL_MENU_CATEGORIES: Category[] = [
  buildCategory("cat-petiscos", "Petiscos", 1, [
    ["Arrumadinho", 45.0, false, "/images/petiscos/arrumadinho.jpg"],
    ["Batata Fritas (500g)", 25.0, false, "/images/petiscos/batatas-fritas.jpg"],
    ["Bolinho de Feijoada", 35.0, false, "/images/petiscos/bolinho-feijoada.jpg"],
    [
      "Calabresa c/ Farofa e Salada",
      35.0,
      false,
      "/images/petiscos/calabresa-farofa-salada.jpg",
    ],
    ["Calabresa c/ Fritas", 38.0],
    ["Camarão Alho e Óleo", 40.0],
    ["Carne do Sol c/ Farofa e Salada", 40.0],
    ["Carne do Sol c/ Fritas", 45.0],
    ["Charque c/ Farofa e Salada", 40.0],
    ["Charque c/ Feijão Verde e Farofa d'Água", 50.0],
    ["Charque c/ Fritas", 45.0],
    ["Coxinha da Asa c/ Farofa e Salada", 38.0],
    ["Coxinha da Asa c/ Fritas", 40.0],
    ["Cupim c/ Aipim", 50.0],
    ["Escondidinho", 50.0],
    [
      "Filé de Tilápia c/ Farofa e Salada",
      40.0,
      false,
      "/images/petiscos/tilapia-farofa-salada.jpg",
    ],
    [
      "Filé de Tilápia c/ Fritas",
      45.0,
      false,
      "/images/petiscos/tilapia-fritas.jpg",
    ],
    [
      "Frango à Passarinha c/ Farofa e Salada",
      38.0,
      false,
      "/images/petiscos/frango-passarinha-farofa.jpg",
    ],
    [
      "Frango à Passarinha c/ Fritas",
      40.0,
      false,
      "/images/petiscos/frango-passarinha-fritas.jpg",
    ],
    ["Moela c/ Pão", 25.0, false, "/images/petiscos/moela-pao.jpg"],
    [
      "Ovos de Codorna (dúzia)",
      12.0,
      false,
      "/images/petiscos/ovos-codorna.jpg",
    ],
    [
      "Pitttinga c/ Farofa e Salada",
      38.0,
      false,
      "/images/petiscos/pititinga-farofa-salada.jpg",
    ],
    ["Siri Catado", 50.0, true, "/images/petiscos/siri-catado.jpg"],
  ]),
  buildCategory("cat-caldos", "Caldos", 2, [
    ["Caldo de Camarão", 18.0],
    ["Caldo de Feijão", 15.0],
    ["Caldo de Mocotó", 15.0],
    ["Caldo de Quenga", 18.0],
    ["Caldo de Sururu", 18.0],
    ["Caldo Verde", 18.0],
  ]),
  buildCategory("cat-refeicoes", "Refeições", 3, [
    ["Dobradinha (1 pessoa)", 35.0],
    ["Dobradinha (2 pessoas)", 60.0],
    ["Feijão Verde (1 pessoa)", 35.0],
    ["Feijão Verde (2 pessoas)", 60.0],
    ["Feijoada (1 pessoa)", 40.0],
    ["Feijoada (2 pessoas)", 70.0],
    ["Maniçoba", 70.0],
    ["Mocofato (1 pessoa)", 35.0],
    ["Mocofato (2 pessoas)", 60.0],
    ["Sarapatel (1 pessoa)", 30.0],
    ["Sarapatel (2 pessoas)", 55.0],
    ["Xixim de Bofe (1 pessoa)", 30.0],
    ["Xixim de Bofe (2 pessoas)", 50.0],
  ]),
  buildCategory("cat-cerveja", "Cerveja", 4, [
    ["Amstel (600ml)", 12.0],
    ["Brahma Shopp (600ml)", 11.0],
    ["Budweiser (600ml)", 12.0],
    ["Chopp de Vinho (300ml)", 15.0],
    ["Devassa (600ml)", 10.0],
    ["Eisenbahn (600ml)", 13.0],
    ["Heineken (600ml)", 17.0],
    ["Império (600ml)", 14.0],
    ["Itaipava (600ml)", 10.0],
    ["Original (600ml)", 12.0],
    ["Skol (600ml)", 10.0],
    ["Spaten (600ml)", 13.0],
    ["Stella Artois (600ml)", 14.0],
    ["Stella Gold (600ml)", 17.0],
  ]),
  buildCategory("cat-longneck", "Long Neck e Lata", 5, [
    ["Amstel Ultra (269ml)", 6.0],
    ["Brahma Malzbier (330ml)", 10.0],
    ["Brahma Zero (lata)", 7.0],
    ["Corona (330ml)", 12.0],
    ["Corona Zero (330ml)", 12.0],
    ["Heineken (330ml)", 12.0],
    ["Heineken Zero (330ml)", 12.0],
    ["Império (330ml)", 10.0],
    ["Império Ultra (330ml)", 7.0],
    ["Itaipava (330ml)", 5.0],
  ]),
  buildCategory("cat-naoalcoolicos", "Não Alcoólicos", 6, [
    ["Água Mineral Sem Gás", 3.0],
    ["Água Mineral Com Gás", 3.0],
    ["Água Tônica Schweppes", 7.0],
    ["Antarctica (lata)", 6.0],
    ["Antarctica (1lt)", 10.0],
    ["Coca-cola (lata)", 7.0],
    ["Coca-cola Zero (lata)", 7.0],
    ["Coca-cola (1lt)", 11.0],
    ["Coca-cola Zero (1lt)", 11.0],
    ["Fanta (lata)", 6.0],
    ["H2O", 7.0],
    ["Pepsi (lata)", 6.0],
    ["Pepsi (1lt)", 10.0],
    ["Sprite (lata)", 6.0],
    ["Suco Del Valle", 7.0],
    ["Gatorade", 8.0],
    ["Powerade", 8.0],
    ["Bivolt (Energético)", 7.0],
    ["Red Bull", 15.0],
  ]),
  buildCategory("cat-destilados", "Destilados e Doses", 7, [
    ["Ballantine’s (Dose)", 12.0],
    ["Black & White (Dose)", 12.0],
    ["Black Label (Dose)", 30.0],
    ["Chivas (Dose)", 25.0],
    ["Old Eight (Dose)", 8.0],
    ["Old Parr (Dose)", 20.0],
    ["Passport (Dose)", 12.0],
    ["Red Label (Dose)", 15.0],
    ["Absolut (Dose)", 15.0],
    ["Orloff (Dose)", 12.0],
    ["Smirnoff (Dose)", 8.0],
    ["Rock’s (Dose)", 8.0],
    ["Seagers (Dose)", 10.0],
    ["51 (Dose)", 4.0],
    ["Cabaré (Dose)", 10.0],
    ["Gengibre (Dose)", 7.0],
    ["Olhos Verde (Dose)", 5.0],
    ["Seleta (Dose)", 10.0],
    ["Tequila (Dose)", 12.0],
    ["Bacardí (Dose)", 8.0],
    ["Montila (Dose)", 8.0],
    ["Campari (Bitter)", 12.0],
    ["5 Estrelas (Conhaque)", 7.0],
    ["Dreher (Conhaque)", 9.0],
    ["Domecq (Conhaque)", 10.0],
    ["São João da Barra (Conhaque)", 7.0],
    ["Martini (Vermute)", 8.0],
    ["51 Ice", 10.0],
    ["Smirnoff Ice", 10.0],
    ["Skol Beats", 10.0],
  ]),
];

export function getCachedMenu(): Category[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(MENU_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Category[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Ignora cache inválido
  }
  return null;
}

export function saveMenuToCache(categories: Category[]): void {
  if (typeof window === "undefined") return;
  try {
    if (Array.isArray(categories) && categories.length > 0) {
      localStorage.setItem(MENU_CACHE_KEY, JSON.stringify(categories));
    }
  } catch {
    // Ignora falhas de quota do localStorage
  }
}
