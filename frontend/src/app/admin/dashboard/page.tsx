"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Category, Product, User } from "@/types";
import { apiFetch, warmUpApi } from "@/lib/api";
import { getProductImageUrl } from "@/lib/productImage";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  LogOut,
  Search,
  ExternalLink,
  Loader2,
  FolderPlus,
  Package,
  Layers,
  CheckCircle2,
  AlertCircle,
  X,
  Check,
  Beer,
  Code2,
} from "lucide-react";

type TabType = "products" | "categories";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Filtros de produtos
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "ACTIVE" | "INACTIVE" | "NOVELTY"
  >("ALL");

  // Modal de Produto (Criar / Editar)
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState("");
  const [prodDescription, setProdDescription] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodImageUrl, setProdImageUrl] = useState("");
  const [prodCategoryId, setProdCategoryId] = useState("");
  const [prodIsNovelty, setProdIsNovelty] = useState(false);
  const [prodIsActive, setProdIsActive] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);

  // Modal de Categoria (Criar / Editar)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState("");
  const [catOrder, setCatOrder] = useState("1");
  const [savingCategory, setSavingCategory] = useState(false);

  // Verifica se o usuário logado é o Desenvolvedor (Flávio / ZyonTech)
  const isDeveloper = useMemo(() => {
    if (!adminUser) return false;
    const identity = `${adminUser.name} ${adminUser.email}`.toLowerCase();
    return (
      identity.includes("flavio") ||
      identity.includes("flávio") ||
      identity.includes("fau") ||
      identity.includes("zyon")
    );
  }, [adminUser]);

  // Estado de ação rápida por linha
  const [busyId, setBusyId] = useState<string | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    if (type === "success" && typeof window !== "undefined") {
      localStorage.removeItem("buteco_papa_menu_cache_v1");
    }
    setFeedback({ type, text });
    setTimeout(() => {
      setFeedback((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // 1. Verifica token (inclusive captura ?token= vindo do callback OAuth) e carrega os dados
  useEffect(() => {
    if (typeof window === "undefined") return;
    warmUpApi();

    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      localStorage.setItem("admin_token", urlToken);
      window.history.replaceState({}, "", "/admin/dashboard");
    }

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    let parsedUser: User | null = null;
    const savedUser = localStorage.getItem("admin_user");
    if (savedUser) {
      try {
        parsedUser = JSON.parse(savedUser) as User;
      } catch {
        // Ignora JSON inválido
      }
    }

    let cancelled = false;

    async function initDashboard() {
      try {
        const [catsData, prodsData] = await Promise.all([
          apiFetch<Category[]>("/categories"),
          apiFetch<Product[]>("/products/all"),
        ]);
        if (cancelled) return;
        setAdminUser(parsedUser);
        setAuthChecked(true);
        setCategories(catsData);
        setProducts(prodsData);
      } catch (err: unknown) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Erro ao carregar dados.";
        if (message.includes("401")) {
          localStorage.removeItem("admin_token");
          router.replace("/admin/login");
          return;
        }
        setAdminUser(parsedUser);
        setAuthChecked(true);
        setFeedback({ type: "error", text: message });
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initDashboard();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  // Mapa rápido categoryId -> nome
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  // Lista filtrada de produtos
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description ?? "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        filterCategoryId === "ALL" || p.categoryId === filterCategoryId;

      const matchesStatus =
        filterStatus === "ALL" ||
        (filterStatus === "ACTIVE" && p.isActive !== false) ||
        (filterStatus === "INACTIVE" && p.isActive === false) ||
        (filterStatus === "NOVELTY" && Boolean(p.isNovelty));

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, filterCategoryId, filterStatus]);

  // Estatísticas do topo
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.isActive !== false).length;
    const inactive = total - active;
    const novelties = products.filter((p) => p.isNovelty).length;
    return { total, active, inactive, novelties, categories: categories.length };
  }, [products, categories]);

  // ---- Handlers de Produto ----
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProdName("");
    setProdDescription("");
    setProdPrice("");
    setProdImageUrl("");
    setProdCategoryId(
      filterCategoryId !== "ALL"
        ? filterCategoryId
        : categories[0]?.id || ""
    );
    setProdIsNovelty(false);
    setProdIsActive(true);
    setProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdDescription(product.description || "");
    setProdPrice(String(Number(product.price).toFixed(2)));
    setProdImageUrl(product.imageUrl || "");
    setProdCategoryId(product.categoryId);
    setProdIsNovelty(Boolean(product.isNovelty));
    setProdIsActive(product.isActive !== false);
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(String(prodPrice).replace(",", "."));
    if (!prodName.trim() || !prodCategoryId || Number.isNaN(numericPrice) || numericPrice < 0) {
      showToast("error", "Preencha nome, categoria e um preço válido.");
      return;
    }

    setSavingProduct(true);
    const payload = {
      name: prodName.trim(),
      description: prodDescription.trim(),
      price: numericPrice.toFixed(2),
      imageUrl: prodImageUrl.trim() || null,
      categoryId: prodCategoryId,
      isNovelty: prodIsNovelty,
      isActive: prodIsActive,
    };

    try {
      if (editingProduct) {
        const updated = await apiFetch<Product>(
          `/products/${editingProduct.id}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
        setProducts((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        showToast("success", `Item "${updated.name}" atualizado!`);
      } else {
        const created = await apiFetch<Product>("/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setProducts((prev) =>
          [...prev, created].sort((a, b) => a.name.localeCompare(b.name))
        );
        showToast("success", `Item "${created.name}" adicionado ao cardápio!`);
      }
      setProductModalOpen(false);
    } catch (err: unknown) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Erro ao salvar produto."
      );
    } finally {
      setSavingProduct(false);
    }
  };

  const handleToggleActive = async (product: Product) => {
    setBusyId(product.id);
    const nextActive = product.isActive === false;
    try {
      const updated = await apiFetch<Product>(`/products/${product.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: nextActive }),
      });
      setProducts((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      showToast(
        "success",
        nextActive
          ? `"${updated.name}" ativado no cardápio.`
          : `"${updated.name}" pausado/ocultado do cardápio.`
      );
    } catch (err: unknown) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Erro ao alterar disponibilidade."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleNovelty = async (product: Product) => {
    setBusyId(product.id);
    const nextNovelty = !product.isNovelty;
    try {
      const updated = await apiFetch<Product>(`/products/${product.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isNovelty: nextNovelty }),
      });
      setProducts((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      showToast(
        "success",
        nextNovelty
          ? `"${updated.name}" marcado como Novidade!`
          : `Selo Novidade removido de "${updated.name}".`
      );
    } catch (err: unknown) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Erro ao atualizar destaque."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (
      !window.confirm(
        `Tem certeza que deseja excluir "${product.name}" permanentemente?`
      )
    ) {
      return;
    }

    setBusyId(product.id);
    try {
      await apiFetch(`/products/${product.id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      showToast("success", `"${product.name}" removido do cardápio.`);
    } catch (err: unknown) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Erro ao excluir produto."
      );
    } finally {
      setBusyId(null);
    }
  };

  // ---- Handlers de Categoria ----
  const openNewCategoryModal = () => {
    setEditingCategory(null);
    setCatName("");
    const maxOrder = categories.reduce(
      (max, c) => Math.max(max, Number(c.order ?? 0)),
      0
    );
    setCatOrder(String(maxOrder + 1));
    setCategoryModalOpen(true);
  };

  const openEditCategoryModal = (category: Category) => {
    setEditingCategory(category);
    setCatName(category.name);
    setCatOrder(String(category.order ?? 0));
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      showToast("error", "Informe o nome da categoria.");
      return;
    }

    setSavingCategory(true);
    const payload = {
      name: catName.trim(),
      order: Number.parseInt(catOrder, 10) || 0,
    };

    try {
      if (editingCategory) {
        const updated = await apiFetch<Category>(
          `/categories/${editingCategory.id}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
        setCategories((prev) =>
          prev
            .map((c) => (c.id === updated.id ? updated : c))
            .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0))
        );
        showToast("success", `Categoria "${updated.name}" atualizada!`);
      } else {
        const created = await apiFetch<Category>("/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setCategories((prev) =>
          [...prev, created].sort(
            (a, b) => Number(a.order ?? 0) - Number(b.order ?? 0)
          )
        );
        showToast("success", `Categoria "${created.name}" criada!`);
      }
      setCategoryModalOpen(false);
    } catch (err: unknown) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Erro ao salvar categoria."
      );
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    const count = products.filter((p) => p.categoryId === category.id).length;
    const warning =
      count > 0
        ? `A categoria "${category.name}" possui ${count} produto(s) que também serão apagados. Deseja continuar?`
        : `Deseja excluir a categoria "${category.name}"?`;

    if (!window.confirm(warning)) return;

    setBusyId(category.id);
    try {
      await apiFetch(`/categories/${category.id}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
      setProducts((prev) => prev.filter((p) => p.categoryId !== category.id));
      showToast("success", `Categoria "${category.name}" removida.`);
    } catch (err: unknown) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Erro ao remover categoria."
      );
    } finally {
      setBusyId(null);
    }
  };

  const formatBRL = (value: string | number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value));

  if (!authChecked) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <Loader2 className="animate-spin text-[#F59E0B]" size={28} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white pb-16">
      {/* Barra Superior */}
      <header className="sticky top-0 z-30 bg-[#0D0D0D]/95 backdrop-blur border-b border-[#27272A]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#F59E0B] bg-[#18181B] flex items-center justify-center font-extrabold text-amber-500 text-sm">
              BP
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-white flex items-center gap-2">
                Painel do Buteco
                <span className="text-[10px] bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 px-2 py-0.5 rounded-full font-bold">
                  Admin
                </span>
              </h1>
              <p className="text-xs text-zinc-400">
                {adminUser
                  ? `Olá, ${adminUser.name} (${adminUser.email})`
                  : "Gerencie preços, disponibilidade e categorias em tempo real"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isDeveloper && (
              <Link
                href="/admin/dev"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold bg-[#F59E0B]/15 hover:bg-[#F59E0B]/25 text-[#F59E0B] border border-[#F59E0B]/40 px-3 py-2 rounded-xl transition-colors"
                title="Acesso exclusivo do Desenvolvedor (Gerador de QR Code)"
              >
                <Code2 size={14} />
                Painel Dev
              </Link>
            )}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#18181B] hover:bg-[#27272A] text-zinc-200 border border-[#27272A] px-3 py-2 rounded-xl transition-colors"
            >
              <ExternalLink size={14} className="text-[#F59E0B]" />
              Ver Cardápio
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-2 rounded-xl transition-colors"
            >
              <LogOut size={14} />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Toast de Feedback */}
      {feedback && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-[#18181B] border border-[#27272A] shadow-2xl rounded-xl p-4 flex items-center gap-3">
          {feedback.type === "success" ? (
            <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
          ) : (
            <AlertCircle className="text-red-400 shrink-0" size={20} />
          )}
          <p className="text-xs text-zinc-200 font-medium">{feedback.text}</p>
          <button
            onClick={() => setFeedback(null)}
            className="text-zinc-500 hover:text-white ml-auto"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {/* Cards de Resumo */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold">
              Itens no Cardápio
            </span>
            <p className="text-2xl font-black text-white mt-1">{stats.total}</p>
            <span className="text-[11px] text-zinc-500">
              em {stats.categories} categorias
            </span>
          </div>

          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4">
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
              Disponíveis
            </span>
            <p className="text-2xl font-black text-emerald-400 mt-1">
              {stats.active}
            </p>
            <span className="text-[11px] text-zinc-500">
              visíveis no QR Code
            </span>
          </div>

          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold">
              Pausados / Em falta
            </span>
            <p className="text-2xl font-black text-zinc-300 mt-1">
              {stats.inactive}
            </p>
            <span className="text-[11px] text-zinc-500">ocultos do cliente</span>
          </div>

          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4">
            <span className="text-[11px] uppercase tracking-wider text-[#F59E0B] font-bold">
              Novidades
            </span>
            <p className="text-2xl font-black text-[#F59E0B] mt-1">
              {stats.novelties}
            </p>
            <span className="text-[11px] text-zinc-500">com selo destaque</span>
          </div>
        </section>

        {/* Seletor de Abas (Produtos x Categorias) + Botões de Criação */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#27272A] pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("products")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                activeTab === "products"
                  ? "bg-[#F59E0B] text-black shadow-md shadow-amber-500/20"
                  : "bg-[#18181B] text-zinc-400 hover:text-white border border-[#27272A]"
              }`}
            >
              <Package size={15} />
              Produtos ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                activeTab === "categories"
                  ? "bg-[#F59E0B] text-black shadow-md shadow-amber-500/20"
                  : "bg-[#18181B] text-zinc-400 hover:text-white border border-[#27272A]"
              }`}
            >
              <Layers size={15} />
              Categorias ({categories.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openNewCategoryModal}
              className="inline-flex items-center gap-1.5 bg-[#18181B] hover:bg-[#27272A] text-white border border-[#27272A] text-xs font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-colors"
            >
              <FolderPlus size={15} className="text-[#F59E0B]" />
              Nova Categoria
            </button>
            <button
              onClick={openNewProductModal}
              className="inline-flex items-center gap-1.5 bg-[#F59E0B] hover:bg-[#d9822b] text-black text-xs font-extrabold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-amber-500/10"
            >
              <Plus size={16} />
              Novo Produto
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Loader2 className="animate-spin text-[#F59E0B]" size={28} />
            <p className="text-xs">Carregando cardápio...</p>
          </div>
        ) : activeTab === "products" ? (
          /* ================= ABA DE PRODUTOS ================= */
          <section className="space-y-4">
            {/* Barra de Busca e Filtros */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative sm:col-span-1">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome ou descrição..."
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <select
                value={filterCategoryId}
                onChange={(e) => setFilterCategoryId(e.target.value)}
                className="bg-[#18181B] border border-[#27272A] rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
              >
                <option value="ALL">Todas as categorias</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as "ALL" | "ACTIVE" | "INACTIVE" | "NOVELTY"
                  )
                }
                className="bg-[#18181B] border border-[#27272A] rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
              >
                <option value="ALL">Todos os status</option>
                <option value="ACTIVE">Somente disponíveis</option>
                <option value="INACTIVE">Somente pausados/em falta</option>
                <option value="NOVELTY">Somente novidades</option>
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-10 text-center space-y-2">
                <Beer className="mx-auto text-zinc-600" size={32} />
                <p className="text-sm font-bold text-zinc-300">
                  Nenhum item encontrado com esses filtros.
                </p>
                <p className="text-xs text-zinc-500">
                  Tente limpar a busca ou adicione um novo produto.
                </p>
              </div>
            ) : (
              <div className="grid gap-2.5">
                {filteredProducts.map((product) => {
                  const isBusy = busyId === product.id;
                  const isActive = product.isActive !== false;

                  return (
                    <div
                      key={product.id}
                      className={`bg-[#18181B] border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                        isActive
                          ? "border-[#27272A] hover:border-amber-500/40"
                          : "border-[#27272A]/60 opacity-60"
                      }`}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#27272A] text-zinc-300 px-2 py-0.5 rounded-md">
                            {categoryMap.get(product.categoryId) ||
                              "Sem categoria"}
                          </span>

                          <h3 className="font-bold text-sm text-white">
                            {product.name}
                          </h3>

                          {product.isNovelty && (
                            <span className="bg-red-600/25 text-red-400 border border-red-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                              Novidade
                            </span>
                          )}

                          {!isActive && (
                            <span className="bg-zinc-700/40 text-zinc-400 border border-zinc-600/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                              Pausado
                            </span>
                          )}
                        </div>

                        {product.description && (
                          <p className="text-xs text-zinc-400 line-clamp-1">
                            {product.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#27272A]">
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="text-base font-extrabold text-[#F59E0B]">
                            {formatBRL(product.price)}
                          </span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getProductImageUrl(
                              product,
                              categoryMap.get(product.categoryId)
                            )}
                            alt={product.name}
                            loading="lazy"
                            className="w-11 h-11 rounded-lg object-cover shrink-0 border border-amber-500/25 bg-[#0D0D0D]"
                          />
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Alternar Novidade */}
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleToggleNovelty(product)}
                            title={
                              product.isNovelty
                                ? "Remover selo Novidade"
                                : "Destacar como Novidade"
                            }
                            className={`p-2 rounded-lg border text-xs transition-colors ${
                              product.isNovelty
                                ? "bg-amber-500/20 border-amber-500/40 text-[#F59E0B]"
                                : "bg-[#0D0D0D] border-[#27272A] text-zinc-400 hover:text-white"
                            }`}
                          >
                            <Sparkles size={15} />
                          </button>

                          {/* Alternar Disponível / Pausado */}
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleToggleActive(product)}
                            title={
                              isActive
                                ? "Pausar item (ocultar no cardápio)"
                                : "Ativar item no cardápio"
                            }
                            className={`p-2 rounded-lg border text-xs transition-colors ${
                              isActive
                                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                                : "bg-[#0D0D0D] border-[#27272A] text-zinc-500 hover:text-white"
                            }`}
                          >
                            {isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                          </button>

                          {/* Editar */}
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => openEditProductModal(product)}
                            title="Editar nome, preço ou categoria"
                            className="p-2 rounded-lg bg-[#0D0D0D] hover:bg-[#27272A] border border-[#27272A] text-zinc-300 hover:text-white transition-colors"
                          >
                            <Pencil size={15} />
                          </button>

                          {/* Excluir */}
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleDeleteProduct(product)}
                            title="Excluir produto"
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          /* ================= ABA DE CATEGORIAS ================= */
          <section className="grid gap-3">
            {categories.map((category) => {
              const count = products.filter(
                (p) => p.categoryId === category.id
              ).length;
              const isBusy = busyId === category.id;

              return (
                <div
                  key={category.id}
                  className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B] font-extrabold text-xs flex items-center justify-center">
                      #{category.order ?? 0}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-white">
                        {category.name}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        {count} produto(s) vinculado(s)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => openEditCategoryModal(category)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0D0D0D] hover:bg-[#27272A] border border-[#27272A] text-xs text-zinc-300 hover:text-white transition-colors"
                    >
                      <Pencil size={14} />
                      Editar
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleDeleteCategory(category)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </div>

      {/* ================= MODAL DE PRODUTO ================= */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181B] border border-[#27272A] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold uppercase tracking-wide text-[#F59E0B]">
                {editingProduct ? "Editar Produto" : "Novo Produto"}
              </h2>
              <button
                onClick={() => setProductModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Nome do Item
                </label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Ex.: Picanha na Chapa c/ Fritas"
                  className="w-full bg-[#0D0D0D] border border-[#27272A] rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="35.00"
                    className="w-full bg-[#0D0D0D] border border-[#27272A] rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Categoria
                  </label>
                  <select
                    required
                    value={prodCategoryId}
                    onChange={(e) => setProdCategoryId(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#27272A] rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                  >
                    <option value="" disabled>
                      Selecione...
                    </option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Descrição (opcional)
                </label>
                <textarea
                  rows={2}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Acompanha farofa, vinagrete e mandioca..."
                  className="w-full bg-[#0D0D0D] border border-[#27272A] rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  URL da Imagem - Opcional, deixe vazio para usar imagem ilustrativa automática
                </label>
                <input
                  type="url"
                  value={prodImageUrl}
                  onChange={(e) => setProdImageUrl(e.target.value)}
                  placeholder="https://exemplo.com/foto-do-produto.jpg"
                  className="w-full bg-[#0D0D0D] border border-[#27272A] rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <label className="inline-flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsNovelty}
                    onChange={(e) => setProdIsNovelty(e.target.checked)}
                    className="accent-[#F59E0B] w-4 h-4 rounded"
                  />
                  Destacar com o selo{" "}
                  <strong className="text-[#F59E0B]">NOVIDADE</strong>
                </label>

                <label className="inline-flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsActive}
                    onChange={(e) => setProdIsActive(e.target.checked)}
                    className="accent-emerald-500 w-4 h-4 rounded"
                  />
                  Disponível para os clientes no cardápio
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#27272A]">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="inline-flex items-center gap-1.5 bg-[#F59E0B] hover:bg-[#d9822b] text-black font-extrabold uppercase text-xs tracking-wider px-5 py-2.5 rounded-xl transition-all disabled:opacity-50"
                >
                  {savingProduct ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Salvando...
                    </>
                  ) : (
                    <>
                      <Check size={15} /> Salvar
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL DE CATEGORIA ================= */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181B] border border-[#27272A] rounded-2xl max-w-sm w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold uppercase tracking-wide text-[#F59E0B]">
                {editingCategory ? "Editar Categoria" : "Nova Categoria"}
              </h2>
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Ex.: Porções Especiais"
                  className="w-full bg-[#0D0D0D] border border-[#27272A] rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Ordem de Exibição (1, 2, 3...)
                </label>
                <input
                  type="number"
                  required
                  value={catOrder}
                  onChange={(e) => setCatOrder(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#27272A] rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#27272A]">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="inline-flex items-center gap-1.5 bg-[#F59E0B] hover:bg-[#d9822b] text-black font-extrabold uppercase text-xs tracking-wider px-5 py-2.5 rounded-xl transition-all disabled:opacity-50"
                >
                  {savingCategory ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Salvando...
                    </>
                  ) : (
                    <>
                      <Check size={15} /> Salvar
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rodapé Técnico Discreto c/ Atalho para o Desenvolvedor */}
      <footer className="max-w-6xl mx-auto px-4 pt-12 text-center">
        <Link
          href="/admin/dev"
          className="inline-flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors"
          title="Área Técnica ZyonTech (Gerador de QR Code)"
        >
          <Code2 size={12} />
          <span>ZyonTech • Flávio Félix (Dev Tools)</span>
        </Link>
      </footer>
    </main>
  );
}
