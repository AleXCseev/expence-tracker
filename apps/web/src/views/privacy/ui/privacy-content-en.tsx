import Link from 'next/link';

export function PrivacyContentEn() {
  return (
    <>
      <p>
        This Policy sets out how personal data of users of the “Expense Tracker” web service (the
        “Service”) is collected, used, stored and protected, in accordance with the Law of Ukraine
        “On Personal Data Protection” of 01.06.2010 No. 2297-VI (the “Law”), the Law of Ukraine “On
        Information”, and the Model Procedure for Personal Data Processing approved by Order of the
        Ukrainian Parliament Commissioner for Human Rights of 08.01.2014 No. 1/02-14.
      </p>

      <h2>1. Personal data controller</h2>
      <p>
        [Full name or legal entity name, tax ID / company registration number, address, contact
        e-mail — to be filled in before publication] (the “Controller”).
      </p>

      <h2>2. What data we process</h2>
      <ul>
        <li>the name you provided during registration;</li>
        <li>your e-mail address;</li>
        <li>your password — stored only as an irreversible hash, never in plain text;</li>
        <li>
          data you enter into the Service: expenses (amounts, dates, descriptions) and categories;
        </li>
        <li>technical data required to operate the Service: the authorization token (JWT).</li>
      </ul>
      <p>
        We do not collect special categories of data (Article 7 of the Law) or payment card data,
        and we do not access your bank accounts.
      </p>

      <h2>3. Purpose and legal grounds</h2>
      <ul>
        <li>
          registering and authenticating the User and providing the Service’s functionality —
          performance of the Terms of Service;
        </li>
        <li>
          contacting the User about account operation and security — your consent and performance of
          the Terms;
        </li>
        <li>
          ensuring the security of the Service and preventing abuse — the Controller’s legitimate
          interest.
        </li>
      </ul>
      <p>
        The legal ground for processing is your consent as a data subject (Article 11 of the Law),
        given by ticking the checkbox during registration. The data is not used for advertising
        profiling.
      </p>

      <h2>4. Storage, retention and protection</h2>
      <ul>
        <li>
          Data is stored while the account is active. After the account is deleted, personal data is
          deleted or anonymized within a reasonable time unless retention is required by law.
        </li>
        <li>
          The authorization token and session data are stored in your browser’s local storage
          (localStorage) until you sign out or the token expires.
        </li>
        <li>
          Organizational and technical safeguards are applied, including password hashing and
          transmission over a secure channel (HTTPS), in accordance with Article 24 of the Law.
        </li>
      </ul>
      <p>
        Data is stored on servers located in [country / hosting provider — to be filled in]. If the
        servers are located outside Ukraine, data is transferred in compliance with Article 29 of
        the Law (to countries ensuring adequate protection, including EEA members and parties to
        Council of Europe Convention No. 108).
      </p>

      <h2>5. Disclosure to third parties</h2>
      <p>
        We do not sell or disclose your data to third parties, except: (a) hosting and
        infrastructure providers that process data on our behalf; (b) cases provided for by law, in
        particular at the request of authorized state bodies in accordance with the established
        procedure.
      </p>

      <h2>6. Your rights</h2>
      <p>Under Article 8 of the Law, you have the right to:</p>
      <ul>
        <li>
          know the sources of collection, the location and the purpose of processing of your data;
        </li>
        <li>
          receive information on the conditions of access to your data and on the third parties to
          whom it is transferred;
        </li>
        <li>access your data and obtain a copy of it;</li>
        <li>
          submit a reasoned demand to change or destroy data if it is processed unlawfully or is
          inaccurate;
        </li>
        <li>withdraw your consent to processing at any time;</li>
        <li>
          file complaints with the Ukrainian Parliament Commissioner for Human Rights (
          <span className="whitespace-nowrap">www.ombudsman.gov.ua</span>) or with a court;
        </li>
        <li>use legal remedies if personal data protection legislation is violated.</li>
      </ul>
      <p>
        To exercise your rights, send a request to the Controller’s e-mail. We will respond within
        30 calendar days (Article 20 of the Law; an access request — within 10 business days, where
        applicable). Withdrawing consent does not affect the lawfulness of processing before the
        withdrawal; afterwards use of the Service will no longer be possible and the account will be
        deleted.
      </p>

      <h2>7. Cookies and local storage</h2>
      <p>
        The Service uses only technically necessary browser local storage to keep your session and
        selected language and does not use analytics or advertising cookies.
      </p>

      <h2>8. Children</h2>
      <p>
        The Service is not intended for persons under 18. If we learn that data of such a person is
        being processed without the consent of their legal representatives, the data will be
        deleted.
      </p>

      <h2>9. Changes to this Policy</h2>
      <p>
        The new version of the Policy is published on this page with its date. We will notify you of
        material changes through the Service or by e-mail. Related document —{' '}
        <Link href="/terms" className="underline underline-offset-4">
          Terms of Service
        </Link>
        .
      </p>
    </>
  );
}
