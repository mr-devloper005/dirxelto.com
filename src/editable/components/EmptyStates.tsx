import Link from 'next/link'
import { ArrowRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing listed here yet',
  description = 'Fresh listings and bookmarks will appear here automatically once this section goes live.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn(`${dc.surface.card} p-8 text-center sm:p-12`, className)}>
      <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${pal.accentSoftBg} text-[var(--slot4-accent)]`}>
        <SearchX className="h-6 w-6" />
      </div>
      <h2 className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-[var(--slot4-page-text)]">{title}</h2>
      <p className={`mx-auto mt-3 max-w-xl text-sm leading-7 ${pal.mutedText}`}>{description}</p>
      <Link href={actionHref} className={`mt-7 ${dc.button.secondary}`}>
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'listings', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} from the directory will appear here automatically. This page stays ready even when the feed is empty.`}
      actionLabel="Explore the directory"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your request has been saved and routed through the contact workflow."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
