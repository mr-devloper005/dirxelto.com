import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Local business directory & community bookmarks',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Local business directory & community bookmarks',
    primaryLinks: [
      { label: 'Businesses', href: '/listing' },
      { label: 'Bookmarks', href: '/sbm' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Browse the directory', href: '/listing' },
      secondary: { label: 'Submit a listing', href: '/create' },
    },
  },
  footer: {
    tagline: 'A directory for local businesses and community bookmarks',
    description: 'A searchable home for trusted local businesses and the bookmarks the community actually saves.',
    columns: [
      {
        title: 'Directory',
        links: [
          { label: 'Businesses', href: '/listing' },
          { label: 'Bookmarks', href: '/sbm' },
          { label: 'Search', href: '/search' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Submit a listing', href: '/create' },
        ],
      },
    ],
    bottomNote: 'Built for clean discovery — no clutter, no dead links.',
  },
  commonLabels: {
    readMore: 'View details',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Added',
  },
} as const
