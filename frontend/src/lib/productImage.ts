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

  // Imagens reais locais das Long Necks e Latas oficiais do Buteco do Papá
  if (name === "amstel ultra (269ml)" || name.startsWith("amstel ultra")) {
    return "/images/longnecks-latas/amstel-ultra-lata.jpg";
  }
  if (name === "brahma malzbier (330ml)" || name.startsWith("brahma malzbier")) {
    return "/images/longnecks-latas/brahma-malzbier.jpg";
  }
  if (name === "brahma zero (lata)" || name.startsWith("brahma zero")) {
    return "/images/longnecks-latas/brahma-zero-lata.jpg";
  }
  if (name === "corona zero (330ml)" || name.startsWith("corona zero") || name.startsWith("corona cero")) {
    return "/images/longnecks-latas/corona-zero-330.jpg";
  }
  if (name === "corona (330ml)" || name.startsWith("corona (330") || name.startsWith("corona extra")) {
    return "/images/longnecks-latas/corona-330.jpg";
  }
  if (name === "heineken zero (330ml)" || name.startsWith("heineken zero") || name.startsWith("heineken 0")) {
    return "/images/longnecks-latas/heineken-zero-330.jpg";
  }
  if (name === "heineken (330ml)" || name.startsWith("heineken (330")) {
    return "/images/longnecks-latas/heineken-330.jpg";
  }
  if (name === "imperio ultra (330ml)" || name.startsWith("imperio ultra")) {
    return "/images/longnecks-latas/imperio-ultra-330.jpg";
  }
  if (name === "imperio (330ml)" || name.startsWith("imperio (330")) {
    return "/images/longnecks-latas/imperio-330.jpg";
  }
  if (name === "itaipava (330ml)" || name.startsWith("itaipava (330")) {
    return "/images/longnecks-latas/itaipava-330.jpg";
  }

  // Imagens reais locais dos Refrigerantes e Não Alcoólicos oficiais do Buteco do Papá
  if (name === "agua mineral sem gas" || name.startsWith("agua mineral sem gas")) {
    return "/images/nao-alcoolicos/agua-mineral-sem-gas.jpg";
  }
  if (name === "agua mineral com gas" || name.startsWith("agua mineral com gas")) {
    return "/images/nao-alcoolicos/agua-mineral-com-gas.jpg";
  }
  if (name === "agua tonica schweppes" || name.startsWith("agua tonica")) {
    return "/images/nao-alcoolicos/agua-tonica-schweppes.jpg";
  }
  if (name === "antarctica (lata)" || name.startsWith("antarctica (lata")) {
    return "/images/nao-alcoolicos/antarctica-lata.jpg";
  }
  if (name === "antarctica (1lt)" || name.startsWith("antarctica (1")) {
    return "/images/nao-alcoolicos/antarctica-1l.jpg";
  }
  if (name === "coca-cola zero (lata)" || name.startsWith("coca-cola zero (lata")) {
    return "/images/nao-alcoolicos/coca-cola-zero-lata.jpg";
  }
  if (name === "coca-cola (lata)" || name.startsWith("coca-cola (lata")) {
    return "/images/nao-alcoolicos/coca-cola-lata.jpg";
  }
  if (name === "coca-cola zero (1lt)" || name.startsWith("coca-cola zero (1")) {
    return "/images/nao-alcoolicos/coca-cola-zero-1l.jpg";
  }
  if (name === "coca-cola (1lt)" || name.startsWith("coca-cola (1")) {
    return "/images/nao-alcoolicos/coca-cola-1l.jpg";
  }
  if (name === "fanta (lata)" || name.startsWith("fanta (lata") || name === "fanta") {
    return "/images/nao-alcoolicos/fanta-lata.jpg";
  }
  if (name === "h2o" || name.startsWith("h2o") || name.startsWith("h2oh")) {
    return "/images/nao-alcoolicos/h2oh-limao.jpg";
  }
  if (name === "pepsi (lata)" || name.startsWith("pepsi (lata")) {
    return "/images/nao-alcoolicos/pepsi-lata.jpg";
  }
  if (name === "pepsi (1lt)" || name.startsWith("pepsi (1")) {
    return "/images/nao-alcoolicos/pepsi-1l.jpg";
  }
  if (name === "sprite (lata)" || name.startsWith("sprite")) {
    return "/images/nao-alcoolicos/sprite-lata.jpg";
  }
  if (name === "suco del valle" || name.startsWith("suco del valle")) {
    return "/images/nao-alcoolicos/suco-del-valle.jpg";
  }
  if (name === "gatorade" || name.startsWith("gatorade")) {
    return "/images/nao-alcoolicos/gatorade.jpg";
  }
  if (name === "powerade" || name.startsWith("powerade")) {
    return "/images/nao-alcoolicos/powerade.jpg";
  }
  if (name === "bivolt (energetico)" || name.startsWith("bivolt")) {
    return "/images/nao-alcoolicos/bivolt-energetico.jpg";
  }
  if (name === "red bull" || name.startsWith("red bull")) {
    return "/images/nao-alcoolicos/red-bull.jpg";
  }

  // Imagens oficiais dos Destilados e Doses no Cloudinary
  if (name === "5 estrelas (conhaque)" || name.startsWith("5 estrelas")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1794861144/buteco-do-papa/produtos/wovi8lqckxaa2tyabhnb.jpg";
  }
  if (name === "51 (cachaca)" || name === "51 (dose)") {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1794861977/buteco-do-papa/produtos/k1hqcbfky5lblgdq9por.jpg";
  }
  if (name === "51 ice" || name.startsWith("51 ice")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1794862107/buteco-do-papa/produtos/riiynlskxwchkixvflo9.jpg";
  }
  if (name.startsWith("absolut")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1794862218/buteco-do-papa/produtos/pnslmxw6absq0spkrl5j.jpg";
  }
  if (name.startsWith("bacardi")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1794862293/buteco-do-papa/produtos/z3e3zgkbn5gtmiosccdf.jpg";
  }
  if (name.startsWith("ballantine")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1794862374/buteco-do-papa/produtos/l9wzaik8mctmtutfp9hr.jpg";
  }
  if (name.startsWith("black & white")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1794862476/buteco-do-papa/produtos/aqlhbyltlcvqevvtbu6w.jpg";
  }
  if (name.startsWith("black label")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1794862564/buteco-do-papa/produtos/f1vh2b4auiuf2flmvfse.jpg";
  }
  if (name.startsWith("cabare")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1794862647/buteco-do-papa/produtos/ehue2onnr5pj7upcqnzs.jpg";
  }
  if (name.startsWith("campari")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1794862734/buteco-do-papa/produtos/q9soinltqdih0knkhtcd.jpg";
  }
  if (name.startsWith("chivas")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1794862847/buteco-do-papa/produtos/zohfnznaivv4sz7krprk.jpg";
  }
  if (name.startsWith("domecq")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1794862947/buteco-do-papa/produtos/scfvnquuki1o5quwdnvj.jpg";
  }
  if (name.startsWith("dreher")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1794863026/buteco-do-papa/produtos/hhmfupwh0ub2edts47ms.jpg";
  }
  if (name.startsWith("gengibre")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1794863130/buteco-do-papa/produtos/sevopdd8rritosumm3ur.jpg";
  }
  if (name.startsWith("martini")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1794863220/buteco-do-papa/produtos/dmepq9cbyt0mzkyiaais.jpg";
  }
  if (name.startsWith("montila")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1794863339/buteco-do-papa/produtos/holk4bxlrotu1spjdcjp.jpg";
  }
  if (name.startsWith("passport")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1795032986/buteco-do-papa/produtos/i7rdcwlp9qpc9lhukiwo.jpg";
  }
  if (name.startsWith("red label")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1795032985/buteco-do-papa/produtos/uecr3l3n54rrajvvwcna.jpg";
  }
  if (name.startsWith("rock's") || name.startsWith("rock’s") || name.startsWith("rocks")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1795032984/buteco-do-papa/produtos/xfjabu8q8igi4jr0xyvo.jpg";
  }
  if (name.startsWith("seagers")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1795032984/buteco-do-papa/produtos/faknbaxawdxouehjboyj.jpg";
  }
  if (name.startsWith("seleta")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1795032983/buteco-do-papa/produtos/rqdosdxvtwfqoxgsnwiy.jpg";
  }
  if (name.startsWith("skol beats")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1795032982/buteco-do-papa/produtos/hkvkhymnqk98ausrvgiz.jpg";
  }
  if (name === "smirnoff ice" || name.startsWith("smirnoff ice")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1795032981/buteco-do-papa/produtos/k4uf3ll0jtz4uoujczcn.jpg";
  }
  if (name.startsWith("smirnoff")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1795032982/buteco-do-papa/produtos/zqi0z8hdotrrzdohdbvm.jpg";
  }
  if (name.startsWith("sao joao da barra")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1795032980/buteco-do-papa/produtos/a8sw0oppcohtbdexm0ln.jpg";
  }
  if (name === "tequila" || name.startsWith("tequila")) {
    return "https://res.cloudinary.com/zcg5o50x/image/upload/v1795032979/buteco-do-papa/produtos/zbakc8et5p7p5yujqukf.jpg";
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

function sanitizeCloudinaryUrl(url: string): string {
  // Substitui a versão antiga cortada (v1794857447) pela versão íntegra (v1794861144)
  let clean = url.replace(
    "v1794857447/buteco-do-papa/produtos/wovi8lqckxaa2tyabhnb",
    "v1794861144/buteco-do-papa/produtos/wovi8lqckxaa2tyabhnb"
  );
  // Remove eventuais transformações de corte na URL do Cloudinary
  if (clean.includes("res.cloudinary.com")) {
    clean = clean.replace(/\/c_(fill|crop|thumb|auto)[^/]*\//g, "/");
  }
  return clean;
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
    return sanitizeCloudinaryUrl(customUrl);
  }
  return getFallbackProductImageUrl(product.name, categoryName);
}

/**
 * Retorna a URL em alta resolução para exibição ampliada no modal (LightBox).
 */
export function getHighResProductImageUrl(imageSrc: string): string {
  if (!imageSrc) return imageSrc;
  if (imageSrc.includes("res.cloudinary.com")) {
    return sanitizeCloudinaryUrl(imageSrc);
  }
  if (imageSrc.includes("images.unsplash.com")) {
    return imageSrc
      .replace(/w=\d+/g, "w=1200")
      .replace(/q=\d+/g, "q=90");
  }
  return imageSrc;
}

/**
 * Mapa descritivo acessível com o nome oficial e os ingredientes/características
 * principais de cada prato e bebida do cardápio para leitores de tela.
 */
export function getProductAccessibleDescription(
  productName: string,
  categoryName?: string | null
): string {
  const name = normalizeText(productName).replace(/’/g, "'").trim();
  const category = normalizeText(categoryName);
  const combined = `${name} ${category}`;

  // ─── 1. PETISCOS ─────────────────────────────────────────────────────────
  if (name === "arrumadinho" || name.startsWith("arrumadinho")) {
    return "Prato de Arrumadinho com carne do sol, farofa e salada fresca";
  }
  if (name === "batata fritas (500g)" || name.startsWith("batata frita")) {
    return "Porção de Batata Fritas (500g) douradas, crocantes e sequinhas";
  }
  if (name === "bolinho de feijoada" || name.startsWith("bolinho de feijoada")) {
    return "Porção de Bolinho de Feijoada crocante por fora e recheado com feijão preto, carnes defumadas e couve";
  }
  if (name === "calabresa c/ farofa e salada") {
    return "Prato de Calabresa fatiada e acebolada na chapa com farofa crocante e salada fresca";
  }
  if (name === "calabresa c/ fritas") {
    return "Porção de Calabresa fatiada e acebolada acompanhada de batatas fritas crocantes";
  }
  if (name === "camarao alho e oleo" || name.startsWith("camarao alho")) {
    return "Porção de Camarão Alho e Óleo salteado com alho dourado crocante, azeite e ervas frescas";
  }
  if (name === "carne do sol c/ farofa e salada") {
    return "Prato de Carne do Sol assada na chapa com cebola roxa, farofa tradicional e salada fresca";
  }
  if (name === "carne do sol c/ fritas") {
    return "Porção de Carne do Sol suculenta em tiras aceboladas acompanhada de batatas fritas douradas";
  }
  if (name === "charque c/ farofa e salada") {
    return "Prato de Charque acebolada na manteiga acompanhada de farofa crocante e salada vinagrete fresca";
  }
  if (
    name === "charque c/ feijao verde e farofa d'agua" ||
    name.startsWith("charque c/ feijao verde")
  ) {
    return "Prato de Charque acebolada servida com feijão verde cremoso, temperos regionais e farofa d'água";
  }
  if (name === "charque c/ fritas") {
    return "Porção de Charque em cubos acebolada acompanhada de batatas fritas crocantes";
  }
  if (name === "coxinha da asa c/ farofa e salada") {
    return "Porção de Coxinha da Asa de frango frita e dourada com farofa temperada e salada fresca";
  }
  if (name === "coxinha da asa c/ fritas") {
    return "Porção de Coxinha da Asa de frango empanada e crocante acompanhada de batatas fritas";
  }
  if (name === "cupim c/ aipim" || name.startsWith("cupim c/ aipim")) {
    return "Prato de Cupim bovino macio e suculento assado com aipim cozido na manteiga de garrafa";
  }
  if (name === "escondidinho" || name.startsWith("escondidinho")) {
    return "Prato de Escondidinho gratinado com purê cremoso de aipim, recheio de carne seca desfiada e queijo coalho";
  }
  if (name === "file de tilapia c/ farofa e salada") {
    return "Prato de Filé de Tilápia empanado e crocante acompanhado de farofa, limão e salada fresca";
  }
  if (name === "file de tilapia c/ fritas") {
    return "Porção de Filé de Tilápia frito em iscas crocantes acompanhado de batatas fritas e limão";
  }
  if (name === "frango a passarinha c/ farofa e salada") {
    return "Porção de Frango à Passarinha dourado com alho crocante e salsa, acompanhado de farofa e salada fresca";
  }
  if (name === "frango a passarinha c/ fritas") {
    return "Porção de Frango à Passarinha crocante temperado no alho e óleo com batatas fritas";
  }
  if (name === "moela c/ pao") {
    return "Porção de Moela de frango cozida ao molho caseiro encorpado e temperado, servida com pão fatiado";
  }
  if (name.startsWith("ovos de codorna")) {
    return "Porção de Ovos de Codorna (dúzia) cozidos e temperados com azeite, orégano e ervas finas";
  }
  if (
    name === "pitttinga c/ farofa e salada" ||
    name === "pititinga c/ farofa e salada" ||
    name.startsWith("pititinga") ||
    name.startsWith("pitttinga")
  ) {
    return "Porção de Pititinga frita inteira bem crocante acompanhada de farofa, limão e salada fresca";
  }
  if (name === "siri catado" || name.startsWith("siri catado")) {
    return "Prato de Siri Catado refogado com azeite de dendê, leite de coco, tomate, cebola e coentro fresco";
  }

  // ─── 2. CALDOS ───────────────────────────────────────────────────────────
  if (name === "caldo de camarao" || name.startsWith("caldo de camarao")) {
    return "Tigela de Caldo de Camarão quente e cremoso preparado com camarões, leite de coco, azeite de dendê e coentro";
  }
  if (name === "caldo de feijao" || name.startsWith("caldo de feijao")) {
    return "Tigela de Caldo de Feijão encorpado temperado com bacon crocante, calabresa, alho e cheiro-verde";
  }
  if (name === "caldo de mocoto" || name.startsWith("caldo de mocoto")) {
    return "Tigela de Caldo de Mocotó tradicional bem quente, rico em colágeno e temperado com especiarias e coentro fresco";
  }
  if (name === "caldo de quenga" || name.startsWith("caldo de quenga")) {
    return "Tigela de Caldo de Quenga cremoso preparado com frango desfiado, aipim, milho verde e temperos caseiros";
  }
  if (name === "caldo de sururu" || name.startsWith("caldo de sururu")) {
    return "Tigela de Caldo de Sururu tradicional preparado com mariscos frescos, leite de coco, azeite de dendê e coentro";
  }
  if (name === "caldo verde" || name.startsWith("caldo verde")) {
    return "Tigela de Caldo Verde cremoso à base de batata com couve fatiada fina e rodelas de linguiça calabresa";
  }

  // ─── 3. REFEIÇÕES ────────────────────────────────────────────────────────
  if (name === "dobradinha (1 pessoa)" || name.startsWith("dobradinha (1")) {
    return "Refeição de Dobradinha (1 pessoa) cozida com feijão branco, calabresa, bacon, temperos regionais, arroz e farofa";
  }
  if (name === "dobradinha (2 pessoas)" || name.startsWith("dobradinha (2")) {
    return "Refeição de Dobradinha (2 pessoas) completa com bucho bovino, feijão branco, charque, calabresa, arroz e farofa";
  }
  if (name === "feijao verde (1 pessoa)" || name.startsWith("feijao verde (1")) {
    return "Refeição de Feijão Verde (1 pessoa) cremoso com queijo coalho, nata, temperos verdes, arroz e farofa";
  }
  if (name === "feijao verde (2 pessoas)" || name.startsWith("feijao verde (2")) {
    return "Refeição de Feijão Verde (2 pessoas) bem temperado com queijo coalho, cheiro-verde, arroz e farofa";
  }
  if (name === "feijoada (1 pessoa)" || name.startsWith("feijoada (1")) {
    return "Refeição de Feijoada (1 pessoa) tradicional com feijão preto, carnes selecionadas, arroz, farofa, couve e laranja";
  }
  if (name === "feijoada (2 pessoas)" || name.startsWith("feijoada (2")) {
    return "Refeição de Feijoada (2 pessoas) completa com feijão preto, charque, calabresa, paio, arroz, farofa, couve e laranja";
  }
  if (name === "manicoba" || name.startsWith("manicoba")) {
    return "Refeição de Maniçoba tradicional preparada com folhas de mandioca cozidas e carnes defumadas, servida com arroz e farofa";
  }
  if (name === "mocofato (1 pessoa)" || name.startsWith("mocofato (1")) {
    return "Refeição de Mocofato (1 pessoa) tradicional com mocotó, fato bovino, temperos fortes, arroz branco e farofa";
  }
  if (name === "mocofato (2 pessoas)" || name.startsWith("mocofato (2")) {
    return "Refeição de Mocofato (2 pessoas) completo com mocotó, dobradinha, calabresa, temperos baianos, arroz e farofa";
  }
  if (name === "sarapatel (1 pessoa)" || name.startsWith("sarapatel (1")) {
    return "Refeição de Sarapatel (1 pessoa) preparado com miúdos suínos temperados com louro, pimenta, coentro, arroz e farofa";
  }
  if (name === "sarapatel (2 pessoas)" || name.startsWith("sarapatel (2")) {
    return "Refeição de Sarapatel (2 pessoas) tradicional com miúdos temperados, cheiro-verde, arroz branco e farofa";
  }
  if (
    name === "xixim de bofe (1 pessoa)" ||
    name === "xinxim de bofe (1 pessoa)" ||
    name.startsWith("xixim de bofe (1") ||
    name.startsWith("xinxim de bofe (1")
  ) {
    return "Refeição de Xinxim de Bofe (1 pessoa) cozido no azeite de dendê com leite de coco, amendoim, camarão seco, arroz e farofa";
  }
  if (
    name === "xixim de bofe (2 pessoas)" ||
    name === "xinxim de bofe (2 pessoas)" ||
    name.startsWith("xixim de bofe (2") ||
    name.startsWith("xinxim de bofe (2")
  ) {
    return "Refeição de Xinxim de Bofe (2 pessoas) completo no azeite de dendê com leite de coco, temperos baianos, arroz e farofa";
  }

  // ─── 4. CERVEJAS (600ml / 300ml) ─────────────────────────────────────────
  if (name === "amstel (600ml)" || name.startsWith("amstel (600")) {
    return "Garrafa de Cerveja Amstel Lager (600ml) puro malte servida trincando de gelada";
  }
  if (
    name === "brahma shopp (600ml)" ||
    name === "brahma chopp (600ml)" ||
    name.startsWith("brahma shopp") ||
    name.startsWith("brahma chopp") ||
    name.startsWith("brahma (600")
  ) {
    return "Garrafa de Cerveja Brahma Chopp Pilsen (600ml) clássica, cremosa e bem gelada";
  }
  if (name === "budweiser (600ml)" || name.startsWith("budweiser (600")) {
    return "Garrafa de Cerveja Budweiser American Lager (600ml) maturadas com lascas de Beechwood bem gelada";
  }
  if (name === "chopp de vinho (300ml)" || name.startsWith("chopp de vinho")) {
    return "Garrafa de Chopp de Vinho (300ml) gelado, encorpado e levemente adocicado com mosto de uva e malte";
  }
  if (name === "devassa (600ml)" || name.startsWith("devassa")) {
    return "Garrafa de Cerveja Devassa Tropical Lager (600ml) puro malte leve e bem gelada";
  }
  if (
    name === "eisenbahn (600ml)" ||
    name.startsWith("eisenbahn (600") ||
    name === "eisenbahn"
  ) {
    return "Garrafa de Cerveja Eisenbahn Pilsen (600ml) puro malte especial servida bem gelada";
  }
  if (name === "heineken (600ml)" || name.startsWith("heineken (600")) {
    return "Garrafa verde de Cerveja Heineken Premium Lager (600ml) puro malte servida trincando de gelada";
  }
  if (name === "imperio (600ml)" || name.startsWith("imperio (600")) {
    return "Garrafa de Cerveja Império Pilsen (600ml) puro malte servida bem gelada";
  }
  if (name === "itaipava (600ml)" || name.startsWith("itaipava (600")) {
    return "Garrafa de Cerveja Itaipava Pilsen (600ml) refrescante e bem gelada";
  }
  if (name === "original (600ml)" || name.startsWith("original")) {
    return "Garrafa de Cerveja Antarctica Original Pilsen (600ml) tradicional de boteco servida bem gelada";
  }
  if (name === "skol (600ml)" || name.startsWith("skol (600")) {
    return "Garrafa de Cerveja Skol Pilsen (600ml) leve, refrescante e bem gelada";
  }
  if (name === "spaten (600ml)" || name.startsWith("spaten")) {
    return "Garrafa de Cerveja Spaten Munich Helles (600ml) puro malte de receita alemã servida bem gelada";
  }
  if (name === "stella artois (600ml)" || name.startsWith("stella artois")) {
    return "Garrafa de Cerveja Stella Artois Premium Lager (600ml) de receita belga servida bem gelada";
  }
  if (
    name === "stella gold (600ml)" ||
    name === "stella pure gold (600ml)" ||
    name.startsWith("stella gold") ||
    name.startsWith("stella pure gold")
  ) {
    return "Garrafa de Cerveja Stella Artois Pure Gold (600ml) puro malte sem glúten e baixa caloria bem gelada";
  }

  // ─── 5. LONG NECK E LATA ─────────────────────────────────────────────────
  if (name === "amstel ultra (269ml)" || name.startsWith("amstel ultra")) {
    return "Lata de Cerveja Amstel Ultra (269ml) puro malte sem glúten e baixa caloria servida gelada";
  }
  if (name === "brahma malzbier (330ml)" || name.startsWith("brahma malzbier")) {
    return "Garrafa Long Neck de Cerveja Brahma Malzbier (330ml) escura e levemente adocicada com notas de caramelo";
  }
  if (name === "brahma zero (lata)" || name.startsWith("brahma zero")) {
    return "Lata de Cerveja Brahma Zero Álcool (350ml) sabor pilsen refrescante e sem álcool";
  }
  if (
    name === "corona zero (330ml)" ||
    name.startsWith("corona zero") ||
    name.startsWith("corona cero")
  ) {
    return "Garrafa Long Neck de Cerveja Corona Cero (330ml) sem álcool, leve e refrescante";
  }
  if (
    name === "corona (330ml)" ||
    name.startsWith("corona (330") ||
    name.startsWith("corona extra")
  ) {
    return "Garrafa Long Neck transparente de Cerveja Corona Extra (330ml) leve e refrescante";
  }
  if (
    name === "heineken zero (330ml)" ||
    name.startsWith("heineken zero") ||
    name.startsWith("heineken 0")
  ) {
    return "Garrafa Long Neck de Cerveja Heineken 0.0 (330ml) puro malte sem álcool e bem gelada";
  }
  if (name === "heineken (330ml)" || name.startsWith("heineken (330")) {
    return "Garrafa Long Neck verde de Cerveja Heineken Premium Lager (330ml) puro malte bem gelada";
  }
  if (name === "imperio ultra (330ml)" || name.startsWith("imperio ultra")) {
    return "Garrafa Long Neck de Cerveja Império Ultra (330ml) puro malte leve, sem glúten e baixa caloria";
  }
  if (name === "imperio (330ml)" || name.startsWith("imperio (330")) {
    return "Garrafa Long Neck de Cerveja Império Pilsen (330ml) puro malte servida bem gelada";
  }
  if (name === "itaipava (330ml)" || name.startsWith("itaipava (330")) {
    return "Garrafa Long Neck de Cerveja Itaipava Pilsen (330ml) leve e bem gelada";
  }

  // ─── 6. NÃO ALCOÓLICOS ───────────────────────────────────────────────────
  if (name === "agua mineral sem gas" || name.startsWith("agua mineral sem gas")) {
    return "Garrafa de Água Mineral Sem Gás natural, pura e refrescante";
  }
  if (name === "agua mineral com gas" || name.startsWith("agua mineral com gas")) {
    return "Garrafa de Água Mineral Com Gás gaseificada e bem gelada";
  }
  if (name === "agua tonica schweppes" || name.startsWith("agua tonica")) {
    return "Lata de Água Tônica Schweppes (350ml) gaseificada com toque cítrico de quinino servida gelada";
  }
  if (name === "antarctica (lata)" || name.startsWith("antarctica (lata")) {
    return "Lata de Refrigerante Guaraná Antarctica (350ml) tradicional feito com guaraná da Amazônia";
  }
  if (name === "antarctica (1lt)" || name.startsWith("antarctica (1")) {
    return "Garrafa de Refrigerante Guaraná Antarctica (1 litro) gelado para compartilhar";
  }
  if (name === "coca-cola zero (lata)" || name.startsWith("coca-cola zero (lata")) {
    return "Lata de Refrigerante Coca-Cola Sem Açúcar (350ml) zero calorias servida bem gelada";
  }
  if (name === "coca-cola (lata)" || name.startsWith("coca-cola (lata")) {
    return "Lata de Refrigerante Coca-Cola Original (350ml) clássica e bem gelada";
  }
  if (name === "coca-cola zero (1lt)" || name.startsWith("coca-cola zero (1")) {
    return "Garrafa de Refrigerante Coca-Cola Sem Açúcar (1 litro) zero calorias servida gelada";
  }
  if (name === "coca-cola (1lt)" || name.startsWith("coca-cola (1")) {
    return "Garrafa de Refrigerante Coca-Cola Original (1 litro) servida bem gelada";
  }
  if (name === "fanta (lata)" || name.startsWith("fanta (lata") || name === "fanta") {
    return "Lata de Refrigerante Fanta Laranja (350ml) com suco de laranja e bem gelada";
  }
  if (name === "h2o" || name.startsWith("h2o") || name.startsWith("h2oh")) {
    return "Garrafa de Bebida H2OH! Limão (500ml) levemente gaseificada com suco natural de limão e zero açúcar";
  }
  if (name === "pepsi (lata)" || name.startsWith("pepsi (lata")) {
    return "Lata de Refrigerante Pepsi Cola (350ml) refrescante e bem gelada";
  }
  if (name === "pepsi (1lt)" || name.startsWith("pepsi (1")) {
    return "Garrafa de Refrigerante Pepsi Cola (1 litro) gelada para compartilhar";
  }
  if (name === "sprite (lata)" || name.startsWith("sprite")) {
    return "Lata de Refrigerante Sprite Sabor Limão (350ml) cítrico, refrescante e bem gelado";
  }
  if (name === "suco del valle" || name.startsWith("suco del valle")) {
    return "Lata de Suco Néctar Del Valle sabor frutas selecionadas servido bem gelado";
  }
  if (name === "gatorade" || name.startsWith("gatorade")) {
    return "Garrafa de Bebida Isotônica Gatorade (500ml) repositor de sais minerais e energia bem gelado";
  }
  if (name === "powerade" || name.startsWith("powerade")) {
    return "Garrafa de Bebida Isotônica Powerade (500ml) com vitaminas do complexo B e eletrólitos servida gelada";
  }
  if (name === "bivolt (energetico)" || name.startsWith("bivolt")) {
    return "Garrafa de Bebida Energética Bivolt com taurina, cafeína e extrato de guaraná servida gelada";
  }
  if (name === "red bull" || name.startsWith("red bull")) {
    return "Lata de Bebida Energética Red Bull Energy Drink (250ml) com taurina, cafeína e vitaminas";
  }

  // ─── 7. DESTILADOS E DOSES / FALLBACKS INTELIGENTES ──────────────────────
  if (name === "tequila" || name.startsWith("tequila")) {
    return "Dose de Tequila Jose Cuervo Especial Silver servida no Buteco do Papá";
  }
  if (name.startsWith("sao joao da barra")) {
    return "Dose de Conhaque São João da Barra tradicional com alcatrão, mel e gengibre";
  }
  if (name === "smirnoff ice" || name.startsWith("smirnoff ice")) {
    return "Garrafa Long Neck de Smirnoff Ice Original (275ml) bebida mista de vodka com limão bem gelada";
  }
  if (name.startsWith("smirnoff")) {
    return "Dose de Vodka Smirnoff No. 21 triplamente destilada servida gelada";
  }
  if (name.startsWith("skol beats")) {
    return "Lata de Skol Beats Senses (269ml) bebida mista refrescante servida bem gelada";
  }
  if (name.startsWith("seleta")) {
    return "Dose de Cachaça Seleta artesanal de Salinas envelhecida em umburana";
  }
  if (name.startsWith("seagers")) {
    return "Dose de Gin Seagers Silver London Dry aromático com notas de zimbro";
  }
  if (name.startsWith("rock's") || name.startsWith("rocks")) {
    return "Dose de Gin Rock's Dry aromático com notas cítricas e de zimbro";
  }
  if (name.startsWith("red label")) {
    return "Dose de Whisky Johnnie Walker Red Label Blended Scotch servida pura ou com gelo";
  }
  if (name.startsWith("passport")) {
    return "Dose de Whisky Passport Scotch Blended servida pura ou com gelo";
  }
  if (hasAnyKeyword(combined, ["whisky", "whiskey", "ballantine", "black & white", "black label", "red label", "chivas", "old eight", "old parr", "passport"])) {
    return `Dose de Whisky ${productName} servida pura ou com gelo`;
  }
  if (hasAnyKeyword(combined, ["vodka", "absolut", "orloff", "smirnoff"]) && !name.includes("ice")) {
    return `Dose de Vodka ${productName} destilada servida gelada`;
  }
  if (hasAnyKeyword(combined, ["gin", "rock's", "rocks", "seagers"])) {
    return `Dose de Gin ${productName} aromático com notas de zimbro`;
  }
  if (hasAnyKeyword(combined, ["cachaca", "51", "cabare", "gengibre", "olhos verde", "seleta"]) && !name.includes("ice")) {
    return `Dose de Cachaça tradicional ${productName} do Buteco do Papá`;
  }
  if (hasAnyKeyword(combined, ["rum", "bacardi", "montila"])) {
    return `Dose de Rum ${productName} servido puro ou com gelo`;
  }
  if (hasAnyKeyword(combined, ["conhaque", "5 estrelas", "dreher", "domecq", "sao joao"])) {
    return `Dose de Conhaque ${productName} encorpado e aromático`;
  }
  if (hasAnyKeyword(combined, ["campari", "martini", "vermute", "bitter", "tequila"])) {
    return `Dose de aperitivo ou destilado ${productName} servido no Buteco do Papá`;
  }
  if (hasAnyKeyword(combined, ["ice", "beats"])) {
    return `Garrafa Long Neck de bebida mista ${productName} refrescante e bem gelada`;
  }

  // Fallback por categoria para novos itens cadastrados no banco
  if (category.includes("petisc")) {
    return `Prato de ${productName} preparado na hora com acompanhamentos típicos do Buteco do Papá`;
  }
  if (category.includes("caldo")) {
    return `Tigela de ${productName} quente e temperado com ervas frescas no Buteco do Papá`;
  }
  if (category.includes("refeic")) {
    return `Refeição completa de ${productName} com acompanhamentos tradicionais do Buteco do Papá`;
  }
  if (category.includes("cerveja") || category.includes("long neck")) {
    return `Cerveja ${productName} servida trincando de gelada no Buteco do Papá`;
  }
  if (category.includes("nao alcoolic") || category.includes("refrigerante")) {
    return `Bebida não alcoólica ${productName} servida bem gelada`;
  }

  return `Foto ilustrativa de ${productName} do cardápio do Buteco do Papá`;
}

/**
 * Gera o atributo `alt` dinâmico e descritivo para leitores de tela,
 * priorizando `altText` ou `description` vindos do banco de dados / objeto
 * do produto, ou utilizando a descrição acessível oficial com os ingredientes.
 */
export function getProductImageAlt(
  product: Pick<Product, "name" | "description"> & {
    altText?: string | null;
  },
  categoryName?: string | null
): string {
  const customAlt = product.altText?.trim();
  if (customAlt) {
    return customAlt;
  }

  const dbDescription = product.description?.trim();
  if (dbDescription) {
    const lowerDesc = dbDescription.toLowerCase();
    const lowerName = product.name.trim().toLowerCase();
    if (lowerDesc.includes(lowerName)) {
      return dbDescription;
    }
    return `Prato de ${product.name} com ${dbDescription}`;
  }

  return getProductAccessibleDescription(product.name, categoryName);
}
