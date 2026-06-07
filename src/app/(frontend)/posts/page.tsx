import { getPayloadClient } from '@/lib/payload'
import type { Media } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Posts · Zali',
  description: 'Posts from Zali.',
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function coverFor(post: { coverImage?: number | Media | null }) {
  const cover = post.coverImage
  if (cover && typeof cover === 'object' && cover.url) {
    return { url: cover.url, alt: cover.alt || '' }
  }
  return null
}

export default async function PostsIndexPage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [{ published: { equals: true } }, { postType: { equals: 'write' } }],
    },
    sort: '-publishedAt',
    limit: 50,
    depth: 1,
  })

  return (
    <div className="posts-wrap posts-index">
      <h1>Posts</h1>

      {docs.length > 0 ? (
        <div className="posts-feed">
          {docs.map((post) => {
            const cover = coverFor(post)

            return (
              <a className="posts-card" href={`/posts/${post.slug}`} key={post.id}>
                {cover ? (
                  <div className="posts-card__media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt={cover.alt || post.title} src={cover.url} />
                  </div>
                ) : null}
                <div className="posts-card__body">
                  <h2 className="posts-card__title">{post.title}</h2>
                  {post.excerpt ? <p className="posts-card__excerpt">{post.excerpt}</p> : null}
                  <div className="posts-card__date">{formatDate(post.publishedAt)}</div>
                </div>
              </a>
            )
          })}
        </div>
      ) : (
        <p className="posts-empty">No posts yet.</p>
      )}
    </div>
  )
}
