import Link from 'next/link';

export function TermsContentEn() {
  return (
    <>
      <p>
        These Terms of Service (the “Terms”) constitute a public offer under Articles 633, 641 and
        642 of the Civil Code of Ukraine and govern the use of the “Expense Tracker” web service
        (the “Service”). Registering in the Service and ticking the “I agree” box means full and
        unconditional acceptance of these Terms.
      </p>

      <h2>1. Parties and definitions</h2>
      <ul>
        <li>
          <b>Service Owner</b> — [full name or legal entity name, tax ID / company registration
          number, address, contact e-mail — to be filled in before publication].
        </li>
        <li>
          <b>User</b> — a legally capable individual who has registered in the Service.
        </li>
        <li>
          <b>Account</b> — the set of User data required to access the Service.
        </li>
        <li>
          <b>User Content</b> — expenses, categories, amounts, descriptions and other data the User
          enters into the Service.
        </li>
      </ul>

      <h2>2. Subject of the Terms</h2>
      <p>
        The Service Owner grants the User the right to use the Service free of charge for personal
        expense tracking under these Terms. The Service is not a financial, banking, tax or
        accounting service, does not provide financial advice and does not process payments.
      </p>

      <h2>3. Registration and Account</h2>
      <ul>
        <li>To register, the User provides a real name, an e-mail address and a password.</li>
        <li>
          The User must be of full age (18 years) or have the consent of their legal
          representatives.
        </li>
        <li>
          The User keeps the password confidential and is responsible for all actions performed
          under their Account. Any suspected unauthorized access must be reported to the Service
          Owner.
        </li>
        <li>One User — one Account.</li>
      </ul>

      <h2>4. Rights and obligations of the User</h2>
      <p>The User undertakes to:</p>
      <ul>
        <li>use the Service in accordance with the laws of Ukraine and these Terms;</li>
        <li>
          not take actions that disrupt the Service: attempts at unauthorized access, automated mass
          data collection, distribution of malware;
        </li>
        <li>
          not enter third-party data without legal grounds, or unlawful content, into the Service.
        </li>
      </ul>
      <p>
        The User may stop using the Service at any time and request deletion of their Account and
        related personal data.
      </p>

      <h2>5. Rights and obligations of the Service Owner</h2>
      <ul>
        <li>
          The Service Owner makes reasonable efforts to keep the Service running continuously but
          does not guarantee the absence of failures, maintenance downtime or data loss.
        </li>
        <li>
          The Service Owner may restrict or terminate the User’s access if these Terms or the laws
          of Ukraine are violated.
        </li>
        <li>
          The Service Owner may change the Service’s functionality and these Terms. The new version
          takes effect upon publication on this page; continued use of the Service means acceptance
          of the new version.
        </li>
      </ul>

      <h2>6. Intellectual property</h2>
      <p>
        All rights to the software, design and materials of the Service belong to the Service Owner
        and are protected by the Law of Ukraine “On Copyright and Related Rights”. Rights to User
        Content remain with the User; the User grants the Service Owner a limited non-exclusive
        license to store and process that Content solely to operate the Service.
      </p>

      <h2>7. Liability</h2>
      <ul>
        <li>The Service is provided “as is”. The User uses it at their own risk.</li>
        <li>
          To the extent permitted by the laws of Ukraine, the Service Owner is not liable for
          indirect damages, lost profits or decisions made by the User based on data from the
          Service.
        </li>
        <li>
          The parties are released from liability for full or partial non-performance caused by
          force majeure, in particular martial law, armed aggression, power outages and failures of
          electronic communications, as confirmed by a certificate of the Chamber of Commerce and
          Industry of Ukraine.
        </li>
        <li>
          These Terms do not limit the User’s consumer rights under the Law of Ukraine “On Consumer
          Protection”, where applicable.
        </li>
      </ul>

      <h2>8. Personal data</h2>
      <p>
        Personal data is processed in accordance with the{' '}
        <Link href="/privacy" className="underline underline-offset-4">
          Personal Data Processing Policy
        </Link>
        , which forms an integral part of these Terms.
      </p>

      <h2>9. Dispute resolution and governing law</h2>
      <p>
        These Terms are governed by the laws of Ukraine. Disputes are resolved through negotiation
        and, failing agreement, in court at the location (place of residence) of the defendant,
        unless mandatory law provides otherwise. Claims may be sent to the Service Owner’s e-mail
        address; they are reviewed within 30 calendar days.
      </p>

      <h2>10. Final provisions</h2>
      <p>
        If any provision of these Terms is held invalid, the remaining provisions stay in force. The
        Terms remain in effect indefinitely until terminated at the initiative of either party.
      </p>
    </>
  );
}
