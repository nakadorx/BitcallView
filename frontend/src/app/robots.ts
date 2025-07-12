import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || 'https://bitcall.io'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/private/', '/*.json$', '/server/']
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/']
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}
