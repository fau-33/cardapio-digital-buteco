import { Product } from "@/types";

const UNSPLASH_IMAGES = {
  beerDraft:
    "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=200&q=75",
  beerBottle:
    "https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=200&q=75",
  fries:
    "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=200&q=75",
  meat:
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=75",
  barSnacks:
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=200&q=75",
  seafood:
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=200&q=75",
  chicken:
    "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=200&q=75",
  fish:
    "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=200&q=75",
  broth:
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=200&q=75",
  meal:
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=75",
  cocktails:
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=200&q=75",
  spirits:
    "https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=200&q=75",
  soda:
    "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=75",
  water:
    "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=200&q=75",
  juice:
    "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=200&q=75",
} as const;

function normalizeText(value?: string | null): string {
  if (!value) return "";
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasAnyKeyword(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw));
}

/**
 * Retorna a imagem ilustrativa automática baseada nas palavras-chave do nome
 * do produto ou da categoria (sem considerar imageUrl customizada).
 */
export function getFallbackProductImageUrl(
  productName: string,
  categoryName?: string | null
): string {
  const name = normalizeText(productName).trim();
  const category = normalizeText(categoryName);
  const combined = `${name} ${category}`;

  // Imagens reais locais dos pratos oficiais do Buteco do Papá
  if (name === "arrumadinho" || name.startsWith("arrumadinho")) {
    return "/images/petiscos/arrumadinho.jpg";
  }
  if (name === "batata fritas (500g)" || name.startsWith("batata frita")) {
    return "/images/petiscos/batatas-fritas.jpg";
  }
  if (name === "bolinho de feijoada" || name.startsWith("bolinho de feijoada")) {
    return "/images/petiscos/bolinho-feijoada.jpg";
  }
  if (name === "calabresa c/ farofa e salada") {
    return "/images/petiscos/calabresa-farofa-salada.jpg";
  }
  if (name === "calabresa c/ fritas") {
    return "/images/petiscos/calabresa-fritas.jpg";
  }
  if (name === "camarao alho e oleo" || name.startsWith("camarao alho")) {
    return "/images/petiscos/camarao-alho-oleo.jpg";
  }
  if (name === "carne do sol c/ farofa e salada") {
    return "/images/petiscos/carne-sol-farofa-salada.jpg";
  }
  if (name === "carne do sol c/ fritas") {
    return "/images/petiscos/carne-sol-fritas.jpg";
  }
  if (name === "charque c/ farofa e salada") {
    return "/images/petiscos/charque-farofa-salada.jpg";
  }
  if (
    name === "charque c/ feijao verde e farofa d'agua" ||
    name === "charque c/ feijao verde e farofa d’agua" ||
    name.startsWith("charque c/ feijao verde")
  ) {
    return "/images/petiscos/charque-feijao-farofa.jpg";
  }
  if (name === "charque c/ fritas") {
    return "/images/petiscos/charque-fritas.jpg";
  }
  if (name === "coxinha da asa c/ farofa e salada") {
    return "/images/petiscos/coxinha-asa-farofa-salada.jpg";
  }
  if (name === "coxinha da asa c/ fritas") {
    return "/images/petiscos/coxinha-asa-fritas.jpg";
  }
  if (name === "cupim c/ aipim" || name.startsWith("cupim c/ aipim")) {
    return "/images/petiscos/cupim-aipim.jpg";
  }
  if (name === "escondidinho" || name.startsWith("escondidinho")) {
    return "/images/petiscos/escondidinho.jpg";
  }
  if (name === "file de tilapia c/ farofa e salada") {
    return "/images/petiscos/tilapia-farofa-salada.jpg";
  }
  if (name === "file de tilapia c/ fritas") {
    return "/images/petiscos/tilapia-fritas.jpg";
  }
  if (name === "frango a passarinha c/ farofa e salada") {
    return "/images/petiscos/frango-passarinha-farofa.jpg";
  }
  if (name === "frango a passarinha c/ fritas") {
    return "/images/petiscos/frango-passarinha-fritas.jpg";
  }
  if (name === "moela c/ pao") {
    return "/images/petiscos/moela-pao.jpg";
  }
  if (name.startsWith("ovos de codorna")) {
    return "/images/petiscos/ovos-codorna.jpg";
  }
  if (
    name === "pitttinga c/ farofa e salada" ||
    name === "pititinga c/ farofa e salada" ||
    name.startsWith("pititinga") ||
    name.startsWith("pitttinga")
  ) {
    return "/images/petiscos/pititinga-farofa-salada.jpg";
  }
  if (name === "siri catado" || name.startsWith("siri catado")) {
    return "/images/petiscos/siri-catado.jpg";
  }

  // Imagens reais locais dos Caldos oficiais do Buteco do Papá
  if (name === "caldo de camarao" || name.startsWith("caldo de camarao")) {
    return "/images/caldos/caldo-camarao.jpg";
  }
  if (name === "caldo de feijao" || name.startsWith("caldo de feijao")) {
    return "/images/caldos/caldo-feijao.jpg";
  }
  if (name === "caldo de mocoto" || name.startsWith("caldo de mocoto")) {
    return "/images/caldos/caldo-mocoto.jpg";
  }
  if (name === "caldo de quenga" || name.startsWith("caldo de quenga")) {
    return "/images/caldos/caldo-quenga.jpg";
  }
  if (name === "caldo de sururu" || name.startsWith("caldo de sururu")) {
    return "/images/caldos/caldo-sururu.jpg";
  }
  if (name === "caldo verde" || name.startsWith("caldo verde")) {
    return "/images/caldos/caldo-verde.jpg";
  }

  // Imagens reais locais das Refeições oficiais do Buteco do Papá
  if (name === "dobradinha (1 pessoa)" || name.startsWith("dobradinha (1")) {
    return "/images/refeicoes/dobradinha-1.jpg";
  }
  if (name === "dobradinha (2 pessoas)" || name.startsWith("dobradinha (2")) {
    return "/images/refeicoes/dobradinha-2.jpg";
  }
  if (name === "feijao verde (1 pessoa)" || name.startsWith("feijao verde (1")) {
    return "/images/refeicoes/feijao-verde-1.jpg";
  }
  if (name === "feijao verde (2 pessoas)" || name.startsWith("feijao verde (2")) {
    return "/images/refeicoes/feijao-verde-2.jpg";
  }
  if (name === "feijoada (1 pessoa)" || name.startsWith("feijoada (1")) {
    return "/images/refeicoes/feijoada-1.jpg";
  }
  if (name === "feijoada (2 pessoas)" || name.startsWith("feijoada (2")) {
    return "/images/refeicoes/feijoada-2.jpg";
  }
  if (name === "manicoba" || name.startsWith("manicoba")) {
    return "/images/refeicoes/manicoba.jpg";
  }
  if (name === "mocofato (1 pessoa)" || name.startsWith("mocofato (1")) {
    return "/images/refeicoes/mocofato-1.jpg";
  }
  if (name === "mocofato (2 pessoas)" || name.startsWith("mocofato (2")) {
    return "/images/refeicoes/mocofato-2.jpg";
  }
  if (name === "sarapatel (1 pessoa)" || name.startsWith("sarapatel (1")) {
    return "/images/refeicoes/sarapatel-1.jpg";
  }
  if (name === "sarapatel (2 pessoas)" || name.startsWith("sarapatel (2")) {
    return "/images/refeicoes/sarapatel-2.jpg";
  }
  if (
    name === "xixim de bofe (1 pessoa)" ||
    name === "xinxim de bofe (1 pessoa)" ||
    name.startsWith("xixim de bofe (1") ||
    name.startsWith("xinxim de bofe (1")
  ) {
    return "/images/refeicoes/xinxim-bofe-1.jpg";
  }
  if (
    name === "xixim de bofe (2 pessoas)" ||
    name === "xinxim de bofe (2 pessoas)" ||
    name.startsWith("xixim de bofe (2") ||
    name.startsWith("xinxim de bofe (2")
  ) {
    return "/images/refeicoes/xinxim-bofe-2.jpg";
  }

  // Imagens reais locais das Cervejas oficiais do Buteco do Papá
  if (name === "amstel (600ml)" || name.startsWith("amstel (600")) {
    return "/images/cervejas/amstel-600.jpg";
  }
  if (
    name === "brahma shopp (600ml)" ||
    name === "brahma chopp (600ml)" ||
    name.startsWith("brahma shopp") ||
    name.startsWith("brahma chopp") ||
    name.startsWith("brahma (600")
  ) {
    return "/images/cervejas/brahma-shopp-600.jpg";
  }
  if (name === "budweiser (600ml)" || name.startsWith("budweiser (600")) {
    return "/images/cervejas/budweiser-600.jpg";
  }
  if (name === "chopp de vinho (300ml)" || name.startsWith("chopp de vinho")) {
    return "/images/cervejas/chopp-vinho-300.jpg";
  }
  if (name === "devassa (600ml)" || name.startsWith("devassa")) {
    return "/images/cervejas/devassa-600.jpg";
  }
  if (name === "eisenbahn (600ml)" || name.startsWith("eisenbahn (600") || name === "eisenbahn") {
    return "/images/cervejas/eisenbahn-600.jpg";
  }
  if (name === "heineken (600ml)" || name.startsWith("heineken (600")) {
    return "/images/cervejas/heineken-600.jpg";
  }
  if (name === "imperio (600ml)" || name.startsWith("imperio (600")) {
    return "/images/cervejas/imperio-600.jpg";
  }
  if (name === "itaipava (600ml)" || name.startsWith("itaipava (600")) {
    return "/images/cervejas/itaipava-600.jpg";
  }
  if (name === "original (600ml)" || name.startsWith("original")) {
    return "/images/cervejas/original-600.jpg";
  }
  if (name === "skol (600ml)" || name.startsWith("skol (600")) {
    return "/images/cervejas/skol-600.jpg";
  }
  if (name === "spaten (600ml)" || name.startsWith("spaten")) {
    return "/images/cervejas/spaten-600.jpg";
  }
  if (name === "stella artois (600ml)" || name.startsWith("stella artois")) {
    return "/images/cervejas/stella-artois-600.jpg";
  }
  if (
    name === "stella gold (600ml)" ||
    name === "stella pure gold (600ml)" ||
    name.startsWith("stella gold") ||
    name.startsWith("stella pure gold")
  ) {
    return "/images/cervejas/stella-gold-600.jpg";
  }

  // 1. Caldos e Sopas
  if (
    hasAnyKeyword(name, ["caldo", "mocoto", "sururu", "quenga", "sopa"]) ||
    category.includes("caldo")
  ) {
    return UNSPLASH_IMAGES.broth;
  }

  // 2. Camarão, Siri e Frutos do Mar
  if (hasAnyKeyword(name, ["camarao", "siri", "caranguejo", "marisco"])) {
    return UNSPLASH_IMAGES.seafood;
  }

  // 3. Peixes (Tilápia, Pitinga, etc.)
  if (hasAnyKeyword(name, ["tilapia", "pitinga", "pitttinga", "peixe", "pescada"])) {
    return UNSPLASH_IMAGES.fish;
  }

  // 4. Frango, Coxinha da Asa, Moela, Codorna
  if (
    hasAnyKeyword(name, [
      "frango",
      "passarinha",
      "coxinha",
      "asa",
      "moela",
      "codorna",
    ])
  ) {
    return UNSPLASH_IMAGES.chicken;
  }

  // 5. Batata Frita, Aipim/Mandioca, Bolinhos e Porções fritas
  if (hasAnyKeyword(name, ["batata", "bolinho", "aipim", "mandioca", "polenta"])) {
    return UNSPLASH_IMAGES.fries;
  }

  // 6. Espetinhos, Calabresa, Arrumadinho, Escondidinho
  if (
    hasAnyKeyword(name, [
      "espetinho",
      "espeto",
      "calabresa",
      "arrumadinho",
      "escondidinho",
      "churrasco",
    ])
  ) {
    return UNSPLASH_IMAGES.barSnacks;
  }

  // 7. Carnes (Carne do Sol, Charque, Cupim, Picanha, Filé)
  if (
    hasAnyKeyword(name, [
      "carne",
      "charque",
      "cupim",
      "picanha",
      "alcatra",
      "contrafile",
      "fritas",
    ])
  ) {
    return UNSPLASH_IMAGES.meat;
  }

  // 8. Refeições e Pratos Típicos
  if (
    hasAnyKeyword(name, [
      "feijoada",
      "feijao",
      "dobradinha",
      "manicoba",
      "mocofato",
      "sarapatel",
      "xixim",
      "refeicao",
    ]) ||
    category.includes("refeic")
  ) {
    return UNSPLASH_IMAGES.meal;
  }

  // 9. Cervejas, Long Necks, Latas, Baldes e Chopp
  if (
    hasAnyKeyword(combined, [
      "cerveja",
      "balde",
      "chopp",
      "amstel",
      "brahma",
      "budweiser",
      "devassa",
      "eisenbahn",
      "heineken",
      "imperio",
      "itaipava",
      "original",
      "skol",
      "spaten",
      "stella",
      "corona",
      "long neck",
      "malzbier",
    ])
  ) {
    if (
      hasAnyKeyword(combined, [
        "long neck",
        "lata",
        "330ml",
        "269ml",
        "corona",
        "malzbier",
        "ultra",
      ]) &&
      !name.includes("skol beats")
    ) {
      return UNSPLASH_IMAGES.beerBottle;
    }
    return UNSPLASH_IMAGES.beerDraft;
  }

  // 10. Caipirinhas, Drinks, Ice, Gin, Tequila, Campari, Martini
  if (
    hasAnyKeyword(name, [
      "caipirinha",
      "caipiroska",
      "drink",
      "coquetel",
      "ice",
      "beats",
      "gin",
      "rock's",
      "rocks",
      "seagers",
      "campari",
      "martini",
      "tequila",
      "vermute",
      "bitter",
    ])
  ) {
    return UNSPLASH_IMAGES.cocktails;
  }

  // 11. Doses e Destilados (Whisky, Vodka, Cachaça, Rum, Conhaque)
  if (
    hasAnyKeyword(combined, [
      "dose",
      "destilado",
      "whisky",
      "whiskey",
      "ballantine",
      "black & white",
      "black label",
      "red label",
      "chivas",
      "old eight",
      "old parr",
      "passport",
      "vodka",
      "absolut",
      "orloff",
      "smirnoff",
      "cachaca",
      "51",
      "cabare",
      "gengibre",
      "olhos verde",
      "seleta",
      "rum",
      "bacardi",
      "montila",
      "conhaque",
      "5 estrelas",
      "dreher",
      "domecq",
      "sao joao",
    ])
  ) {
    return UNSPLASH_IMAGES.spirits;
  }

  // 12. Água Mineral, Tônica e H2O
  if (hasAnyKeyword(name, ["agua", "h2o", "tonica", "schweppes"])) {
    return UNSPLASH_IMAGES.water;
  }

  // 13. Sucos
  if (hasAnyKeyword(name, ["suco", "del valle", "laranja", "limao", "uva"])) {
    return UNSPLASH_IMAGES.juice;
  }

  // 14. Refrigerantes, Energéticos e Isotônicos
  if (
    hasAnyKeyword(combined, [
      "coca",
      "pepsi",
      "fanta",
      "sprite",
      "antarctica",
      "guarana",
      "refrigerante",
      "gatorade",
      "powerade",
      "isotonico",
      "bivolt",
      "red bull",
      "energetico",
      "nao alcoolic",
    ])
  ) {
    return UNSPLASH_IMAGES.soda;
  }

  // 15. Fallback padrão (Petiscos / Porções de Boteco)
  return UNSPLASH_IMAGES.barSnacks;
}

/**
 * Retorna a URL da imagem do produto: prioriza `product.imageUrl` se preenchida,
 * caso contrário retorna a imagem ilustrativa inteligente do cardápio.
 */
export function getProductImageUrl(
  product: Pick<Product, "name" | "imageUrl"> & { image_url?: string | null },
  categoryName?: string | null
): string {
  const customUrl = (product.imageUrl ?? product.image_url)?.trim();
  if (customUrl) {
    return customUrl;
  }
  return getFallbackProductImageUrl(product.name, categoryName);
}
