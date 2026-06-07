'use client'

import { Button, GridViewIcon, ListViewIcon } from '@payloadcms/ui'

type PostsViewToggleProps = {
  activeView: 'grid' | 'list'
  onChange: (view: 'grid' | 'list') => void
}

export function PostsViewToggle({ activeView, onChange }: PostsViewToggleProps) {
  return (
    <div className="posts-view-toggle">
      <Button
        aria-label="Grid view"
        buttonStyle="pill"
        className={[
          'posts-view-toggle__btn',
          activeView === 'grid' ? 'posts-view-toggle__btn--active' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        icon={<GridViewIcon />}
        margin={false}
        onClick={() => onChange('grid')}
      />
      <Button
        aria-label="List view"
        buttonStyle="pill"
        className={[
          'posts-view-toggle__btn',
          activeView === 'list' ? 'posts-view-toggle__btn--active' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        icon={<ListViewIcon />}
        margin={false}
        onClick={() => onChange('list')}
      />
    </div>
  )
}
