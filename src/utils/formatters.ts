/**
 * Formats a number to Angolan Kwanza (Kz) standard representation
 */
export function formatKz(amount: number, includeDecimals = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 Kz';
  }

  const rounded = includeDecimals ? amount.toFixed(2) : Math.round(amount).toString();
  const parts = rounded.split('.');

  // Format thousands with period: 100000 -> 100.000
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  if (includeDecimals && parts[1]) {
    return `${parts.join(',')} Kz`;
  }
  return `${parts[0]} Kz`;
}

/**
 * Formats date into readable Portuguese (pt-AO)
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('pt-AO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Formats date and time
 */
export function formatDateTime(timestamp: number | string): string {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('pt-AO', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
