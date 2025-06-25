import { NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import type { NextRequest } from 'next/server'
import { fallbackLng, languages, cookieName, headerName } from '@/i18n/settings'

acceptLanguage.languages(languages)

export const config = {
  matcher: [
    '/',
    '/index.html',
    '/index.php',
    '/((?!_next|api|fonts|images|favicon.ico|robots.txt|sitemap.xml).*)'
  ]
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // ✅ Clean unknown query params
  const allowedParams = ['utm_source', 'utm_medium', 'utm_campaign']
  const unknownParams = Array.from(searchParams.keys()).filter(key => !allowedParams.includes(key))
  if (unknownParams.length > 0) {
    const cleanUrl = request.nextUrl.clone()
    cleanUrl.search = ''
    return NextResponse.redirect(cleanUrl, 301)
  }

  // ✅ Normalize /index.html or /index.php to /en
  if (pathname === '/index.html' || pathname === '/index.php') {
    const url = request.nextUrl.clone()
    url.pathname = `/${fallbackLng}`
    return NextResponse.redirect(url, 301)
  }

  // ✅ Detect lang
  let lang = fallbackLng
  const cookieLang = request.cookies.get(cookieName)?.value
  const headerLang = acceptLanguage.get(request.headers.get('Accept-Language'))

  if (cookieLang && languages.includes(cookieLang)) lang = cookieLang
  else if (headerLang && languages.includes(headerLang)) lang = headerLang

  const langInPath = languages.find(l => pathname.startsWith(`/${l}`))
  const headers = new Headers(request.headers)
  headers.set(headerName, langInPath || lang)

  // ✅ Add missing lang prefix to root
  if (!langInPath && pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = `/${lang}`
    return NextResponse.redirect(url, 301)
  }

  // ✅ Normalize /en/ → /en (trailing slash)
  if (pathname.endsWith('/') && langInPath) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/\/+$/, '') // remove trailing slash
    return NextResponse.redirect(url, 301)
  }

  const response = NextResponse.next({ headers })

  // ✅ Set cookie with current lang (optional)
  if (langInPath) response.cookies.set(cookieName, langInPath)

  return response
}
