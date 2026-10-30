import PolicyLayout from "../components/PolicyLayout";

export const metadata = {
  title: "Terms & Conditions | Stryvexi",
  description: "Read the terms governing access to and use of Stryvexi digital career preparation services.",
};

export default function TermsPage() {
  return (
    <PolicyLayout eyebrow="PLEASE READ BEFORE YOU BEGIN" title="Clear terms." accent="A better way forward.">
      <p className="policy-lead">
        These Terms & Conditions govern your access to and use of the Stryvexi website,
        account, and digital services. By creating an account, purchasing a service,
        or using the platform, you agree to these terms.
      </p>

      <h2>1. About Stryvexi</h2>
      <p>
        Stryvexi is an online career-preparation platform that provides digital tools
        such as resume analysis, resume-to-role insights, interview practice, skill
        challenges, and career progress tools. Features may change, improve, or be
        discontinued as the platform develops.
      </p>

      <h2>2. Eligibility and your account</h2>
      <ul>
        <li>You must provide accurate and up-to-date information when creating an account.</li>
        <li>You are responsible for keeping your login credentials confidential and for activity under your account.</li>
        <li>Do not share, sell, transfer, or provide access to your account or purchased credits to another person.</li>
        <li>Notify us promptly if you suspect unauthorised access to your account.</li>
        <li>You must be legally capable of entering into a binding agreement to use paid services.</li>
      </ul>

      <h2>3. Products and services</h2>
      <p>
        Stryvexi offers digital services for career preparation. The available services
        and indicative purchase prices are listed below. The price shown at checkout
        for a selected pack is the amount applicable to that order.
      </p>
      <div className="policy-table-wrap">
        <table className="policy-table">
          <thead><tr><th>PRODUCT / SERVICE</th><th>DESCRIPTION</th><th>PRICE</th></tr></thead>
          <tbody>
            <tr><td>Free Trial</td><td>One resume analysis</td><td>₹0</td></tr>
            <tr><td>Free Trial</td><td>One mock interview (5 questions)</td><td>₹0</td></tr>
            <tr><td>Starter Pack</td><td>100 credits</td><td>₹99</td></tr>
            <tr><td>Growth Pack</td><td>300 credits</td><td>₹249</td></tr>
            <tr><td>Career Pro Pack</td><td>700 credits</td><td>₹499</td></tr>
            <tr><td>Career Max Pack</td><td>1,600 credits</td><td>₹999</td></tr>
          </tbody>
        </table>
      </div>
      <p className="policy-small-note">
        Prices and pack availability may be revised. The price and pack details displayed
        on the checkout page immediately before payment will apply to that purchase.
        Any applicable taxes will be shown as part of the displayed payable amount.
      </p>

      <h2>4. Credits, validity, and usage</h2>
      <ul>
        <li>Credits are platform usage units and are not money, stored value, or a bank balance.</li>
        <li>Credits can only be used for eligible Stryvexi features and cannot be withdrawn, transferred, or exchanged for cash.</li>
        <li>Each purchased credit pack has its own validity period, which is displayed at the time of purchase.</li>
        <li>Where multiple credit lots are available, the lot with the earliest expiry is used first.</li>
        <li>Unused credits expire at the end of their stated validity period, subject to applicable law.</li>
        <li>Free trial usage is separate from purchased credits and is subject to the limits displayed in your account.</li>
      </ul>

      <h2>5. Payments</h2>
      <p>
        Payments for paid services are processed through the payment options made
        available at checkout, including Cashfree Payment Gateway. Prices are displayed
        in Indian Rupees (INR). An order is treated as paid only after payment confirmation
        is received and verified by Stryvexi.
      </p>
      <p>
        Do not share your UPI PIN, card PIN, OTP, or other payment authentication
        credentials with anyone claiming to represent Stryvexi.
      </p>

      <h2>6. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the platform for unlawful, fraudulent, abusive, or misleading purposes.</li>
        <li>Attempt to disrupt, reverse engineer, scrape, or gain unauthorised access to the platform or its systems.</li>
        <li>Upload content that you do not have the right to use or that violates another person’s rights.</li>
        <li>Use automated means to abuse free trials, referral benefits, or platform features.</li>
        <li>Resell, redistribute, or commercially exploit Stryvexi services without written permission.</li>
      </ul>

      <h2>7. Your content and AI-generated outputs</h2>
      <p>
        You retain responsibility for the resumes, job descriptions, answers, and other
        material you submit. You confirm that you have the rights and permissions needed
        to provide that material to the platform.
      </p>
      <p>
        Stryvexi may use automated systems and artificial intelligence to generate
        suggestions, scores, practice questions, and feedback. Outputs may be incomplete
        or inaccurate and should be reviewed by you. You are responsible for deciding
        whether and how to use any recommendation.
      </p>

      <h2>8. No job or interview guarantee</h2>
      <p>
        Stryvexi is a preparation and productivity platform. We do not guarantee
        employment, interview selection, a particular resume score, or any specific
        career outcome. Results depend on many factors outside our control.
      </p>

      <h2>9. Intellectual property</h2>
      <p>
        The Stryvexi name, branding, website design, software, and platform materials
        are owned by or licensed to their respective rights holders. You may use the
        platform for your personal, non-commercial career preparation, but may not copy,
        reproduce, distribute, or create derivative works from platform materials
        without permission, except where permitted by law.
      </p>

      <h2>10. Availability and changes</h2>
      <p>
        We aim to keep Stryvexi available and reliable, but uninterrupted access cannot
        be guaranteed. We may update, suspend, or modify features for maintenance,
        security, legal, or operational reasons.
      </p>

      <h2>11. Suspension or termination</h2>
      <p>
        We may restrict or suspend access where we reasonably believe an account has
        breached these terms, is being misused, or creates a security, legal, or
        operational risk. You may stop using the platform at any time. Any treatment
        of unused paid credits will be subject to the Refunds & Cancellations Policy
        and applicable law.
      </p>

      <h2>12. Limitation of liability</h2>
      <p>
        To the extent permitted by applicable law, Stryvexi will not be liable for
        indirect, incidental, special, or consequential losses arising from use of
        the platform. Nothing in these terms excludes or limits liability that cannot
        lawfully be excluded or limited, including rights available to consumers under
        applicable Indian law.
      </p>

      <h2>13. Privacy</h2>
      <p>
        Your use of Stryvexi is also subject to our privacy practices. Information
        about personal data collection, use, storage, and rights should be provided
        in the Stryvexi Privacy Policy. If a separate Privacy Policy is not yet
        published, please contact <a href="mailto:contact@stryvexi.com">contact@stryvexi.com</a>
        for privacy-related questions.
      </p>

      <h2>14. Governing law and contact</h2>
      <p>
        These terms are intended to be governed by the laws of India, subject to
        applicable consumer protection laws and the jurisdiction of competent courts.
        For questions about these terms, contact <a href="mailto:contact@stryvexi.com">contact@stryvexi.com</a>.
      </p>

      <h2>15. Updates to these terms</h2>
      <p>
        We may revise these terms from time to time. The updated version will be
        published on this page with a revised date. Continued use of the platform
        after an update means you acknowledge the revised terms, to the extent
        permitted by law.
      </p>
    </PolicyLayout>
  );
}
