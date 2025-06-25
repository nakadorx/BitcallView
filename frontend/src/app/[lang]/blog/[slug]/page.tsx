// Next Imports
import { notFound } from 'next/navigation'
import Head from 'next/head'

// Custom Components
import BlogPostPage from '@/views/blog/structure2/BlogPostPage'
// Constants
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Utils
import api from '@/utils/api'
import { customLog } from '@/utils/commons'

interface Params {
  lang: string
  slug: string
}

export default async function BlogPost({ params }: { params: Params }) {
  const { lang = 'en', slug } = params

  const response = await api.get(`/blogs/slug/${slug}`)
  const post = response?.data?.result

  customLog('found blog-post (by slug) : post: ', post)

  if (!post) return notFound()

  // Handle localized fields
  const getLocalized = (val: any) => (typeof val === 'object' ? val[lang] || val.en || Object.values(val)[0] : val)

  const localizedTitle = getLocalized(post.title)
  const localizedDescription = getLocalized(post.description)
  const localizedTags = Array.isArray(post.tags) ? post.tags : post.tags?.[lang] || post.tags?.en || []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: localizedTitle,
    description: localizedDescription,
    image: [typeof post.mainImage === 'object' ? post.mainImage.light : post.mainImage, post.publisher?.logo],
    author: {
      '@type': 'Person',
      name: post.author?.name,
      image: post.author?.image || undefined
    },
    publisher: {
      '@type': 'Organization',
      name: post.publisher?.name,
      logo: {
        '@type': 'ImageObject',
        url: post.publisher?.logo
      }
    },
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${lang}/blog/${post.slug}`
    },
    articleSection: localizedTags.join(', '),
    keywords: localizedTags.join(', '),
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'CommentAction' },
      userInteractionCount: post.commentCount || 0
    },
    articleBody: post.intro || localizedDescription?.substring(0, 300),
    isPartOf: {
      '@type': 'Blog',
      name: 'Your Blog Name',
      url: `${SITE_URL}/${lang}/blog`
    },
    relatedLink: post.relatedPosts?.map((rp: any) => `${SITE_URL}/${lang}/blog/${rp.slug}`)
  }

  return (
    <>
      <Head>
        <title>{localizedTitle} - My Blog</title>
        <meta name='description' content={localizedDescription} />

        {/* Open Graph */}
        <meta property='og:title' content={localizedTitle} />
        <meta property='og:description' content={localizedDescription} />
        <meta
          property='og:image'
          content={typeof post.mainImage === 'object' ? post.mainImage.light : post.mainImage}
        />
        <meta property='og:image:alt' content={localizedTitle} />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta property='og:type' content='article' />
        <meta property='og:url' content={`${SITE_URL}/${lang}/blog/${post.slug}`} />
        <meta property='og:site_name' content='Your Blog Name' />
        <meta property='og:locale' content={`${lang}_US`} />

        {/* Twitter Card */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={localizedTitle} />
        <meta name='twitter:description' content={localizedDescription} />
        <meta
          name='twitter:image'
          content={typeof post.mainImage === 'object' ? post.mainImage.light : post.mainImage}
        />

        {/* Canonical */}
        <link rel='canonical' href={`${SITE_URL}/${lang}/blog/${post.slug}`} />

        {/* Structured Data */}
        <script type='application/ld+json'>{JSON.stringify(jsonLd)}</script>
      </Head>

      {/* Render BlogPostPage with localized content */}
      <BlogPostPage
        data={{
          ...post,
          title: localizedTitle,
          description: localizedDescription,
          tags: localizedTags
        }}
      />
    </>
  )
}
