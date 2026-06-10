import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/((?!_next/static|_next/image|api|landing\\.html|favicon|og\\.jpg|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff2?|otf|ttf)).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/blog', destination: '/posts', permanent: true },
      { source: '/blog/:slug', destination: '/posts/:slug', permanent: true },
      {
        source: '/api/landing/updates',
        destination: '/api/landing/posts',
        permanent: true,
      },
      { source: '/favicon.ico', destination: '/favicon.png', permanent: true },
    ]
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
