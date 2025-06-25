export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'fr', 'ar'],
  langDirection: {
    en: 'ltr',
    fr: 'ltr',
    ar: 'rtl'
  }
} as const

export type Locale = (typeof i18n)['locales'][number]

// ✅ Explicit exports for direct imports
export const defaultLocale = i18n.defaultLocale
export const locales = i18n.locales
