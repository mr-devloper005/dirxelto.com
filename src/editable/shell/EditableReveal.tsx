'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ElementType, ReactNode } from 'react'

type EditableRevealProps = {
  children: ReactNode
  /** Stagger index — multiplied by `stepMs` to offset this item's transition. */
  index?: number
  /** Per-step stagger delay in ms. */
  stepMs?: number
  as?: ElementType
  className?: string
  style?: CSSProperties
}

/**
 * Progressive-enhancement scroll reveal. Server-rendered output is fully
 * visible; the hidden/pending state is only ever applied client-side after
 * mount, so content stays visible if JavaScript never runs.
 */
export function EditableReveal({ children, index = 0, stepMs = 90, as: Tag = 'div', className = '', style }: EditableRevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`${mounted ? 'editable-reveal' : ''} ${visible ? 'is-visible' : ''} ${className}`}
      style={{ ...style, transitionDelay: mounted ? `${index * stepMs}ms` : undefined }}
    >
      {children}
    </Tag>
  )
}
