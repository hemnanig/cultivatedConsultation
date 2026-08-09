import logo from '../assets/images/CC-1024-x-1024-px.png'

export default function Pending({ me }) {
  const isDenied = me.membershipStatus === 'DENIED'

  return (
    <div className="page-centered">
      <div className="card card-centered">
        <img className="logo logo-large" src={logo} alt="Cultivated Consultation" />
        <h1>{isDenied ? 'Application not approved' : "You're on the list"}</h1>
        <p className="muted">
          {isDenied
            ? 'Your application was not approved. If you think this is a mistake, reach out to an administrator.'
            : `Hi ${me.name || me.email}, your account is awaiting verification. An administrator needs to approve your account before you can see or post in the community.`}
        </p>
      </div>
    </div>
  )
}
