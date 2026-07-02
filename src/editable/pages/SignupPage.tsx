import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  const copy = pagesContent.auth.signup
  return (
    <EditableSiteShell>
      <main className={dc.shell.page}>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--slot4-accent-soft),transparent_70%)] opacity-70" />
          <div className={`${dc.shell.section} grid min-h-[calc(100vh-14rem)] items-center gap-12 py-16 sm:py-20 lg:grid-cols-[0.95fr_1fr] lg:py-24`}>
            <EditableReveal>
              <div className={`${dc.surface.card} p-7 sm:p-9`}>
                <h1 className="text-2xl font-semibold tracking-[-0.01em] text-[var(--slot4-page-text)]">{copy.formTitle}</h1>
                <p className={`mt-1.5 text-sm ${pal.mutedText}`}>Create an account to unlock the publishing workspace.</p>
                <EditableLocalSignupForm />
                <p className={`mt-6 text-sm ${pal.mutedText}`}>
                  Already have an account?{' '}
                  <Link href="/login" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                    {copy.loginCta}
                  </Link>
                </p>
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <div className="max-w-lg lg:pl-4">
                <span className={dc.badge.pill}>
                  <ShieldCheck className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {copy.badge}
                </span>
                <h2 className={`${dc.type.sectionTitle} mt-6 text-[var(--slot4-page-text)]`}>{copy.title}</h2>
                <p className={`mt-5 max-w-md ${dc.type.body}`}>{copy.description}</p>
                <div className={`mt-10 flex items-start gap-4 rounded-2xl border ${pal.border} ${pal.surfaceBg} p-5`}>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${pal.accentSoftBg} text-[var(--slot4-accent)]`}>
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </span>
                  <p className={`text-sm leading-6 ${pal.mutedText}`}>
                    Free to join. Add listings, save bookmarks, and track everything you submit from one dashboard.
                  </p>
                </div>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
