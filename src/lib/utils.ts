// Utility functies voor de applicatie

/**
 * Formatteer een bedrag naar EUR valuta
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

/**
 * Bereken het aantal dagen tussen twee datums
 */
export function calculateDays(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Include both start and end date
}

/**
 * Valideer e-mailadres
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valideer Nederlands telefoonnummer
 */
export function isValidPhone(phone: string): boolean {
  // Basis validatie voor NL telefoonnummers
  const phoneRegex = /^(\+31|0)[1-9][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Genereer een korte ID voor weergave
 */
export function generateShortId(uuid: string): string {
  return uuid.substring(0, 8).toUpperCase();
}

/**
 * Sleep functie voor debugging of delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Truncate tekst tot bepaalde lengte
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

