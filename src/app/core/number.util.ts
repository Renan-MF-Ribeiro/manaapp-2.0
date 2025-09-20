export function formatCurrency(value: string | number | null | undefined): string {
  if (value === undefined || value === null || value === '') return '';
  const n = Number(value);
  if (Number.isNaN(n)) return '';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function parseCurrency(input: string | number | null | undefined): number {
  if (input === undefined || input === null) return 0;
  if (typeof input === 'number') return input;
  const s = String(input).trim();
  if (!s) return 0;
  const cleaned = s.replace(/[^0-9,.-]/g, '');
  const normalized = cleaned.replace(/\./g, '').replace(/,/g, '.');
  const v = parseFloat(normalized);
  return Number.isFinite(v) ? v : 0;
}
