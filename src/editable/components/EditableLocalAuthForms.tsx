'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

const USERS_KEY = 'slot4:local-auth-users'
const SESSION_KEY = 'slot4:local-auth-session'

type LocalUser = {
  name: string
  email: string
  password: string
  createdAt: string
}

const readUsers = (): LocalUser[] => {
  if (typeof window === 'undefined') return []
  try {
    const parsed = JSON.parse(window.localStorage.getItem(USERS_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const saveUsers = (users: LocalUser[]) => window.localStorage.setItem(USERS_KEY, JSON.stringify(users))

const saveSession = (user: Pick<LocalUser, 'name' | 'email'>) => {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email, loggedInAt: new Date().toISOString() }))
  window.dispatchEvent(new Event('slot4-auth-change'))
}

const inputClass = 'h-12 w-full rounded-lg border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition focus:border-[var(--slot4-accent)] focus:ring-4 focus:ring-[var(--slot4-accent-soft)] placeholder:text-[var(--slot4-soft-muted-text)]'
const labelClass = 'grid gap-2 text-sm font-semibold text-[var(--slot4-page-text)]'
const buttonClass = `${dc.button.primary} w-full`
const messageClass = (status: 'idle' | 'success' | 'error') =>
  `flex items-start gap-2.5 rounded-lg px-4 py-3 text-sm font-semibold ${
    status === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]'
  }`

export function EditableLocalLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    const user = readUsers().find((item) => item.email.toLowerCase() === normalizedEmail)
    if (!user || user.password !== password) {
      setStatus('error')
      setMessage(pagesContent.auth.login.noAccount)
      return
    }
    saveSession(user)
    setStatus('success')
    setMessage(pagesContent.auth.login.success)
    window.setTimeout(() => router.push('/'), 500)
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={submit}>
      <label className={labelClass}>
        Email address
        <input className={inputClass} type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <label className={labelClass}>
        Password
        <input className={inputClass} type="password" placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </label>
      {message ? (
        <p className={messageClass(status)}>
          {status === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
          <span>{message}</span>
        </p>
      ) : null}
      <button type="submit" className={buttonClass}>{pagesContent.auth.login.submitLabel}</button>
    </form>
  )
}

export function EditableLocalSignupForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()
    if (password.length < 4) {
      setStatus('error')
      setMessage(pagesContent.auth.signup.passwordShort)
      return
    }
    const users = readUsers()
    const nextUser: LocalUser = {
      name: normalizedName || normalizedEmail.split('@')[0] || 'Member',
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
    }
    saveUsers([nextUser, ...users.filter((item) => item.email.toLowerCase() !== normalizedEmail)])
    saveSession(nextUser)
    setStatus('success')
    setMessage(pagesContent.auth.signup.success)
    window.setTimeout(() => router.push('/'), 500)
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={submit}>
      <label className={labelClass}>
        Full name
        <input className={inputClass} placeholder="Jordan Blake" value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label className={labelClass}>
        Email address
        <input className={inputClass} type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <label className={labelClass}>
        Password
        <input className={inputClass} type="password" placeholder="At least 4 characters" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </label>
      {message ? (
        <p className={messageClass(status)}>
          {status === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
          <span>{message}</span>
        </p>
      ) : null}
      <button type="submit" className={buttonClass}>{pagesContent.auth.signup.submitLabel}</button>
    </form>
  )
}

export function useEditableLocalAuthSession() {
  const [session, setSession] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const load = () => {
      try {
        const parsed = JSON.parse(window.localStorage.getItem(SESSION_KEY) || 'null')
        setSession(parsed && typeof parsed.email === 'string' ? parsed : null)
      } catch {
        setSession(null)
      }
    }
    load()
    window.addEventListener('slot4-auth-change', load)
    window.addEventListener('storage', load)
    return () => {
      window.removeEventListener('slot4-auth-change', load)
      window.removeEventListener('storage', load)
    }
  }, [])

  const logout = () => {
    window.localStorage.removeItem(SESSION_KEY)
    window.dispatchEvent(new Event('slot4-auth-change'))
    setSession(null)
  }

  return { session, logout }
}
