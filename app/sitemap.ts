import { MetadataRoute } from 'next'
import { getPortfolioItems, getTeamMembers, getBlogPosts, getLegalUpdates } from '@/lib/wordpress'

export const dynamic = "force-dynamic";

export async function generateSitemaps() {
  return [{ id: 'en' }, { id: 'ru' }, { id: 'am' }];
}

export default async function sitemap({
  id,
}: {
  id: string
}): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.retrieve.am'
  // Use id directly as lang, fallback to en if undefined
  const lang = id || "en"

  let allPages: MetadataRoute.Sitemap = []

  // Global root (redirects or canonical base). Only add on 'en' to avoid duplication in each sitemap.
  if (lang === "en") {
    allPages.push({
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    })
  }

  // Static core routes
  const staticRoutes = [
    '',
    '/practice-areas',
    '/our-team',
    '/blog',
    '/contact',
    '/portfolio',
    '/legal-updates',
  ]

  // 1. Static Pages
  const staticPages = staticRoutes.map((route) => ({
    url: `${baseUrl}/${lang}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // 2. Dynamic Practice Areas
  const portfolioItems = await getPortfolioItems(lang)
  const practiceAreaPages = portfolioItems.map((item) => ({
    url: `${baseUrl}/${lang}/practice-areas/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // 3. Dynamic Personnel
  const teamMembers = await getTeamMembers(lang)
  const personnelPages = teamMembers
    .map((member) => {
      const slug = member.link?.split("/personnel/")[1]?.replace(/\//g, "") || ""
      return slug ? {
        url: `${baseUrl}/${lang}/personnel/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      } : null
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)

  // 4. Dynamic Blog Posts
  const { posts } = await getBlogPosts(100, 1, lang)
  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/${lang}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  // 5. Dynamic Legal Updates
  const { posts: legalUpdates } = await getLegalUpdates(1, 100, lang)
  const legalUpdatePages = legalUpdates.map((post) => ({
    url: `${baseUrl}/${lang}/legal-updates/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  allPages = [
    ...allPages,
    ...staticPages,
    ...practiceAreaPages,
    ...personnelPages,
    ...blogPages,
    ...legalUpdatePages,
  ]

  return allPages
}
