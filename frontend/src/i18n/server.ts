'use server'

import path from 'path'
import fs from 'fs'
import { defaultLocale } from '@/configs/i18n'

type TranslationObject = Record<string, any>

/**
 * Deep access helper (e.g., get(obj, 'aup.activities.spam.title'))
 */
function get(obj: TranslationObject, key: string): any {
  return key.split('.').reduce((acc, part) => acc?.[part], obj)
}

/**
 * Server-side translation function
 */
// Server-side translation function
export async function getT(locale: string, namespace: string) {
  const lang = locale || defaultLocale

  const filePath = path.resolve(`./src/i18n/locales/${lang}/${namespace}.json`)

  let translations: TranslationObject = {}

  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    translations = JSON.parse(raw)
  } catch (e) {
    console.warn(`[i18n] Failed to load: ${filePath}`)
    console.error(e)
  }

  return (key: string, options?: Record<string, any>) => {
    let text = get(translations, key)

    if (typeof text === 'string' && options) {
      Object.entries(options).forEach(([k, v]) => {
        text = text.replaceAll(`{{${k}}}`, String(v))
      })
    }

    return text ?? key
  }
}
