import type { Field } from 'payload'

export const landingKindOptions = [
  { label: 'Changelog', value: 'changelog' },
  { label: 'Essay', value: 'essay' },
  { label: 'Demo', value: 'demo' },
  { label: 'Link', value: 'link' },
] as const

export const landingIconOptions = [
  { label: 'Spark (changelog)', value: 'spark' },
  { label: 'Pen (essay)', value: 'pen' },
  { label: 'Play (demo)', value: 'play' },
  { label: 'Link', value: 'link' },
] as const

export const landingCardFields: Field[] = [
  {
    name: 'showOnLanding',
    type: 'checkbox',
    defaultValue: false,
    admin: {
      description: 'Show in the landing page Posts card.',
    },
  },
  {
    name: 'sortOrder',
    type: 'number',
    defaultValue: 0,
    admin: {
      description: 'Higher = appears first. Order wins over publish date.',
    },
  },
  {
    name: 'kind',
    type: 'select',
    defaultValue: 'essay',
    options: [...landingKindOptions],
  },
  {
    name: 'sourceLabel',
    type: 'text',
    admin: {
      description: 'Label under the title, e.g. “essay”, “changelog”, “demo · 0:48”.',
    },
  },
  {
    name: 'iconStyle',
    type: 'select',
    defaultValue: 'pen',
    options: [...landingIconOptions],
  },
]

export const seoFields: Field[] = [
  {
    name: 'metaTitle',
    type: 'text',
    admin: {
      description: 'Search / social title. Falls back to post title if empty.',
    },
  },
  {
    name: 'metaDescription',
    type: 'textarea',
    admin: {
      description: 'Search / social description. Falls back to excerpt if empty.',
    },
  },
  {
    name: 'ogImage',
    type: 'upload',
    relationTo: 'media',
    admin: {
      description: 'Social share image. Falls back to cover image if empty.',
    },
  },
  {
    name: 'noIndex',
    type: 'checkbox',
    defaultValue: false,
    admin: {
      description: 'Ask search engines not to index this post.',
    },
  },
]
