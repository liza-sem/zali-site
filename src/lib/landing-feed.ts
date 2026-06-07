export type LandingFeedItem = {
  id: string | number
  title: string
  url: string
  kind: string
  sourceLabel: string | null
  iconStyle: string
  publishedAt: string
  sortOrder: number
}

type PostLike = {
  id: string | number
  postType?: string | null
  slug?: string | null
  title?: string | null
  externalUrl?: string | null
  publishedAt?: string | null
  kind?: string | null
  sourceLabel?: string | null
  iconStyle?: string | null
  sortOrder?: number | null
}

export function postPath(slug: string) {
  return `/posts/${slug}`
}

export function itemFromPost(post: PostLike): LandingFeedItem | null {
  const url =
    post.postType === 'external'
      ? post.externalUrl || null
      : post.slug
        ? postPath(post.slug)
        : null

  if (!url || !post.title) return null

  const defaultKind = post.postType === 'external' ? 'link' : 'essay'
  const defaultIcon = post.postType === 'external' ? 'link' : 'pen'

  return {
    id: post.id,
    title: post.title,
    url,
    kind: post.kind || defaultKind,
    sourceLabel: post.sourceLabel || post.kind || defaultKind,
    iconStyle: post.iconStyle || defaultIcon,
    publishedAt: post.publishedAt || new Date().toISOString(),
    sortOrder: post.sortOrder ?? 0,
  }
}

export function sortLandingItems(items: LandingFeedItem[]) {
  return [...items].sort((a, b) => {
    if (b.sortOrder !== a.sortOrder) return b.sortOrder - a.sortOrder
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  })
}

export function buildLandingFeed({
  posts,
  limit,
}: {
  posts: PostLike[]
  limit: number
}): LandingFeedItem[] {
  const items = posts
    .map(itemFromPost)
    .filter((item): item is LandingFeedItem => item !== null)

  return sortLandingItems(items).slice(0, limit)
}
