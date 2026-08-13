import AppLayout from '../components/AppLayout.jsx'

const pillars = [
  {
    title: 'Fostering Collaboration & Knowledge Sharing',
    description:
      'Connect with experienced clinicians, seek guidance, and offer mentorship to aspiring professionals within a supportive, focused community.',
  },
  {
    title: 'Providing Transparency & Professionalism',
    description:
      'We verify the credentials and licensure of every member, ensuring a high level of professionalism and expertise across the community.',
  },
  {
    title: 'Facilitating Targeted Collaboration',
    description:
      'Find the right connections by geographic location, licensure type, or area of expertise — so complex cases reach the right people.',
  },
]

export default function About({ me, onSignedOut }) {
  return (
    <AppLayout me={me} onSignedOut={onSignedOut}>
      <main className="mx-auto flex max-w-3xl flex-col gap-12 px-4 py-10">
        <section>
          <h1 className="font-display text-3xl font-semibold text-stone-900">
            A secure platform for mental health providers
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-600">
            Cultivated Consultation prioritizes member verification, ensuring a secure and
            trustworthy environment for professional collaboration — where you can elevate your
            practice by connecting with diverse professionals, build relationships with peers and
            potential supervisors, and discover opportunities for continuing education, research,
            and employment.
          </p>
        </section>

        <section className="cc-card p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-stone-900">Meet our founder</h2>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row">
            {/* TODO: swap for the real photo once it's saved to
                frontend/src/assets/images/founder-kacey-jenkins.webp — then replace
                this placeholder with:
                  import founderPhoto from '../assets/images/founder-kacey-jenkins.webp'
                  <img src={founderPhoto} alt="Dr. Kacey L. Jenkins" className="h-28 w-28 shrink-0 rounded-full object-cover" /> */}
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-brand-100 font-display text-3xl font-semibold text-brand-700">
              KJ
            </div>
            <div>
              <p className="font-medium text-stone-900">Dr. Kacey L. Jenkins</p>
              <p className="text-sm text-stone-500">Founder, Licensed Marriage and Family Therapist</p>
              <p className="mt-3 text-sm leading-relaxed text-stone-700">
                Dr. Jenkins founded Cultivated Consultation to address the growing need for
                ethically compliant and supportive environments for mental health and behavioral
                health professionals — recognizing the challenges faced by licensed and
                pre-licensed therapists, as well as mental health students. She created this
                platform to foster connection, collaboration, and professional growth, and as a
                safe, compliant space for clinicians to discuss clinical concerns while
                maintaining privacy standards.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-stone-700">
                Dr. Jenkins holds a master's degree in clinical psychology and a Ph.D. in clinical
                counseling. She is certified in perinatal mental health, embodied trauma-conscious
                reproductive health, and breath coaching, and is trained in fertility counseling,
                innate postpartum care, and EMDR. Her clinical focus is couples therapy and
                perinatal mental health. She currently directs the Coparenting Initiative at the
                University of South Florida's Family Study Center, instructs graduate counseling
                courses, and provides teletherapy in Kentucky and Florida.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-stone-900">The vision</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="cc-card p-5">
                <p className="font-medium text-stone-900">{pillar.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{pillar.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cc-card p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-stone-900">The mission</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-700">
            Cultivated Consultation is dedicated to fostering a supportive and ethical community
            for mental health professionals. We provide a platform for peer consultation,
            supervision, and collaboration — empowering members to enhance their clinical skills,
            maintain high ethical standards, and advance their careers.
          </p>
        </section>
      </main>
    </AppLayout>
  )
}
