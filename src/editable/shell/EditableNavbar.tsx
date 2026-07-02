'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(
    () => [
      
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    []
  )

  return (
    <header className="sticky top-0 z-50 bg-[var(--editable-nav-bg)]/90 text-[var(--editable-nav-text)] backdrop-blur-xl">
      <nav className="mx-auto flex h-20 w-full max-w-[var(--editable-container)] items-center px-6 sm:px-10 lg:px-16">
        <Link href="/" className="editable-display-serif shrink-0 text-xl font-normal tracking-[-0.01em] text-[var(--slot4-page-text)]">
          {SITE_CONFIG.name}
        </Link>

        <div className="ml-14 hidden items-center gap-8 lg:flex">
          {navItems.slice(0, 6).map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[13px] transition ${
                  active ? 'text-[var(--slot4-page-text)]' : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <Link
            href="/search"
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-[var(--slot4-muted-text)] transition hover:bg-[var(--slot4-panel-bg)] hover:text-[var(--slot4-page-text)] sm:inline-flex"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="hidden text-[13px] text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden rounded-full bg-[var(--editable-cta-bg)] px-5 py-2.5 text-[13px] font-medium text-[var(--editable-cta-text)] transition hover:opacity-90 sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-[13px] text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden rounded-full bg-[var(--editable-cta-bg)] px-5 py-2.5 text-[13px] font-medium text-[var(--editable-cta-text)] transition hover:opacity-90 sm:inline-flex"
              >
                Get started
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)] lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <div className="h-px bg-[var(--editable-border)]" />

      <div
        className={`overflow-hidden bg-[var(--editable-nav-bg)] transition-[max-height,opacity] duration-300 lg:hidden ${
          open ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-6 sm:px-10">
          <Link
            href="/search"
            onClick={() => setOpen(false)}
            className="mb-6 flex items-center gap-2 border-b border-[var(--editable-border)] pb-3 text-sm text-[var(--slot4-muted-text)]"
          >
            <Search className="h-4 w-4" /> Search directory & bookmarks
          </Link>
          <div className="grid gap-1">
            {[{ label: 'Home', href: '/' }, ...navItems].map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`editable-display-serif py-3 text-2xl transition ${
                    active ? 'text-[var(--slot4-page-text)]' : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
          <div className="mt-6 flex gap-3 border-t border-[var(--editable-border)] pt-6">
            {session ? (
              <>
                <Link href="/create" onClick={() => setOpen(false)} className="flex-1 rounded-full border border-[var(--editable-border)] px-4 py-3 text-center text-[13px] font-medium">
                  Submit
                </Link>
                <button type="button" onClick={() => { logout(); setOpen(false) }} className="flex-1 rounded-full bg-[var(--editable-cta-bg)] px-4 py-3 text-[13px] font-medium text-[var(--editable-cta-text)]">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="flex-1 rounded-full border border-[var(--editable-border)] px-4 py-3 text-center text-[13px] font-medium">
                  Sign in
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="flex-1 rounded-full bg-[var(--editable-cta-bg)] px-4 py-3 text-center text-[13px] font-medium text-[var(--editable-cta-text)]">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
