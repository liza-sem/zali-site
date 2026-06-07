import './posts.css'
import { PostsFooter } from '@/components/PostsFooter'
import { PostsLogo } from '@/components/PostsLogo'

export const metadata = {
  title: 'Posts · Zali',
}

export default function PostsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="posts-root">
      <div className="posts-grain" aria-hidden="true" />
      <PostsLogo />
      {children}
      <PostsFooter />
    </div>
  )
}
