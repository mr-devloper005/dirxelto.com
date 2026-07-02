import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/**
 * Large single showcase panel — used for the homepage spotlight.
 * Mirrors the reference site's featured case-study card: full-bleed image with
 * one soft dark overlay, a small mono label bottom-left, serif title.
 */
export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group relative block overflow-hidden rounded-3xl">
      <div className="relative aspect-[16/10] sm:aspect-[16/8]">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(25,24,24,0.05)_0%,rgba(25,24,24,0.35)_55%,rgba(25,24,24,0.82)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-8 sm:p-12">
          <span className="editable-mono self-start rounded-full bg-[var(--slot4-page-bg)]/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-page-text)]">
            {label}
          </span>
          <h3 className="editable-display-serif max-w-3xl text-2xl font-normal leading-[1.05] tracking-[-0.02em] text-white sm:text-4xl lg:text-[3rem]">
            {post.title}
          </h3>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block`}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} loading="lazy" />
      </div>
      <div className="mt-4">
        <p className="editable-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
          {String(index + 1).padStart(2, '0')} · {getEditableCategory(post)}
        </p>
        <h3 className="editable-display-serif mt-2 line-clamp-3 text-lg font-normal leading-[1.2] tracking-[-0.01em] text-[var(--slot4-page-text)]">
          {post.title}
        </h3>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block border-b border-[var(--editable-border)] py-6 last:border-b-0">
      <div className="flex items-start gap-6 sm:gap-10">
        <span className="editable-mono w-8 shrink-0 pt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
            {getEditableCategory(post)}
          </p>
          <h3 className="editable-display-serif mt-2 line-clamp-2 text-xl font-normal tracking-[-0.01em] text-[var(--slot4-page-text)] sm:text-2xl">
            {post.title}
          </h3>
          <p className={`mt-2 line-clamp-2 text-sm leading-[1.7] ${pal.mutedText}`}>{getEditableExcerpt(post, 130)}</p>
        </div>
        <ArrowUpRight className="hidden h-4 w-4 shrink-0 text-[var(--slot4-muted-text)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--slot4-page-text)] sm:block" />
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid min-w-0 gap-6 border-t border-[var(--editable-border)] py-8 sm:grid-cols-[260px_minmax(0,1fr)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} />
      </div>
      <div className="min-w-0">
        <p className="editable-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
          {String(index + 1).padStart(2, '0')} · {getEditableCategory(post)}
        </p>
        <h2 className="editable-display-serif mt-3 line-clamp-2 text-2xl font-normal leading-[1.15] tracking-[-0.01em] text-[var(--slot4-page-text)] sm:text-3xl">
          {post.title}
        </h2>
        <p className={`mt-3 line-clamp-2 text-sm leading-[1.7] ${pal.mutedText}`}>{getEditableExcerpt(post, 180)}</p>
        <span className="editable-mono mt-5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-page-text)] transition group-hover:gap-3">
          Read <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}
