import logo from '../assets/images/CC-1024-x-1024-px.png'
import { StatusBadge } from '../components/ui.jsx'

const steps = ['Application submitted', 'Under review by an admin', 'Community access']

export default function Pending({ me }) {
  const isDenied = me.membershipStatus === 'DENIED'
  const activeStep = isDenied ? 1 : 1 // review is the active stage either way until a decision is made

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6 py-12">
      <div className="cc-card w-full max-w-md p-8 text-center">
        <img className="mx-auto mb-4 h-14 w-14" src={logo} alt="Cultivated Consultation" />
        <div className="mb-3 flex justify-center">
          <StatusBadge status={me.membershipStatus} />
        </div>
        <h1 className="font-display text-2xl font-semibold text-stone-900">
          {isDenied ? 'Application not approved' : "You're on the list"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          {isDenied
            ? 'Your application was not approved. If you think this is a mistake, reach out to an administrator.'
            : `Hi ${me.name || me.email}, your account is awaiting verification. An administrator needs to approve your account before you can see or post in the community.`}
        </p>

        {!isDenied && (
          <ol className="mt-8 flex flex-col gap-3 text-left">
            {steps.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <span
                  className={
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ' +
                    (i < activeStep
                      ? 'bg-status-approved-bg text-status-approved'
                      : i === activeStep
                        ? 'bg-status-pending-bg text-status-pending'
                        : 'bg-stone-100 text-stone-400')
                  }
                >
                  {i < activeStep ? '✓' : i + 1}
                </span>
                <span className={i === activeStep ? 'font-medium text-stone-900' : 'text-stone-500'}>{step}</span>
              </li>
            ))}
          </ol>
        )}

        <p className="mt-8 border-t border-stone-100 pt-4 text-xs text-stone-400">
          Questions about your application? Contact your community administrator.
        </p>
      </div>
    </div>
  )
}
