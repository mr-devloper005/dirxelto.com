import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  const copy = pagesContent.auth.login
  return (
    <EditableSiteShell>
      <main className={dc.shell.page}>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--slot4-accent-soft),transparent_70%)] opacity-70" />
          <div className={`${dc.shell.section} grid min-h-[calc(100vh-14rem)] items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1fr_0.95fr] lg:py-24`}>
            <EditableReveal>
              <div className="max-w-lg">
                <span className={dc.badge.pill}>
                  <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {copy.badge}
                </span>
                <h1 className={`${dc.type.sectionTitle} mt-6 text-[var(--slot4-page-text)]`}>{copy.title}</h1>
                <p className={`mt-5 max-w-md ${dc.type.body}`}>{copy.description}</p>
                <div className={`mt-10 flex items-start gap-4 rounded-2xl border ${pal.border} ${pal.surfaceBg} p-5`}>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${pal.accentSoftBg} text-[var(--slot4-accent)]`}>
                    <Sparkles className="h-4.5 w-4.5" />
                  </span>
                  <p className={`text-sm leading-6 ${pal.mutedText}`}>
                    One account keeps every bookmark, listing, and submission you manage in a single, searchable place.
                  </p>
                </div>
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <div className={`${dc.surface.card} p-7 sm:p-9`}>
                <h2 className="text-2xl font-semibold tracking-[-0.01em] text-[var(--slot4-page-text)]">{copy.formTitle}</h2>
                <p className={`mt-1.5 text-sm ${pal.mutedText}`}>Enter your details to continue.</p>
                <EditableLocalLoginForm />
                <p className={`mt-6 text-sm ${pal.mutedText}`}>
                  New here?{' '}
                  <Link href="/signup" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                    {copy.createCta}
                  </Link>
                </p>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
