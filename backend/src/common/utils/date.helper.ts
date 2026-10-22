export function formatToBrazilTime(
  date: Date | string | null | undefined,
): string {
  if (!date) return new Date().toISOString();

  const d = new Date(date);
  return d.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });
}
