import StaticPageLayout, { LegalHeading, LegalP, LegalList } from '../components/StaticPageLayout.jsx'

export default function TermsOfService({ me, onSignedOut }) {
  return (
    <StaticPageLayout
      me={me}
      onSignedOut={onSignedOut}
      eyebrow="Legal"
      title="Terms of Service"
      subtitle="Please read these Terms of Service carefully before using Cultivated Consultation (the “Site”) and any free or paid products or services offered via the Site (the “Service”), operated by Cultivation Works, Incorporated (“us,” “we,” or “our”)."
    >
      <LegalP>
        Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
        These Terms apply to all visitors, users, and others who access or use the Service. By accessing or using the
        Service, you agree to be bound by these Terms — if you disagree with any part of the Terms, you may not access
        the Service. By browsing the public areas or accessing and using the Site, you acknowledge that you have read,
        understood, and agree to be legally bound by these Terms of Service and our Privacy Notice, which is
        incorporated by reference (together, this “Agreement”).
      </LegalP>
      <LegalP>
        Any Registered User who wishes to purchase a product or service through the Site is also agreeing to the
        accompanying Terms and Conditions of Purchase for that product or service; in the event of any conflict, the
        Terms and Conditions of Purchase control.
      </LegalP>
      <LegalP>
        <strong>
          The sections below titled “Binding Arbitration” and “Class Action Waiver” contain a binding arbitration
          agreement and class action waiver. They affect your legal rights — please read them.
        </strong>{' '}
        Capitalized terms not defined in these Terms have the meaning set forth in our Privacy Notice.
      </LegalP>

      <LegalHeading>1. Overview</LegalHeading>
      <LegalP>
        Your use of this Site is expressly conditioned upon accepting and agreeing to this Agreement. If you are
        entering this Agreement on behalf of an organization, you confirm you have the authority to bind that
        organization, and “you”/“your” refers to you and the organization. Registered Users' use of the Site is
        further conditioned on clicking “I agree to the Terms of Service” at the end of these Terms.
      </LegalP>

      <LegalHeading>2. Changes to terms</LegalHeading>
      <LegalP>
        We may, at any time and without notice, change the Site's look, feel, format, and content, as well as the
        products and/or services described on it. Modifications are effective upon posting. Continued use of the Site
        after changes are posted constitutes acceptance of those changes.
      </LegalP>

      <LegalHeading>3. Description and use of our Site</LegalHeading>
      <LegalP>
        <strong>Visitors</strong> are people who do not register with us. No login is required — Visitors can view all
        publicly available content and email us. <strong>Registered Users</strong> can do everything a Visitor can, and
        additionally: purchase products and services; access exclusive content; create, access, manage, and update a
        personal account; post comments and other content (“Registered User Content”); sign up for programs, alerts,
        and notifications; and become part of the community. We are under no obligation to accept any individual as a
        Registered User, may accept or reject any registration in our sole discretion, and may deactivate any account
        at any time without notice, including for a violation of these Terms.
      </LegalP>

      <LegalHeading>4. Community Guidelines</LegalHeading>
      <LegalP>By accessing and/or using the Site, you agree to comply with these Community Guidelines:</LegalP>
      <LegalList
        items={[
          'You will comply with all applicable laws and will not use the Site for any unlawful purpose.',
          'You will not upload or transmit content that infringes any copyright, trademark, or other proprietary right; that is defamatory, obscene, pornographic, invasive of privacy, promotes violence, or contains hate speech; or that discloses sensitive information about another person.',
          'You will not stalk, threaten, or otherwise harass another person.',
          'You will not spam or use the Site to engage in commercial activities, or use it to collect market research for a competing business.',
          'You will not impersonate any person or entity or misrepresent your affiliation with one.',
          'You will not interfere with the proper operation of the Site through viruses, hacking, password or data mining, or unauthorized access attempts.',
          'You will not cover, obscure, or interfere with advertisements or safety features (e.g., the report-abuse button).',
          'You will not use a robot, spider, scraper, or other automated means to access the Site without our express written permission (public search engines are permitted to index public content).',
          'You will not impose an unreasonable or disproportionately large load on our technical infrastructure.',
          'You will let us know about inappropriate content you become aware of.',
        ]}
      />
      <LegalP>
        We reserve the right, in our sole discretion, to deny access to the Site or remove any content that does not
        adhere to these Community Guidelines.
      </LegalP>

      <LegalHeading>5. Sign-in name, password, and unique identifiers</LegalHeading>
      <LegalP>
        During registration, you will create a Sign-In Name, a Password, and possibly additional Unique Identifiers.
        You must provide true, accurate, current, and complete information. Each Sign-In Name and Password may be used
        by only one Registered User — sharing your credentials with others is a material breach of this Agreement. You
        are solely responsible for the confidentiality and use of your credentials and must promptly inform us of any
        need to deactivate or change them. We may delete or change your credentials at any time and are not liable for
        any resulting loss or damage.
      </LegalP>

      <LegalHeading>6. Fees and payment</LegalHeading>
      <LegalP>
        As consideration for any purchase, you agree to pay all applicable fees and taxes. We (or our third-party
        payment processor) will authorize your payment method for the full amount due. You must provide current,
        complete, and accurate billing information and keep it up to date, and promptly notify us if your card is
        lost, stolen, or your account security may have been compromised. If payment is not received, you agree to pay
        all amounts due upon demand, plus reasonable collection costs including attorney's fees.
      </LegalP>

      <LegalHeading>7. Intellectual property</LegalHeading>
      <LegalP>
        The Site contains material — photographs, software, text, graphics, trademarks, logos, images, sound
        recordings, and more — provided by or on behalf of Cultivation Works, Inc. (the “Content”), protected under
        U.S. and foreign law. Visitors may view publicly available Content for personal, non-commercial use only;
        Registered Users who purchase a product or service may similarly download and view purchased Content for
        personal, non-commercial use. You retain no other rights in the Content (other than your own Registered User
        Content), may not sell, transfer, sublicense, modify, reproduce, or otherwise use the Content for any public or
        commercial purpose, and may not post Content on any other website or networked environment. Violating this
        Agreement automatically terminates your permission to access the Content, and you must destroy any copies you
        have made.
      </LegalP>
      <LegalP>
        The Cultivated Consultation and Cultivation Works trademarks, service marks, and logos are registered and
        unregistered marks of Cultivation Works, Inc. Nothing on the Site grants any license or right to use these
        marks without our prior written permission.
      </LegalP>

      <LegalHeading>8. Registered User Content; licenses</LegalHeading>
      <LegalP>
        The Site lets Registered Users post and upload content. Once submitted, your Registered User Content is
        accessible to other authorized users of the platform, subject to our encryption and security measures — there
        is no confidentiality or privacy guarantee with respect to Registered User Content, including any personally
        identifying information you choose to include, and you are solely responsible for what you post. You retain
        copyright and other intellectual property rights in your own Registered User Content, but grant us and our
        sublicensees a non-exclusive, royalty-free, freely sublicensable, perpetual license to use, modify, distribute,
        and display it (and your Sign-In Name, name, likeness, and photograph in connection with it) in connection with
        operating and promoting the Site.
      </LegalP>
      <LegalP>
        By submitting Registered User Content, you represent and warrant that it is your original creation (or that
        you have the rights to provide it), that you have the rights necessary to grant the license above, and that it
        does not infringe any third party's rights or violate our Community Guidelines. Users who access Registered
        User Content agree to treat it as confidential and use it only for the purpose access was granted, and not to
        disclose or redistribute it except as permitted or required by law. No system is entirely secure — you accept
        the associated risks of using the platform and agree that Cultivation Works, Inc. is not liable for
        unauthorized access, misuse, or disclosure by other users or third parties, and you will defend, indemnify, and
        hold Cultivation Works harmless from claims arising from your misuse or disclosure of content you upload.
        Violating these confidentiality obligations may result in suspension or termination of access, and we reserve
        the right to take appropriate legal action in cases of misuse or breach.
      </LegalP>

      <LegalHeading>9. Communications with us</LegalHeading>
      <LegalP>
        Please do not email us any confidential information, including information covered under HIPAA or FERPA. With
        respect to feedback, questions, comments, and suggestions you send us, we are free to use any ideas, concepts,
        know-how, or techniques they contain for any purpose — including developing, producing, and marketing products
        and services — without compensation or attribution to you.
      </LegalP>

      <LegalHeading>10. No warranties; limitation of liability</LegalHeading>
      <LegalP>
        The Site and Content are provided “as is” and “as available,” without warranties of any kind, including that
        the Site will operate error-free or be free of viruses or other destructive features. We disclaim all
        warranties of title, merchantability, non-infringement, and fitness for a particular purpose. We and our
        licensors are not liable for incidental or consequential damages, lost profits, or damages from lost data or
        business interruption resulting from use of or inability to use the Site, even if advised of the possibility
        of such damages; direct damages you may suffer are limited to fees you paid us in the three months immediately
        preceding the claim. Some jurisdictions do not allow these exclusions, so some limitations may not apply to
        you. The Site may contain technical inaccuracies or typographical errors, and we reserve the right to make
        changes, corrections, and improvements at any time without notice.
      </LegalP>

      <LegalHeading>11. External sites</LegalHeading>
      <LegalP>
        The Site may link to third-party websites (“External Sites”) as a convenience, not an endorsement. External
        Sites are developed and provided by others, and we are not responsible for their content or accuracy. Access
        linked External Sites at your own risk, and take precautions to protect your computer when downloading files
        from any website.
      </LegalP>

      <LegalHeading>12. Representations, warranties, and indemnification</LegalHeading>
      <LegalP>
        If you are a Registered User, you represent and warrant that you own or have the necessary rights to your
        Registered User Content, that your use of it as contemplated in this Agreement will not violate any third
        party's rights, and that you will not submit content that violates our Community Guidelines. You agree to
        defend, indemnify, and hold us and our officers, directors, employees, agents, successors, and assigns
        harmless from damages, liabilities, losses, and expenses (including reasonable legal fees) arising from your
        breach of this Agreement, misuse of the Content or Site, or violation of any third party's rights.
      </LegalP>

      <LegalHeading>13. Compliance with applicable laws</LegalHeading>
      <LegalP>
        The Site is based in the United States, and we make no claims about whether the Content is appropriate for use
        outside the U.S. If you access the Site from outside the U.S., you do so at your own risk and are solely
        responsible for compliance with the laws of your jurisdiction.
      </LegalP>

      <LegalHeading>14. Termination</LegalHeading>
      <LegalP>
        We reserve the right, in our sole discretion, to restrict, suspend, or terminate this Agreement and your
        access to the Site at any time and for any reason, without prior notice or liability, and to change, suspend,
        or discontinue any part of the Site at any time. Sections governing fees, intellectual property, Registered
        User Content licenses, communications, warranties/liability, indemnification, controlling law, arbitration,
        class action waiver, equitable relief, and this miscellaneous section survive termination.
      </LegalP>

      <LegalHeading>15. Digital Millennium Copyright Act</LegalHeading>
      <LegalP>
        We respect the intellectual property rights of others and provide a process for submitting complaints about
        content posted by users, consistent with the DMCA (17 U.S.C. § 512). A valid notice of claimed infringement
        must include a signature of the person authorized to act on the copyright owner's behalf, a description of the
        copyrighted work and the location of the allegedly infringing material on the Site, your contact information,
        and a statement — made under penalty of perjury — that the notice is accurate and that you are the copyright
        owner or authorized to act on their behalf. If you believe a notice was submitted against you improperly, you
        may submit a counter-notice under Sections 512(g)(2)–(3) of the DMCA containing your signature, identification
        of the removed material, a good-faith statement that removal was a mistake or misidentification, your contact
        information, and consent to the jurisdiction of the applicable federal court. Note that false notices or
        counter-notices may give rise to personal liability — consider seeking legal advice before submitting one.
      </LegalP>

      <LegalHeading>16. Controlling law</LegalHeading>
      <LegalP>This Agreement and any related action are governed by the laws of the State of Florida, without regard to its conflict-of-laws provisions.</LegalP>

      <LegalHeading>17. Binding arbitration</LegalHeading>
      <LegalP>
        In the event of a dispute arising under or relating to this Agreement, the Content, or the Site (a “Dispute”),
        either party may elect to finally and exclusively resolve it by binding arbitration under the Federal
        Arbitration Act. That election is final and binding on the other party — if either party chooses arbitration,
        neither party may litigate the claim in court or have a jury trial, except that either party may bring a claim
        in small claims court where permitted. Arbitration differs from court, and discovery and appeal rights may be
        limited. Disputes are resolved before a neutral arbitrator jointly selected by the parties, whose decision is
        final except for a limited right of appeal under the FAA. Arbitration is commenced and conducted by JAMS under
        its then-current rules, may take place in person, by phone, online, or via document submission, and — if in
        person — takes place in the U.S. county where you reside. Nothing here prevents us from seeking injunctive
        relief in court to protect our proprietary interests.
      </LegalP>

      <LegalHeading>18. Class action waiver</LegalHeading>
      <LegalP>
        Any arbitration or proceeding is limited to the Dispute between us and you individually. To the fullest extent
        permitted by law, no arbitration or proceeding will be joined with any other, there is no right to arbitrate or
        resolve any Dispute on a class basis, and there is no right to bring a Dispute in a representative capacity on
        behalf of the general public or any other persons. You may bring claims against us only in your individual
        capacity, not as a plaintiff or class member in any purported class or representative proceeding.
      </LegalP>

      <LegalHeading>19. Equitable relief</LegalHeading>
      <LegalP>
        You acknowledge that a breach or threatened violation of our intellectual property rights or confidential and
        proprietary information will cause us irreparable harm, entitling us to injunctive relief to enforce this
        Agreement. We may seek interim, equitable, provisional, or injunctive relief from any court of competent
        jurisdiction pending the outcome of arbitration, and you irrevocably consent to the personal and subject-matter
        jurisdiction of the federal and state courts in Florida for that purpose.
      </LegalP>

      <LegalHeading>20. Miscellaneous</LegalHeading>
      <LegalP>
        Our failure to act on or enforce any provision of this Agreement is not a waiver of that or any other
        provision — no waiver is effective unless made in writing. This Agreement constitutes the entire agreement
        between you and us regarding its subject matter and supersedes all prior or contemporaneous agreements, written
        or oral. Section headings are for convenience only and carry no legal weight. This Agreement inures to the
        benefit of our successors, assigns, licensees, and sublicensees.
      </LegalP>
    </StaticPageLayout>
  )
}
