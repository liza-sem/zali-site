import { notFound } from 'next/navigation'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { getPayloadClient } from '@/lib/payload'

type PageProps = {
  params: Promise<{ slug: string }>
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { slug: { equals: slug } },
        { published: { equals: true } },
        { postType: { equals: 'write' } },
      ],
    },
    limit: 1,
  })
  const post = docs[0]
  if (!post) return { title: 'Post not found · Zali' }

  const title = post.metaTitle || `${post.title} · Zali`
  const description = post.metaDescription || post.excerpt || undefined
  const og =
    post.ogImage && typeof post.ogImage === 'object' && post.ogImage.url
      ? post.ogImage.url
      : post.coverImage && typeof post.coverImage === 'object' && post.coverImage.url
        ? post.coverImage.url
        : undefined

  return {
    title,
    description,
    robots: post.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      images: og ? [{ url: og }] : undefined,
    },
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { slug: { equals: slug } },
        { published: { equals: true } },
        { postType: { equals: 'write' } },
      ],
    },
    limit: 1,
    depth: 1,
  })

  const post = docs[0]
  if (!post || post.postType === 'external') notFound()

  const html = post.content ? convertLexicalToHTML({ data: post.content }) : ''
  const cover =
    post.coverImage && typeof post.coverImage === 'object' && post.coverImage.url
      ? post.coverImage
      : null

  return (
    <article className="posts-wrap posts-article">
      <nav className="posts-nav">
        <a href="/posts">← Posts</a>
      </nav>

      <h1>{post.title}</h1>
      <div className="posts-article-meta">{formatDate(post.publishedAt)}</div>

      {cover?.url ? (
        <div className="posts-cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover.url} alt={cover.alt || post.title} />
        </div>
      ) : null}

      <div className="posts-content" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  )
}
