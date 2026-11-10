export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

let warmedUp = false;

/**
 * Dispara uma chamada leve e silenciosa na raiz da API para despertar o backend
 * (ex.: cold start no Render) imediatamente ao abrir qualquer página.
 */
export function warmUpApi(): void {
  if (typeof window === "undefined" || warmedUp) return;
  warmedUp = true;

  fetch(`${API_URL}/`, {
    method: "GET",
    mode: "cors",
    cache: "no-store",
  }).catch(() => {
    // Falha silenciosa caso o servidor ainda esteja subindo
  });
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Erro na requisição: ${response.status}`;
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        if (errorData?.message) {
          errorMessage = Array.isArray(errorData.message)
            ? errorData.message.join(", ")
            : errorData.message;
        }
      }
    } catch {
      // Falha ao obter detalhes do erro
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
