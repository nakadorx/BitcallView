export function customLog(...args: any[]) {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT == 'development') {
    // Log each argument in the console with a green color
    console.log(...args)
  }
}

/**
 * Formats a number as a price string with a specified number of decimals.
 * Default is 2 decimal places.
 * Example: formatPrice(14.025) returns "14.03" (if rounding) or "14.02" if using truncation.
 *
 * @param price The number to format.
 * @param decimals The number of decimal places to display (default 2).
 */
export const formatPrice = (price: number, decimals: number = 2): string => {
  return price?.toFixed(decimals)
}

/**
 * Gets the current locale from the URL pathname.
 * Assumes that the locale is the first segment (e.g., "/en/...")
 */
export function getLocale(): string {
  if (typeof window !== 'undefined') {
    const pathParts = window.location.pathname.split('/')
    return pathParts[1] || 'en'
  }
  return 'en' // Fallback for SSR or non-browser environments
}

/**
 * Returns a localized path by prefixing the given path with the current locale.
 */
export function getLocalizedPath(path: string): string {
  const locale = getLocale()
  return `/${locale}${path.startsWith('/') ? '' : '/'}${path}`
}

/**
 * Navigates to a localized path by updating window.location.href.
 * This is a simple redirect (full page reload).
 */
export function navigateWithLocale(path: string): void {
  const localizedPath = getLocalizedPath(path)
  window.location.href = localizedPath
}
