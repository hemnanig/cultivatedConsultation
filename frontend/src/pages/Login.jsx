import { googleLoginUrl } from '../api.js'
import logo from '../assets/images/CC-1024-x-1024-px.png'

const features = [
  {
    title: 'Build connections',
    description: 'Engage in meaningful discussions with graduate students and professionals in your field.',
  },
  {
    title: 'Discover your niche',
    description: 'Find peers by specialty — perinatal mental health, trauma, addiction, and more.',
  },
  {
    title: 'A verified, secure space',
    description: 'Every member is reviewed before they can post or see the community, protecting confidential discussion.',
  },
]

export default function Login() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center gap-12 px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="max-w-md">
          <img className="mb-6 h-14 w-14" src={logo} alt="Cultivated Consultation" />
          <h1 className="font-display text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl">
            A secure space for mental health professionals to connect
          </h1>
          <p className="mt-4 text-base leading-relaxed text-stone-600">
            Cultivated Consultation is a verification-gated community where graduate students,
            pre-licensed and licensed clinicians, faculty, and researchers collaborate, seek
            mentorship, and share resources — in a trusted, credential-verified space.
          </p>

          <dl className="mt-8 flex flex-col gap-5">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                <div>
                  <dt className="font-medium text-stone-900">{feature.title}</dt>
                  <dd className="text-sm text-stone-600">{feature.description}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div className="cc-card w-full max-w-sm p-8 text-center">
          <h2 className="text-lg font-semibold text-stone-900">Sign in to continue</h2>
          <p className="mt-1 text-sm text-stone-500">
            New accounts are reviewed by an administrator before joining the community.
          </p>
          <a className="cc-btn mt-6 w-full" href={googleLoginUrl()}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path fill="currentColor" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.87Z" />
              <path fill="currentColor" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.75-2.1-6.69-4.92H1.3v3.09A12 12 0 0 0 12 24Z" />
              <path fill="currentColor" d="M5.31 14.33A7.2 7.2 0 0 1 4.93 12c0-.81.14-1.6.38-2.33V6.58H1.3A12 12 0 0 0 0 12c0 1.94.46 3.77 1.3 5.42Z" />
              <path fill="currentColor" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.3 6.58l4.01 3.09C6.25 6.85 8.89 4.75 12 4.75Z" />
            </svg>
            Continue with Google
          </a>
          <p className="mt-4 text-xs text-stone-400">
            By continuing, you agree this platform is for professional consultation only —
            never post identifying client information.
          </p>
        </div>
      </div>
    </div>
  )
}
