'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useConfig, useListQuery } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import type { Media, Post } from '@/payload-types'

type PostDoc = Post & { id: number }

function formatDate(value?: string | null) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function coverUrl(cover: Post['coverImage'], mediaMap: Record<number, Media>) {
  if (!cover) return null
  if (typeof cover === 'object' && cover.url) return cover.url
  if (typeof cover === 'number') {
    const media = mediaMap[cover]
    return media?.thumbnailURL || media?.url || null
  }
  return null
}

export function PostsGrid() {
  const { data } = useListQuery()
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()
  const [mediaMap, setMediaMap] = useState<Record<number, Media>>({})

  const docs = (data?.docs || []) as PostDoc[]

  const coverIds = useMemo(
    () =>
      docs
        .map((doc) => (typeof doc.coverImage === 'number' ? doc.coverImage : null))
        .filter((id): id is number => typeof id === 'number'),
    [docs],
  )

  useEffect(() => {
    if (!coverIds.length) {
      setMediaMap({})
      return
    }

    const params = new URLSearchParams({
      depth: '0',
      limit: String(coverIds.length),
      where: JSON.stringify({ id: { in: coverIds } }),
    })

    fetch(`/api/media?${params.toString()}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((result) => {
        const next: Record<number, Media> = {}
        for (const doc of result.docs || []) {
          next[doc.id] = doc
        }
        setMediaMap(next)
      })
      .catch(() => setMediaMap({}))
  }, [coverIds.join(',')])

  return (
    <div className="posts-admin-grid">
      {docs.map((post) => {
        const href = formatAdminURL({
          adminRoute,
          path: `/collections/posts/${post.id}`,
        })
        const image = coverUrl(post.coverImage, mediaMap)
        const typeLabel = post.postType === 'external' ? 'External link' : 'Write'

        return (
          <Link className="posts-admin-card" href={href} key={post.id}>
            <div
              className={[
                'posts-admin-card__cover',
                post.postType === 'external' ? 'posts-admin-card__cover--external' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="" src={image} />
              ) : (
                <span className="posts-admin-card__glyph">
                  {post.postType === 'external' ? '↗' : '✎'}
                </span>
              )}
            </div>
            <div className="posts-admin-card__body">
              <div className="posts-admin-card__meta">
                <span className="posts-admin-card__type">{typeLabel}</span>
                <span className="posts-admin-card__date">{formatDate(post.publishedAt)}</span>
              </div>
              <h3 className="posts-admin-card__title">{post.title}</h3>
              <div className="posts-admin-card__flags">
                {post.published ? (
                  <span className="posts-admin-card__badge posts-admin-card__badge--live">
                    Published
                  </span>
                ) : (
                  <span className="posts-admin-card__badge">Draft</span>
                )}
                {post.showOnLanding ? (
                  <span className="posts-admin-card__badge posts-admin-card__badge--landing">
                    Landing
                  </span>
                ) : null}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
