import Link from 'next/link'
import { ArrowRight, ChevronLeft, Sparkles } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export function EditableArticleArchive({ posts, pagination, category = 'all', basePath = '/article' }: { posts: SitePost[]; pagination: SiteFeedPagination; category?: string; basePath?: string }) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) => `${basePath}?${new URLSearchParams({ ...(category && category !== 'all' ? { category } : {}), page: String(nextPage) }).toString()}`
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-12 sm:pt-16 lg:pt-20`}>
        <EditableReveal>
          <div className={`${dc.surface.dark} p-7 sm:p-10 lg:p-14`}>
            <span className={`${dc.badge.pill} border-white/15 bg-white/10 text-white`}>
              <Sparkles className="h-3.5 w-3.5 text-white/80" /> {voice.eyebrow}
            </span>
            <h1 className={`${dc.type.heroTitle} mt-6 max-w-4xl text-[var(--slot4-dark-text)]`}>{voice.headline}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">{voice.description}</p>
            <form action={basePath} className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
              <select name="category" defaultValue={category || 'all'} className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white px-5 py-3 text-sm font-semibold text-[var(--slot4-page-text)] outline-none">
                <option value="all">All categories</option>
                {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className={`${pal.accentBg} rounded-lg px-6 py-3 text-sm font-semibold text-[var(--slot4-on-accent)] transition duration-300 hover:-translate-y-0.5 hover:opacity-90`}>Filter</button>
            </form>
          </div>
        </EditableReveal>
      </section>

      <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        {posts.length ? (
          <div className="grid gap-5">
            {posts.map((post, index) => (
              <EditableReveal key={post.id} index={index % 6}>
                <ArticleListCard post={post} href={postHref('article', post, basePath)} index={index + (page - 1) * pagination.limit} />
              </EditableReveal>
            ))}
          </div>
        ) : (
          <div className={`${dc.surface.soft} p-10 text-center`}>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--slot4-page-text)]">No articles found</h2>
            <p className={`mt-3 text-sm leading-7 ${pal.mutedText}`}>Try another category or return to all articles.</p>
          </div>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage ? <Link href={pageHref(page - 1)} className={dc.button.secondary}>Previous</Link> : null}
          <span className={`rounded-lg ${pal.darkBg} ${pal.darkText} px-5 py-3 text-sm font-semibold`}>Page {page} of {pagination.totalPages || 1}</span>
          {pagination.hasNextPage ? <Link href={pageHref(page + 1)} className={dc.button.secondary}>Next</Link> : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-10 sm:pt-14 lg:pt-16`}>
        <div className={`grid gap-6 ${dc.surface.card} p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-10`}>
          <div className="min-w-0">
            <Link href="/article" className={`inline-flex items-center gap-2 rounded-lg border ${pal.border} px-4 py-2 text-sm font-semibold text-[var(--slot4-page-text)]`}>
              <ChevronLeft className="h-4 w-4" /> Articles
            </Link>
            <p className={`${dc.type.eyebrow} mt-8`}>{voice.eyebrow}</p>
            <h1 className={`${dc.type.sectionTitle} mt-4 max-w-4xl text-[var(--slot4-page-text)]`}>{post?.title || pagesContent.detailPages.article.fallbackTitle}</h1>
          </div>
          <aside className={`min-w-0 ${dc.surface.dark} p-6`}>
            <p className={`${dc.type.eyebrow} text-white/70`}>Reading note</p>
            <p className="mt-4 text-sm leading-7 text-white/70">{voice.secondaryNote}</p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[var(--slot4-page-text)] transition duration-300 hover:-translate-y-0.5 hover:opacity-90">
              Contact <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>
      <section className="mx-auto w-full max-w-5xl px-5 pb-16 pt-6 sm:px-8 lg:px-10 lg:pb-24">
        <div className={`${dc.surface.card} p-6 sm:p-8 lg:p-10`}>
          <p className={`text-sm leading-8 ${pal.mutedText}`}>{post?.summary || `Article detail content for ${slug} will render through the editable detail page.`}</p>
        </div>
      </section>
    </main>
  )
}
