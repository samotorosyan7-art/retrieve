import { MetadataRoute } from 'next'
import { getPortfolioItems, getTeamMembers, getBlogPosts } from '@/lib/wordpress'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.retrieve.am'

  // Static pages
  const staticPages = [
    '',
    '/practice-areas',
    '/our-team',
    '/blog',
    '/contact',
    '/portfolio',
    '/legal-updates',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic Practice Areas
  const portfolioItems = await getPortfolioItems()
  const practiceAreaPages = portfolioItems.map((item) => ({
    url: `${baseUrl}/practice-areas/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Dynamic Personnel
  const teamMembers = await getTeamMembers()
  const personnelPages = teamMembers
    .map((member) => {
      const slug = member.link?.split("/personnel/")[1]?.replace(/\//g, "") || ""
      return slug ? {
        url: `${baseUrl}/personnel/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      } : null
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)

  // Dynamic Blog Posts
  const { posts } = await getBlogPosts(100) // Get recent 100 posts
  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [
    ...staticPages,
    ...practiceAreaPages,
    ...personnelPages,
    ...blogPages,
  ]
}
