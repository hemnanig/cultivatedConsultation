import StaticPageLayout from '../components/StaticPageLayout.jsx'
import { EnvelopeIcon } from '../components/icons.jsx'

const SUPPORT_EMAIL = 'admin@cultivatedconsultation.com'

export default function Contact({ me, onSignedOut }) {
  return (
    <StaticPageLayout
      me={me}
      onSignedOut={onSignedOut}
      eyebrow="Support"
      title="Contact us"
      subtitle="Questions about the platform, your membership, or anything else — our team is here to help."
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <EnvelopeIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-stone-900">Email support</p>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-sm text-brand-700 hover:underline">
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>
        <a href={`mailto:${SUPPORT_EMAIL}`} className="cc-btn shrink-0">
          Send an email
        </a>
      </div>
      <p className="text-sm leading-relaxed text-stone-600">
        We typically respond within a couple of business days. If your question is about a specific member interaction
        or a piece of content on the platform, feel free to mention the post or profile so we can look into it quickly.
      </p>
    </StaticPageLayout>
  )
}
