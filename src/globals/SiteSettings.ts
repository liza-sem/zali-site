import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'Zali',
    },
    {
      name: 'waitlistCount',
      type: 'number',
      admin: {
        description:
          'Optional number shown after signup, e.g. “You’re on the list · #313”. Update manually until Mautic is connected.',
      },
    },
    {
      name: 'footerText',
      type: 'text',
      defaultValue: 'zali © 2026',
      admin: {
        description: 'Copyright line in the landing page footer.',
      },
    },
    {
      name: 'footerLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
