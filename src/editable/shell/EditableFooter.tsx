'use client'

import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'



export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="border-t border-[var(--editable-border)] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto grid w-full max-w-[var(--editable-container)] gap-12 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.9fr] lg:px-16">
        <div>
          <Link href="/" className="editable-display-serif text-2xl font-normal tracking-[-0.01em]">
            {SITE_CONFIG.name}
          </Link>
          <p className="mt-6 max-w-xs text-sm leading-[1.7] text-[var(--slot4-muted-text)]">
            {globalContent.footer?.description || SITE_CONFIG.description}
          </p>
          
        </div>

        <div>
          
          
        </div>

        <div>
          <h3 className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">
            Resources
          </h3>
          <div className="mt-6 grid gap-3">
            <Link href="/about" className="text-sm text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">About</Link>
            <Link href="/contact" className="text-sm text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">Contact</Link>
            <Link href="/search" className="text-sm text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">Search</Link>
            <Link href="/create" className="text-sm text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">Submit</Link>
          </div>
        </div>

        <div>
          <h3 className="editable-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">
            Account
          </h3>
          <div className="mt-6 grid gap-3">
            {session ? (
              <>
                <span className="text-sm text-[var(--slot4-muted-text)]">Signed in as {session.name}</span>
                <button type="button" onClick={logout} className="w-fit text-left text-sm text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">Sign in</Link>
                <Link href="/signup" className="text-sm text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">Get started</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--editable-border)] px-6 py-6 sm:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col items-center justify-between gap-3 text-xs text-[var(--slot4-muted-text)] sm:flex-row">
          <span>© {year} {SITE_CONFIG.name}. All rights reserved.</span>
          <span>{globalContent.footer?.bottomNote}</span>
        </div>
      </div>
    </footer>
  )
}
