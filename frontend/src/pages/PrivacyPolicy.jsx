import StaticPageLayout, { LegalHeading, LegalP, LegalList } from '../components/StaticPageLayout.jsx'

export default function PrivacyPolicy({ me, onSignedOut }) {
  return (
    <StaticPageLayout
      me={me}
      onSignedOut={onSignedOut}
      eyebrow="Legal"
      title="Privacy Policy"
      subtitle="This website is owned and operated by Cultivation Works, Incorporated (“Cultivation Works”)."
    >
      <LegalP>
        Cultivation Works understands the importance of privacy to you and is committed to safeguarding your personal
        information while also balancing its legal, policy, and administrative duty in the management of Cultivation
        Works data. This Privacy Notice applies only to the information Cultivation Works collects when you visit
        Cultivated Consultation (the “Site”). It does not apply to other websites linked from the Site by Cultivation
        Works or other end users, and it applies to our information and use practices both online, when you visit our
        Site, and offline, when you provide information to us.
      </LegalP>
      <LegalP>Capitalized terms not defined in this Privacy Notice have the meaning set forth in our Terms of Service.</LegalP>

      <LegalHeading>Acceptance of terms</LegalHeading>
      <LegalP>
        By visiting the Site, you are agreeing to the terms of this Privacy Notice and the accompanying Terms of
        Service, both of which govern your use of the Site. By providing us information offline, you are also agreeing
        to the terms of this Privacy Notice. If you do not agree with any part of this Privacy Notice, please do not
        use the Site. This Privacy Notice outlines what type of information we collect, how we collect it, how the
        information is used, and why we collect it.
      </LegalP>

      <LegalHeading>The information we collect</LegalHeading>
      <LegalP>
        <strong>1. Personal Information.</strong> When you sign up for the Site, you may be required to provide
        personal information such as your name, address, email address, and phone number. We collect this only when
        you provide it voluntarily — registering for the Site, sending an email, requesting information, requesting
        marketing, requesting customer support, signing up for notifications, or providing feedback. We may also
        receive personal data about you from third parties from whom we purchase or collect publicly available
        information, including identifiers, professional or employment-related information, education information,
        internet activity information, and inferences about preferences and behaviors.
      </LegalP>
      <LegalP>
        <strong>2. Order Information.</strong> Provided when you place an order through the Site — information about
        the products and/or services you are seeking to purchase.
      </LegalP>
      <LegalP>
        <strong>3. Billing Information.</strong> When you purchase a product or service, we require additional
        information such as a debit or credit card number, expiration date, billing address, and activation codes. Our
        third-party payment vendors also collect and process this information under their own terms and privacy
        policies.
      </LegalP>
      <LegalP>
        <strong>4. Other Information</strong> may include information you voluntarily provide (e.g., via a survey);
        information automatically collected from your activity, such as IP address, browser type and language, date
        and time of access, pages requested, operating system, device type, and similar data; information from
        cookies (session and persistent) that personalize your experience — disabling cookies may limit the Site's
        functionality; User Generated Content you choose to post, which may become public and accessible to authorized
        Cultivation Works personnel; third-party analytics such as Google Analytics, used to evaluate Site usage and
        performance (see{' '}
        <a
          href="https://www.google.com/analytics"
          target="_blank"
          rel="noreferrer"
          className="text-brand-700 hover:underline"
        >
          google.com/analytics
        </a>{' '}
        for opt-out information); information from other sources such as third-party social media sites; and
        information collected by third-party advertising companies via cookies or pixel tags to tailor and analyze
        advertising.
      </LegalP>

      <LegalHeading>Accessing and modifying your information</LegalHeading>
      <LegalP>
        If you have registered for the Site, you may access, review, and change your Personal Information, Billing
        Information, and certain other information by following the instructions on the Site. You may manage your
        receipt of marketing communications via the “unsubscribe” link in any marketing email — transactional emails
        related to your account or orders cannot be opted out of. We use commercially reasonable efforts to process
        such requests promptly, though it is not always possible to completely remove or modify information in our
        subscription databases.
      </LegalP>

      <LegalHeading>How we use and share the information</LegalHeading>
      <LegalP>
        We use the Personal, Order, Billing, and Other Information (collectively, the “Information”) to provide our
        services, process orders, administer rewards and promotional programs, maintain and improve the Site, solicit
        your feedback, and inform you about our products and services. We may provide Information to Cultivation Works
        employees, consultants, or affiliates for any purpose permitted under this Privacy Notice, or to third-party
        businesses processing information on our behalf to maintain the Site. We may also:
      </LegalP>
      <LegalList
        items={[
          'Access, use, and share Information as required to process your orders and provide support.',
          'Share Information (excluding Billing Information) with third-party promotional and marketing partners.',
          'With your permission, allow third-party applications or services to access your Personal Information via standard OAuth.',
          'Employ other companies and individuals to perform functions on our behalf, such as technical assistance, system administration and hosting, order fulfillment, customer service, and marketing assistance.',
          'Employ professional advisers acting as service providers, processors, or joint controllers — including lawyers, bankers, auditors, and insurers.',
          'Analyze Order and Other Information in aggregate, non-identifying form to operate, maintain, and improve the Site, and share this aggregate data with affiliates, agents, and business partners.',
          'Share Information with parent companies, subsidiaries, joint ventures, or other companies under common control with us.',
          'Transfer Information as part of a corporate sale, merger, reorganization, sale of assets, or dissolution.',
        ]}
      />
      <LegalP>
        To the extent permitted by law, we may also disclose Information when required by law, court order, or
        another government or regulatory authority, or whenever we believe disclosure is necessary to protect the
        rights, property, or safety of Cultivation Works, Inc.
      </LegalP>

      <LegalHeading>Information you share</LegalHeading>
      <LegalP>
        When you voluntarily make your Personal Information available to third parties — on message boards, through
        email, during webinars or calls, or in comment or chat areas — that information can be seen, collected, and
        used by others besides us. We are not responsible for any unauthorized third-party use of such information.
      </LegalP>

      <LegalHeading>How we protect the information</LegalHeading>
      <LegalP>
        We take reasonable steps to protect Information from loss, misuse, unauthorized access, disclosure,
        alteration, or destruction. No security system is impenetrable, however — we cannot guarantee the security of
        our databases or that Information will not be intercepted while being transmitted over the internet. Email
        sent to or from the Site may not be secure, so please take care in deciding what you send via email.
      </LegalP>

      <LegalHeading>Non-U.S. residents</LegalHeading>
      <LegalP>
        The Site and its servers are operated in the United States. If you are located outside the United States, any
        Information you provide will be transferred to the United States. By using the Site, you irrevocably consent
        to this transfer and our use of your Information in accordance with this Privacy Notice.
      </LegalP>

      <LegalHeading>Children</LegalHeading>
      <LegalP>
        Cultivation Works does not knowingly collect Personal Information from children under the age of 18 through
        the Site. If you are under 18, please do not give us any Personal Information — this Site is not intended for
        children. We encourage parents and legal guardians to monitor their children's internet usage. If you believe
        a child under 18 has provided Personal Information to us, please contact us and we will endeavor to delete it.
      </LegalP>

      <LegalHeading>California residents</LegalHeading>
      <LegalP>
        The California Consumer Privacy Act (CCPA) is not applicable to personal information exchanged in all
        transactions. If you are a California resident, you may have certain rights under the CCPA — including the
        right to know what Personal Information we have collected, used, disclosed, or sold about you, and the right
        to request we delete Personal Information we have collected about you. To submit a request, or to designate an
        authorized agent to do so on your behalf, email{' '}
        <a href="mailto:admin@cultivatedconsultation.com" className="text-brand-700 hover:underline">
          admin@cultivatedconsultation.com
        </a>
        . We may verify your identity by asking you to log in to your account, or by requesting identifying details if
        you do not have an account. <strong>We do not sell your Personal Information.</strong> Exercising these rights
        will have no adverse effect on the price or quality of our goods or services.
      </LegalP>

      <LegalHeading>External websites</LegalHeading>
      <LegalP>
        The Site may contain links to third-party websites, each with its own independent privacy practices. We have
        no control over — and are not responsible for — the privacy practices or content of those third-party sites.
        Please review the applicable privacy notice and terms of use before providing information on any linked site.
      </LegalP>

      <LegalHeading>Changes to this notice</LegalHeading>
      <LegalP>
        We may change this Privacy Notice from time to time. By accessing the Site and/or using our services after we
        make such changes, you are deemed to have accepted them. Our use of Information is governed by the Privacy
        Notice in effect at the time we collect it — please check back regularly.
      </LegalP>

      <LegalHeading>How to contact us</LegalHeading>
      <LegalP>
        Questions about this Privacy Notice can be sent to{' '}
        <a href="mailto:admin@cultivatedconsultation.com" className="text-brand-700 hover:underline">
          admin@cultivatedconsultation.com
        </a>{' '}
        with “Privacy Notice” in the subject line.
      </LegalP>
    </StaticPageLayout>
  )
}
