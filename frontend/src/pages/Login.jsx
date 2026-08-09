import { googleLoginUrl } from '../api.js'
import logo from '../assets/images/CC-1024-x-1024-px.png'

export default function Login() {
  return (
    <div className="page-centered">
      <div className="card card-centered">
        <img className="logo logo-large" src={logo} alt="Cultivated Consultation" />
        <h1>Cultivated Consultation</h1>
        <p className="muted">A verification-gated professional community. Sign in to continue.</p>
        <a className="button" href={googleLoginUrl()}>Continue with Google</a>
      </div>
    </div>
  )
}
