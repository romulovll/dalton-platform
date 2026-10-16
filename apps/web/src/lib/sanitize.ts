/**
 * Escape HTML special characters to prevent XSS in server-generated HTML.
 */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Sanitize a CSV cell value to prevent formula injection.
 * Prefixes cells starting with =, +, -, @, \t, \r with a single-quote.
 */
export function sanitizeCsvCell(s: string): string {
  if (/^[=+\-@\t\r]/.test(s)) {
    return `'${s}`;
  }
  return s;
}
