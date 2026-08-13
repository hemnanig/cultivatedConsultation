import AppLayout from './AppLayout.jsx'

/**
 * Shared shell for the informational/legal pages (FAQ, Contact, Privacy
 * Policy, Terms of Service) — same card-on-page-background treatment as the
 * rest of the app, just a title/subtitle header plus a prose-style card.
 */
export default function StaticPageLayout({ me, onSignedOut, eyebrow, title, subtitle, children }) {
  return (
    <AppLayout me={me} onSignedOut={onSignedOut}>
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
        <div>
          {eyebrow && (
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">{eyebrow}</p>
          )}
          <h1 className="font-display text-2xl font-semibold text-stone-900 sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm leading-relaxed text-stone-600">{subtitle}</p>}
        </div>
        <div className="cc-card flex flex-col gap-5 p-6 sm:p-8">{children}</div>
      </main>
    </AppLayout>
  )
}

/** Section heading used inside legal-text bodies. */
export function LegalHeading({ children }) {
  return <h2 className="mt-2 text-base font-semibold text-stone-900 first:mt-0">{children}</h2>
}

/** Paragraph used inside legal-text bodies. */
export function LegalP({ children }) {
  return <p className="text-sm leading-relaxed text-stone-700">{children}</p>
}

/** Bullet list used inside legal-text bodies. */
export function LegalList({ items }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-stone-700">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}
