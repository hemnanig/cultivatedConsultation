import StaticPageLayout from '../components/StaticPageLayout.jsx'

const comparison = [
  {
    label: 'Privacy & Security',
    us: 'Enhanced security measures and data encryption — access to engage is only permitted after professional credentials have been verified.',
    social: 'Limited control over data privacy, potential for breaches, no guaranteed encryption.',
  },
  {
    label: 'Confidentiality & Ethics',
    us: 'Strict confidentiality protocols, adherence to professional and ethical standards, clear terms of service.',
    social: "Relies on group members' adherence to ethical guidelines; potential for accidental sharing.",
  },
  {
    label: 'Credentials & Transparency',
    us: 'Robust credential verification for every member, with a clear designation of graduate student, pre-licensed, or independently licensed status alongside full name and licensure information.',
    social: 'Manual verification at best, potential for fake profiles or professionally inappropriate participants.',
  },
  {
    label: 'Audience Targeting',
    us: 'Advanced targeting by geographic location, licensure type, languages spoken, and more — useful for excluding individuals from a specific consultation conversation.',
    social: 'Limited to group membership, with no way to target a smaller group within the group.',
  },
]

const faqs = [
  {
    q: 'Who is this platform for?',
    a: 'Cultivated Consultation is designed for mental health professionals, including independently licensed practitioners, pre-licensed individuals, and graduate students in mental health fields. We aim to foster a community that prioritizes peer consultation, supervision, and ethical guidance — a transparent, compliant space for information sharing that enhances the quality of care and ethical standards within the profession.',
  },
  {
    q: 'Can I share my research, a job opening, or a supervision opportunity?',
    a: 'Yes — you can share links to research projects, recruit participants, advertise job openings, and seek out supervision. This information lives in a designated section of the member portal, visible only when you actively choose to view it, so the rest of the platform stays focused on consultation.',
  },
  {
    q: 'How do you verify members’ credentials?',
    a: 'We verify the credentials of every member through a review of licenses, certifications, and academic qualifications, cross-referenced with official state licensing boards and professional organizations. Members verify an email address linked to their state licensure board (for licensed professionals) or their university (for students currently enrolled in good standing). Licensed professionals are reverified upon license expiration or renewal. Verified credentials are displayed on member profiles so connections and consultations happen with informed trust.',
  },
  {
    q: 'How long does my membership last, and what does it cost?',
    a: 'Membership stays active until you cancel; canceling mid-cycle keeps access through the end of that billing period, with no refunds for early cancellation. New accounts can take up to 72 hours to be fully verified — you can complete your profile during that window, but can’t engage with other members until verification is complete.',
  },
  {
    q: 'What are the membership tiers?',
    a: 'Graduate Student: $7/month. Pre-Licensed Professional: $12/month. Independently Licensed Professional: $15/month. The first 500 members can lock in a 15-day free trial and a $5/month lifetime rate using the tier-matched code at signup (INTRO-GRAD, INTRO-PREL, or INTRO-LIC).',
  },
  {
    q: 'What shows up on my public profile?',
    a: 'Your name, licensure type and location (or program of study), areas of expertise/practice, and licensure status (independently licensed or under supervision). You can optionally add business information and a website link. This transparency is what keeps the community professional and aligned with ethical codes of practice.',
  },
]

export default function Faq({ me, onSignedOut }) {
  return (
    <StaticPageLayout
      me={me}
      onSignedOut={onSignedOut}
      eyebrow="Support"
      title="Frequently asked questions"
      subtitle="How Cultivated Consultation is different from a social media group, plus the questions we hear most often."
    >
      <div>
        <h2 className="mb-3 text-base font-semibold text-stone-900">Our platform vs. social media groups</h2>
        <div className="overflow-hidden rounded-lg border border-stone-200">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-stone-50 text-xs font-semibold uppercase tracking-wide text-stone-500">
                <th className="px-4 py-2.5">&nbsp;</th>
                <th className="px-4 py-2.5">Cultivated Consultation</th>
                <th className="px-4 py-2.5">Social media groups</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.label} className="border-t border-stone-100 align-top">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-stone-900">{row.label}</td>
                  <td className="px-4 py-3 text-stone-700">{row.us}</td>
                  <td className="px-4 py-3 text-stone-500">{row.social}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-stone-100 border-t border-stone-100">
        {faqs.map((item) => (
          <details key={item.q} className="group py-4 first:pt-0">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-stone-900 marker:content-['']">
              {item.q}
              <span className="shrink-0 text-stone-400 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.a}</p>
          </details>
        ))}
      </div>
    </StaticPageLayout>
  )
}
