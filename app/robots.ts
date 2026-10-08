import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: [
      'https://www.retrieve.am/sitemap/en.xml',
      'https://www.retrieve.am/sitemap/ru.xml',
      'https://www.retrieve.am/sitemap/am.xml',
    ],
  }
}
