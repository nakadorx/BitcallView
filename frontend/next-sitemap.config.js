/** @type {import('next-sitemap').IConfig} */
const countryList = require('./src/data/countryList.json')

module.exports = {
  // Base site URL
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://demo-bc.site',

  // Generate robots.txt file
  generateRobotsTxt: true,

  // Avoid splitting into multiple index sitemaps
  generateIndexSitemap: false,

  // Max entries per sitemap (7000 is safe for your current scale)
  sitemapSize: 7000,

  // Exclude specific routes from the sitemap
  exclude: ['/api/*', '/front-pages/*'],

  // Robots.txt rules
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }]
  },

  // Alternate language references for hreflang
  alternateRefs: [
    { hreflang: 'en', href: 'https://demo-bc.site/en' },
    { hreflang: 'fr', href: 'https://demo-bc.site/fr' },
    { hreflang: 'ar', href: 'https://demo-bc.site/ar' }
  ],

  // Additional dynamic paths to include in sitemap
  additionalPaths: async config => {
    const locales = ['en', 'fr', 'ar']
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.bitcall.io'

    // 1. Localized homepage paths
    const homepagePaths = locales.map(locale => ({
      loc: `${config.siteUrl}/${locale}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0
    }))

    // 2. Localized blog post paths
    let blogPosts = []
    try {
      const res = await fetch(`${apiUrl}/blogs`)
      const data = await res.json()
      blogPosts = data?.result?.blogs || []
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    }

    const blogPaths = blogPosts.flatMap(post =>
      locales.map(locale => ({
        loc: `${config.siteUrl}/${locale}/blog/${post.slug}`,
        changefreq: 'daily',
        priority: 0.7,
        lastmod: post.updatedAt
          ? new Date(post.updatedAt).toISOString()
          : post.date
            ? new Date(post.date).toISOString()
            : new Date().toISOString()
      }))
    )

    // 3. Localized help center article paths (only published)
    let helpArticles = []
    try {
      const res = await fetch(`${apiUrl}/help-center/articles`)
      const data = await res.json()
      helpArticles = Array.isArray(data)
        ? data
        : Array.isArray(data?.articles)
          ? data.articles
          : Array.isArray(data?.result?.articles)
            ? data.result.articles
            : []
    } catch (error) {
      console.error('Error fetching help center articles:', error)
    }

    const helpArticlePaths = helpArticles
      .filter(a => a?.status?.status === 'Published')
      .flatMap(article =>
        locales.map(locale => ({
          loc: `${config.siteUrl}/${locale}/help-center/article/${article.slug}`,
          lastmod: article.updatedAt
            ? new Date(article.updatedAt).toISOString()
            : article.createdAt
              ? new Date(article.createdAt).toISOString()
              : new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.6
        }))
      )

    // 4. Localized static extra routes
    const extraRoutes = ['/esim', '/checkout', '/help-center', '/legal', '/login', '/rates/countries']

    const extraPaths = extraRoutes.flatMap(route =>
      locales.map(locale => ({
        loc: `${config.siteUrl}/${locale}${route}`,
        lastmod: new Date().toISOString(),
        changefreq:
          route === '/login' ? 'monthly' : ['/help-center', '/rates/countries'].includes(route) ? 'daily' : 'weekly',
        priority:
          route === '/esim'
            ? 0.8
            : route === '/checkout'
              ? 0.5
              : route === '/help-center'
                ? 0.6
                : route === '/legal'
                  ? 0.5
                  : route === '/login'
                    ? 0.3
                    : route === '/rates/countries'
                      ? 0.7
                      : 0.5
      }))
    )

    // 5. Country rate pages: e.g. /en/rates/countries/US
    const countryPaths = countryList.flatMap(country =>
      locales.map(locale => ({
        loc: `${config.siteUrl}/${locale}/rates/countries/${country.code}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7
      }))
    )

    // Combine all generated paths
    return [...homepagePaths, ...blogPaths, ...helpArticlePaths, ...extraPaths, ...countryPaths]
  }
}
