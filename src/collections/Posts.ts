import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { landingCardFields, seoFields } from '@/lib/landing-card-fields'

const isWrite = (_: unknown, siblingData?: { postType?: string }) =>
  siblingData?.postType !== 'external'

const isExternal = (_: unknown, siblingData?: { postType?: string }) =>
  siblingData?.postType === 'external'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'postType', 'published', 'showOnLanding', 'sortOrder'],
    description: 'Write an article (/posts/…) or add an external link for the landing feed.',
    components: {
      views: {
        list: {
          Component: '/components/admin/PostsListView#PostsListView',
        },
      },
    },
    preview: (doc) => {
      if (doc?.postType === 'external') return null
      const slug = typeof doc?.slug === 'string' ? doc.slug : null
      if (!slug) return null
      const base = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(
        /\/$/,
        '',
      )
      return `${base}/posts/${slug}`
    },
  },
  defaultSort: '-sortOrder',
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { published: { equals: true } }
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'postType',
              type: 'select',
              required: true,
              defaultValue: 'write',
              options: [
                { label: 'Write', value: 'write' },
                { label: 'External link', value: 'external' },
              ],
              admin: {
                description: 'Write a post on zali.so, or link out to YouTube, Substack, etc.',
              },
            },
            slugField({
              overrides: (row) => ({
                ...row,
                admin: {
                  ...row.admin,
                  condition: isWrite,
                },
              }),
            }),
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              admin: { condition: isWrite },
            },
            {
              name: 'content',
              type: 'richText',
              admin: { condition: isWrite },
              validate: (value, { siblingData }) => {
                if (siblingData?.postType === 'external') return true
                if (!value) return 'Content is required for written posts'
                return true
              },
            },
            {
              name: 'externalUrl',
              type: 'text',
              admin: {
                condition: isExternal,
                description: 'Full URL including https://',
              },
              validate: (value, { siblingData }) => {
                if (siblingData?.postType !== 'external') return true
                if (!value) return 'URL is required for external links'
                if (!/^https?:\/\/.+/.test(value)) return 'Enter a valid http(s) URL'
                return true
              },
            },
          ],
        },
        {
          label: 'Meta',
          fields: [
            {
              name: 'excerpt',
              type: 'textarea',
              admin: {
                condition: isWrite,
                description: 'Short summary for /posts index and social fallbacks.',
              },
            },
            {
              name: 'published',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'publishedAt',
              type: 'date',
              required: true,
              admin: {
                date: { pickerAppearance: 'dayAndTime' },
              },
            },
            ...landingCardFields.map((field) => ({
              ...field,
              ...(field.admin
                ? {
                    admin: {
                      ...field.admin,
                      description:
                        field.name === 'showOnLanding'
                          ? 'Show in the landing page Posts card.'
                          : field.admin.description,
                    },
                  }
                : {}),
            })),
          ],
        },
        {
          label: 'SEO',
          admin: { condition: isWrite },
          fields: seoFields.map((field) => ({
            ...field,
            admin: { ...field.admin, condition: isWrite },
          })),
        },
      ],
    },
  ],
}
