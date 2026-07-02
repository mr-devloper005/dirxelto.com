import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Local business directory and community bookmarks',
      description: 'Find trusted local businesses and browse community-saved bookmarks in one clean, searchable directory.',
      openGraphTitle: 'Local business directory and community bookmarks',
      openGraphDescription: 'Discover local businesses and community-curated bookmarks, all in one connected directory.',
      keywords: ['business directory', 'local listings', 'social bookmarking', 'bookmark directory', 'find local businesses'],
    },
    hero: {
      badge: 'Directory + community bookmarks',
      // Kept as a plain sentence too (not just the lead/emphasis/tail split below)
      // so the hero always has a simple fallback title if a layout needs one.
      title: ['Find local businesses and worthwhile links', 'in one place.'],
      titleLead: 'Find local businesses and',
      titleEmphasis: 'worthwhile links',
      titleTail: 'in one place.',
      description:
        'A single, searchable home for trusted local businesses and the bookmarks the community actually saves — no clutter, no dead ends.',
      primaryCta: { label: 'Browse the directory', href: '/listing' },
      secondaryCta: { label: 'Explore bookmarks', href: '/sbm' },
      searchPlaceholder: 'Search businesses, bookmarks, or categories',
      trust: [
        { label: 'Verified listings' },
        { label: 'Community-curated links' },
        { label: 'Updated daily' },
      ],
    },
    showcase: {
      badge: 'Spotlight',
      title: 'What the community is finding right now.',
    },
    // Kept for the editable-content contract test (requires at least one intro
    // paragraph); the homepage itself now renders this as the Benefits section.
    intro: {
      paragraphs: [
        'This directory brings trusted local businesses and community-saved bookmarks together in one searchable place, so visitors never have to guess where to look.',
      ],
    },
    stats: {
      badge: 'At a glance',
      title: 'A directory that keeps growing.',
    },
    browse: {
      badge: 'Browse',
      title: 'Pick a place to start.',
      description: 'Jump straight into the directory or the bookmark shelf, or scan every open category below.',
    },
    howItWorks: {
      badge: 'How it works',
      title: 'Get listed or get saved in three steps.',
      steps: [
        { title: 'Submit', description: 'Add your business details or drop a link worth saving — takes a couple of minutes.' },
        { title: 'Get reviewed', description: 'Submissions are checked for quality before they go live in the directory.' },
        { title: 'Get discovered', description: 'Your listing or bookmark becomes searchable and browsable by the whole community.' },
      ],
    },
    activity: {
      badge: 'Fresh',
      title: 'Recently added',
      description: 'The newest businesses and bookmarks the community has added to the directory.',
    },
    benefits: {
      badge: 'Why this directory',
      title: 'Built to be useful, not noisy.',
      items: [
        { title: 'Clean, searchable listings', description: 'Every business entry carries the details you actually need — location, contact, and category — with nothing to dig through.' },
        { title: 'Community-vetted bookmarks', description: 'Saved links are organized and tagged so the useful ones stay easy to find later.' },
        { title: 'Free to submit', description: 'Listing a business or saving a bookmark takes minutes and costs nothing.' },
        { title: 'Always up to date', description: 'New submissions and edits flow into the directory continuously, not on a quarterly refresh.' },
      ],
    },
    cta: {
      badge: 'Join the directory',
      title: 'Get your business listed or save your first bookmark.',
      description: 'It takes a couple of minutes to add a business or a link — and it stays discoverable for everyone who searches this directory.',
      primaryCta: { label: 'Submit now', href: '/create' },
      secondaryCta: { label: 'Contact us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'Our story',
    title: 'A directory built around what actually gets used.',
    description: `${slot4BrandConfig.siteName} started as a simple idea: local businesses and useful links both deserve a home that's easy to search and free to submit to.`,
    paragraphs: [
      'We kept seeing the same problem — good local businesses buried under ads, and useful bookmarks scattered across bookmarking tools nobody revisits. So we built one directory that treats both as first-class citizens.',
      'Every listing and every saved link goes through the same lightweight review before it goes live, so the directory stays useful instead of turning into a dumping ground.',
    ],
    values: [
      {
        title: 'Community-submitted',
        description: 'Businesses and bookmarks are added by the people who use them, not scraped from somewhere else.',
      },
      {
        title: 'Lightly moderated',
        description: 'Every submission is checked before it goes live, so search results stay clean and relevant.',
      },
      {
        title: 'Free to list',
        description: 'Adding a business or saving a bookmark costs nothing and takes a couple of minutes.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: "Questions about a listing or bookmark? We're on it.",
    description: 'Tell us what you need — claiming a business, flagging a broken link, or something else — and we will route it to the right place instead of a generic inbox.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search local businesses and community-saved bookmarks across the whole directory.',
    },
    hero: {
      badge: 'Search the directory',
      title: 'Find any business or bookmark in seconds.',
      description: 'Search by name, category, or keyword across every listing and saved link in the directory.',
      placeholder: 'Search businesses, bookmarks, or categories',
    },
    resultsTitle: 'Search results',
  },
  create: {
    metadata: {
      title: 'Submit',
      description: 'Submit a business listing or save a bookmark to the directory.',
    },
    locked: {
      badge: 'Account required',
      title: 'Sign in to submit a listing or bookmark.',
      description: 'Create a free account to add a business to the directory or save a link for the community.',
    },
    hero: {
      badge: 'Submission workspace',
      title: 'Add a business listing or save a bookmark.',
      description: 'Pick a listing type, add the details, and submit — most submissions go live within a day or two.',
    },
    formTitle: 'Submission details',
    submitLabel: 'Submit for review',
    successTitle: 'Submitted. Your entry is now in the review queue.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to manage your listings and bookmarks.',
      badge: 'Member access',
      title: 'Welcome back.',
      description: 'Sign in to manage your submissions and add new listings or bookmarks.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then sign in.',
      success: 'Signed in. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create an account to submit listings and bookmarks.',
      badge: 'Join the directory',
      title: 'Create your account.',
      description: 'Sign up to submit business listings, save bookmarks, and manage your entries.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting...',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related guides',
      fallbackTitle: 'Guide details',
    },
    listing: {
      relatedTitle: 'Similar businesses nearby',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related photos',
      fallbackTitle: 'Photo details',
    },
    profile: {
      relatedTitle: 'Other members',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit website',
    },
  },
} as const
