import { Category, Product } from "@/types";
import { getProductAccessibleDescription } from "@/lib/productImage";

export const MENU_CACHE_KEY = "buteco_papa_menu_cache_v15";

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
      altText: getProductAccessibleDescription(prodName, name),
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
    ["Calabresa c/ Fritas", 38.0, false, "/images/petiscos/calabresa-fritas.jpg"],
    ["Camarão Alho e Óleo", 40.0, false, "/images/petiscos/camarao-alho-oleo.jpg"],
    [
      "Carne do Sol c/ Farofa e Salada",
      40.0,
      false,
      "/images/petiscos/carne-sol-farofa-salada.jpg",
    ],
    ["Carne do Sol c/ Fritas", 45.0, false, "/images/petiscos/carne-sol-fritas.jpg"],
    [
      "Charque c/ Farofa e Salada",
      40.0,
      false,
      "/images/petiscos/charque-farofa-salada.jpg",
    ],
    [
      "Charque c/ Feijão Verde e Farofa d'Água",
      50.0,
      false,
      "/images/petiscos/charque-feijao-farofa.jpg",
    ],
    ["Charque c/ Fritas", 45.0, false, "/images/petiscos/charque-fritas.jpg"],
    [
      "Coxinha da Asa c/ Farofa e Salada",
      38.0,
      false,
      "/images/petiscos/coxinha-asa-farofa-salada.jpg",
    ],
    [
      "Coxinha da Asa c/ Fritas",
      40.0,
      false,
      "/images/petiscos/coxinha-asa-fritas.jpg",
    ],
    ["Cupim c/ Aipim", 50.0, false, "/images/petiscos/cupim-aipim.jpg"],
    ["Escondidinho", 50.0, false, "/images/petiscos/escondidinho.jpg"],
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
    ["Caldo de Camarão", 18.0, false, "/images/caldos/caldo-camarao.jpg"],
    ["Caldo de Feijão", 15.0, false, "/images/caldos/caldo-feijao.jpg"],
    ["Caldo de Mocotó", 15.0, false, "/images/caldos/caldo-mocoto.jpg"],
    ["Caldo de Quenga", 18.0, false, "/images/caldos/caldo-quenga.jpg"],
    ["Caldo de Sururu", 18.0, false, "/images/caldos/caldo-sururu.jpg"],
    ["Caldo Verde", 18.0, false, "/images/caldos/caldo-verde.jpg"],
  ]),
  buildCategory("cat-refeicoes", "Refeições", 3, [
    ["Dobradinha (1 pessoa)", 35.0, false, "/images/refeicoes/dobradinha-1.jpg"],
    ["Dobradinha (2 pessoas)", 60.0, false, "/images/refeicoes/dobradinha-2.jpg"],
    ["Feijão Verde (1 pessoa)", 35.0, false, "/images/refeicoes/feijao-verde-1.jpg"],
    ["Feijão Verde (2 pessoas)", 60.0, false, "/images/refeicoes/feijao-verde-2.jpg"],
    ["Feijoada (1 pessoa)", 40.0, false, "/images/refeicoes/feijoada-1.jpg"],
    ["Feijoada (2 pessoas)", 70.0, false, "/images/refeicoes/feijoada-2.jpg"],
    ["Maniçoba", 70.0, false, "/images/refeicoes/manicoba.jpg"],
    ["Mocofato (1 pessoa)", 35.0, false, "/images/refeicoes/mocofato-1.jpg"],
    ["Mocofato (2 pessoas)", 60.0, false, "/images/refeicoes/mocofato-2.jpg"],
    ["Sarapatel (1 pessoa)", 30.0, false, "/images/refeicoes/sarapatel-1.jpg"],
    ["Sarapatel (2 pessoas)", 55.0, false, "/images/refeicoes/sarapatel-2.jpg"],
    ["Xixim de Bofe (1 pessoa)", 30.0, false, "/images/refeicoes/xinxim-bofe-1.jpg"],
    ["Xixim de Bofe (2 pessoas)", 50.0, false, "/images/refeicoes/xinxim-bofe-2.jpg"],
  ]),
  buildCategory("cat-cerveja", "Cerveja", 4, [
    ["Amstel (600ml)", 12.0, false, "/images/cervejas/amstel-600.jpg"],
    ["Brahma Shopp (600ml)", 11.0, false, "/images/cervejas/brahma-shopp-600.jpg"],
    ["Budweiser (600ml)", 12.0, false, "/images/cervejas/budweiser-600.jpg"],
    ["Chopp de Vinho (300ml)", 15.0, false, "/images/cervejas/chopp-vinho-300.jpg"],
    ["Devassa (600ml)", 10.0, false, "/images/cervejas/devassa-600.jpg"],
    ["Eisenbahn (600ml)", 13.0, false, "/images/cervejas/eisenbahn-600.jpg"],
    ["Heineken (600ml)", 17.0, false, "/images/cervejas/heineken-600.jpg"],
    ["Império (600ml)", 14.0, false, "/images/cervejas/imperio-600.jpg"],
    ["Itaipava (600ml)", 10.0, false, "/images/cervejas/itaipava-600.jpg"],
    ["Original (600ml)", 12.0, false, "/images/cervejas/original-600.jpg"],
    ["Skol (600ml)", 10.0, false, "/images/cervejas/skol-600.jpg"],
    ["Spaten (600ml)", 13.0, false, "/images/cervejas/spaten-600.jpg"],
    ["Stella Artois (600ml)", 14.0, false, "/images/cervejas/stella-artois-600.jpg"],
    ["Stella Gold (600ml)", 17.0, false, "/images/cervejas/stella-gold-600.jpg"],
  ]),
  buildCategory("cat-longneck", "Long Neck e Lata", 5, [
    ["Amstel Ultra (269ml)", 6.0, false, "/images/longnecks-latas/amstel-ultra-lata.jpg"],
    ["Brahma Malzbier (330ml)", 10.0, false, "/images/longnecks-latas/brahma-malzbier.jpg"],
    ["Brahma Zero (lata)", 7.0, false, "/images/longnecks-latas/brahma-zero-lata.jpg"],
    ["Corona (330ml)", 12.0, false, "/images/longnecks-latas/corona-330.jpg"],
    ["Corona Zero (330ml)", 12.0, false, "/images/longnecks-latas/corona-zero-330.jpg"],
    ["Heineken (330ml)", 12.0, false, "/images/longnecks-latas/heineken-330.jpg"],
    ["Heineken Zero (330ml)", 12.0, false, "/images/longnecks-latas/heineken-zero-330.jpg"],
    ["Império (330ml)", 10.0, false, "/images/longnecks-latas/imperio-330.jpg"],
    ["Império Ultra (330ml)", 7.0, false, "/images/longnecks-latas/imperio-ultra-330.jpg"],
    ["Itaipava (330ml)", 5.0, false, "/images/longnecks-latas/itaipava-330.jpg"],
  ]),
  buildCategory("cat-naoalcoolicos", "Não Alcoólicos", 6, [
    ["Água Mineral Sem Gás", 3.0, false, "/images/nao-alcoolicos/agua-mineral-sem-gas.jpg"],
    ["Água Mineral Com Gás", 3.0, false, "/images/nao-alcoolicos/agua-mineral-com-gas.jpg"],
    ["Água Tônica Schweppes", 7.0, false, "/images/nao-alcoolicos/agua-tonica-schweppes.jpg"],
    ["Antarctica (lata)", 6.0, false, "/images/nao-alcoolicos/antarctica-lata.jpg"],
    ["Antarctica (1lt)", 10.0, false, "/images/nao-alcoolicos/antarctica-1l.jpg"],
    ["Coca-cola (lata)", 7.0, false, "/images/nao-alcoolicos/coca-cola-lata.jpg"],
    ["Coca-cola Zero (lata)", 7.0, false, "/images/nao-alcoolicos/coca-cola-zero-lata.jpg"],
    ["Coca-cola (1lt)", 11.0, false, "/images/nao-alcoolicos/coca-cola-1l.jpg"],
    ["Coca-cola Zero (1lt)", 11.0, false, "/images/nao-alcoolicos/coca-cola-zero-1l.jpg"],
    ["Fanta (lata)", 6.0, false, "/images/nao-alcoolicos/fanta-lata.jpg"],
    ["H2O", 7.0, false, "/images/nao-alcoolicos/h2oh-limao.jpg"],
    ["Pepsi (lata)", 6.0, false, "/images/nao-alcoolicos/pepsi-lata.jpg"],
    ["Pepsi (1lt)", 10.0, false, "/images/nao-alcoolicos/pepsi-1l.jpg"],
    ["Sprite (lata)", 6.0, false, "/images/nao-alcoolicos/sprite-lata.jpg"],
    ["Suco Del Valle", 7.0, false, "/images/nao-alcoolicos/suco-del-valle.jpg"],
    ["Gatorade", 8.0, false, "/images/nao-alcoolicos/gatorade.jpg"],
    ["Powerade", 8.0, false, "/images/nao-alcoolicos/powerade.jpg"],
    ["Bivolt (Energético)", 7.0, false, "/images/nao-alcoolicos/bivolt-energetico.jpg"],
    ["Red Bull", 15.0, false, "/images/nao-alcoolicos/red-bull.jpg"],
  ]),
  buildCategory("cat-destilados", "Destilados (Dose)", 7, [
    [
      "Ballantine's (Whisky)",
      12.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1794862374/buteco-do-papa/produtos/l9wzaik8mctmtutfp9hr.jpg",
    ],
    [
      "Black & White (Whisky)",
      12.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1794862476/buteco-do-papa/produtos/aqlhbyltlcvqevvtbu6w.jpg",
    ],
    [
      "Black Label (Whisky)",
      30.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1794862564/buteco-do-papa/produtos/f1vh2b4auiuf2flmvfse.jpg",
    ],
    [
      "Chivas (Whisky)",
      25.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1794862847/buteco-do-papa/produtos/zohfnznaivv4sz7krprk.jpg",
    ],
    ["Old Eight (Whisky)", 8.0],
    ["Old Parr (Whisky)", 20.0],
    [
      "Passport (Whisky)",
      12.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1795032986/buteco-do-papa/produtos/i7rdcwlp9qpc9lhukiwo.jpg",
    ],
    [
      "Red Label (Whisky)",
      15.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1795032985/buteco-do-papa/produtos/uecr3l3n54rrajvvwcna.jpg",
    ],
    [
      "Absolut (Vodka)",
      15.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1794862218/buteco-do-papa/produtos/pnslmxw6absq0spkrl5j.jpg",
    ],
    ["Orloff (Vodka)", 12.0],
    [
      "Smirnoff (Vodka)",
      8.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1795032982/buteco-do-papa/produtos/zqi0z8hdotrrzdohdbvm.jpg",
    ],
    [
      "Rock's (Gin)",
      8.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1795032984/buteco-do-papa/produtos/xfjabu8q8igi4jr0xyvo.jpg",
    ],
    [
      "Seagers (Gin)",
      10.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1795032984/buteco-do-papa/produtos/faknbaxawdxouehjboyj.jpg",
    ],
    [
      "51 (Cachaça)",
      4.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1794861977/buteco-do-papa/produtos/k1hqcbfky5lblgdq9por.jpg",
    ],
    [
      "Cabaré (Cachaça)",
      10.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1794862647/buteco-do-papa/produtos/ehue2onnr5pj7upcqnzs.jpg",
    ],
    [
      "Gengibre (Cachaça)",
      7.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1794863130/buteco-do-papa/produtos/sevopdd8rritosumm3ur.jpg",
    ],
    ["Olhos Verde (Cachaça)", 5.0],
    [
      "Seleta (Cachaça)",
      10.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1795032983/buteco-do-papa/produtos/rqdosdxvtwfqoxgsnwiy.jpg",
    ],
    [
      "Tequila",
      12.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1795032979/buteco-do-papa/produtos/zbakc8et5p7p5yujqukf.jpg",
    ],
    [
      "Bacardí (Rum)",
      8.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1794862293/buteco-do-papa/produtos/z3e3zgkbn5gtmiosccdf.jpg",
    ],
    [
      "Montila (Rum)",
      8.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1794863339/buteco-do-papa/produtos/holk4bxlrotu1spjdcjp.jpg",
    ],
    [
      "Campari (Bitter)",
      12.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1794862734/buteco-do-papa/produtos/q9soinltqdih0knkhtcd.jpg",
    ],
    [
      "5 Estrelas (Conhaque)",
      7.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1794861144/buteco-do-papa/produtos/wovi8lqckxaa2tyabhnb.jpg",
    ],
    [
      "Dreher (Conhaque)",
      9.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1794863026/buteco-do-papa/produtos/hhmfupwh0ub2edts47ms.jpg",
    ],
    [
      "Domecq (Conhaque)",
      10.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1794862947/buteco-do-papa/produtos/scfvnquuki1o5quwdnvj.jpg",
    ],
    [
      "São João da Barra (Conhaque)",
      7.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1795032980/buteco-do-papa/produtos/a8sw0oppcohtbdexm0ln.jpg",
    ],
    [
      "Martini (Vermute)",
      8.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1794863220/buteco-do-papa/produtos/dmepq9cbyt0mzkyiaais.jpg",
    ],
    [
      "51 Ice",
      10.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1794862107/buteco-do-papa/produtos/riiynlskxwchkixvflo9.jpg",
    ],
    [
      "Smirnoff Ice",
      10.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1795032981/buteco-do-papa/produtos/k4uf3ll0jtz4uoujczcn.jpg",
    ],
    [
      "Skol Beats",
      10.0,
      false,
      "https://res.cloudinary.com/zcg5o50x/image/upload/v1795032982/buteco-do-papa/produtos/hkvkhymnqk98ausrvgiz.jpg",
    ],
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
