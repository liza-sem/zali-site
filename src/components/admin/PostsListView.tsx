'use client'

import { useEffect, useState } from 'react'
import type { ListViewClientProps } from 'payload'
import { DefaultListView, usePreferences } from '@payloadcms/ui'
import { PostsGrid } from './PostsGrid'
import { PostsViewToggle } from './PostsViewToggle'
import './posts-admin.scss'

const PREFERENCE_KEY = 'collection-posts'

type PostsListPreferences = {
  postsDisplayMode?: 'grid' | 'list'
}

export function PostsListView(props: ListViewClientProps) {
  const { getPreference, setPreference } = usePreferences()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true

    getPreference<PostsListPreferences>(PREFERENCE_KEY)
      .then((prefs) => {
        if (!active) return
        if (prefs?.postsDisplayMode === 'grid' || prefs?.postsDisplayMode === 'list') {
          setViewMode(prefs.postsDisplayMode)
        }
      })
      .finally(() => {
        if (active) setReady(true)
      })

    return () => {
      active = false
    }
  }, [getPreference])

  const handleViewChange = async (mode: 'grid' | 'list') => {
    setViewMode(mode)
    await setPreference<PostsListPreferences>(PREFERENCE_KEY, { postsDisplayMode: mode }, true)
  }

  const viewToggle = <PostsViewToggle activeView={viewMode} onChange={handleViewChange} />
  const beforeActions = [viewToggle, ...(props.beforeActions ?? [])]

  if (!ready) {
    return <DefaultListView {...props} beforeActions={beforeActions} />
  }

  return (
    <DefaultListView
      {...props}
      beforeActions={beforeActions}
      Table={viewMode === 'grid' ? <PostsGrid /> : props.Table}
    />
  )
}
