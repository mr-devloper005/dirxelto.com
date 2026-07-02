'use client'

import { Building2, FileText, Image as ImageIcon, Mail, MapPin, MessageCircleQuestion, Phone, Sparkles, Bookmark } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

function getLanes(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Business onboarding', body: 'Add listings, verify operational details, and bring your business surface live quickly.' },
      { icon: Phone, title: 'Partnership support', body: 'Talk through bulk publishing, local growth, and operational setup questions.' },
      { icon: MapPin, title: 'Coverage requests', body: 'Need a new geography or category lane? We can shape the directory around it.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText, title: 'Editorial submissions', body: 'Pitch essays, columns, and long-form ideas that fit the publication.' },
      { icon: Mail, title: 'Newsletter partnerships', body: 'Coordinate sponsorships, collaborations, and issue-level campaigns.' },
      { icon: Sparkles, title: 'Contributor support', body: 'Get help with voice, formatting, and publication workflow questions.' },
    ]
  }
  if (kind === 'visual') {
    return [
      { icon: ImageIcon, title: 'Creator collaborations', body: 'Discuss gallery launches, creator features, and visual campaigns.' },
      { icon: Sparkles, title: 'Licensing and use', body: 'Reach out about usage rights, commercial requests, and visual partnerships.' },
      { icon: Mail, title: 'Media kits', body: 'Request creator decks, editorial support, or visual feature placement.' },
    ]
  }
  return [
    { icon: Bookmark, title: 'Collection submissions', body: 'Suggest resources, boards, and links that deserve a place in the library.' },
    { icon: Mail, title: 'Resource partnerships', body: 'Coordinate curation projects, reference pages, and link programs.' },
    { icon: Sparkles, title: 'Curator support', body: 'Need help organizing shelves, collections, or profile-connected boards?' },
  ]
}

const faqs = [
  {
    q: 'How long does a listing or bookmark review take?',
    a: 'Most submissions are checked and published within a couple of business days once the required details are complete.',
  },
  {
    q: 'What details does a business listing need?',
    a: 'Name, category, location, and a way to contact the business. Photos and a short description help it stand out in search.',
  },
  {
    q: 'Can I submit a bookmark without an account?',
    a: 'You will need an account so saved links stay attached to a profile and can be edited or removed later.',
  },
  {
    q: 'What happens if a submission gets rejected?',
    a: 'We will reach out through the contact form with the reason so you can fix the details and resubmit.',
  },
]

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)

  return (
    <EditableSiteShell className={pal.pageBg}>
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[360px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--slot4-accent-soft),transparent_70%)] opacity-70" />
          <div className={`px-5 pb-10 pt-20 sm:px-8 sm:pt-24 ${dc.shell.section}`}>
            <EditableReveal>
              <p className={dc.type.eyebrow}>{pagesContent.contact.eyebrow}</p>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className={`mt-4 max-w-3xl ${dc.type.sectionTitle} text-[var(--slot4-page-text)]`}>{pagesContent.contact.title}</h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className={`mt-5 max-w-2xl text-sm leading-8 sm:text-base ${pal.mutedText}`}>{pagesContent.contact.description}</p>
            </EditableReveal>
          </div>
        </section>

        {/* Two-column: lanes + form */}
        <section className={`pb-16 sm:pb-20 ${dc.shell.section}`}>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-4">
              {lanes.map((lane, index) => (
                <EditableReveal key={lane.title} index={index} className={`${dc.surface.card} p-6`}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                    <lane.icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-4 text-lg font-semibold tracking-[-0.01em] text-[var(--slot4-page-text)]">{lane.title}</h2>
                  <p className={`mt-2 text-sm leading-6 ${pal.mutedText}`}>{lane.body}</p>
                </EditableReveal>
              ))}
            </div>

            <EditableReveal index={1}>
              <div className={`${dc.surface.card} p-7 sm:p-8`}>
                <p className={dc.type.eyebrow}>{pagesContent.contact.formTitle}</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.01em] text-[var(--slot4-page-text)]">Send us a message</h2>
                <EditableContactLeadForm />
              </div>
            </EditableReveal>
          </div>
        </section>

        {/* FAQ */}
        <section className={pal.warmBg}>
          <div className={`py-16 sm:py-20 ${dc.shell.section}`}>
            <EditableReveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className={dc.type.eyebrow}>Common questions</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.01em] text-[var(--slot4-page-text)] sm:text-3xl">Submitting to the directory.</h2>
              </div>
            </EditableReveal>
            <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
              {faqs.map((item, index) => (
                <EditableReveal key={item.q} index={index} className={`${dc.surface.card} p-6`}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                    <MessageCircleQuestion className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="mt-3 text-base font-semibold leading-snug tracking-[-0.01em] text-[var(--slot4-page-text)]">{item.q}</h3>
                  <p className={`mt-2 text-sm leading-6 ${pal.mutedText}`}>{item.a}</p>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
