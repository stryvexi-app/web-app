import PolicyLayout from "../components/PolicyLayout";

export const metadata = {
  title: "Contact Us | Stryvexi",
  description: "Get in touch with the Stryvexi team for product, account, billing, or support enquiries.",
};

export default function ContactPage() {
  return (
    <PolicyLayout eyebrow="WE’RE HERE TO HELP" title="Let’s talk." accent="We’re listening.">
      <p className="policy-lead">
        Have a question about Stryvexi, your account, a purchase, or one of our career
        preparation tools? Reach out to our support team and we’ll do our best to help.
      </p>

      <h2>Contact information</h2>
      <div className="policy-contact-card">
        <div>
          <span>GENERAL & CUSTOMER SUPPORT</span>
          <strong>contact@stryvexi.com</strong>
        </div>
        <a href="mailto:contact@stryvexi.com?subject=Stryvexi%20Support%20Enquiry">Send an email ↗</a>
      </div>

      <h2>What can we help you with?</h2>
      <ul>
        <li>Account registration, login, and profile-related questions.</li>
        <li>Resume Intelligence, interview practice, and other platform features.</li>
        <li>Credit packs, payments, transaction status, and billing queries.</li>
        <li>Refund, cancellation, or technical support requests.</li>
        <li>Feedback, suggestions, and general enquiries.</li>
      </ul>

      <div className="policy-callout">
        <p>
          <strong>For payment-related enquiries:</strong> Include the email address
          registered with Stryvexi, your Cashfree order ID or payment reference, the
          transaction date, and a short description of the issue. Never send your
          password, OTP, full card number, or UPI PIN.
        </p>
      </div>

      <h2>Business and service availability</h2>
      <p>
        Stryvexi provides digital career-preparation services through its website.
        Our current services are intended for customers in India and payments are
        accepted in Indian Rupees (INR).
      </p>
      <p>
        <strong>Support email:</strong> <a href="mailto:contact@stryvexi.com">contact@stryvexi.com</a>
      </p>
    </PolicyLayout>
  );
}
