import PolicyLayout from "../components/PolicyLayout";

export const metadata = {
  title: "Refunds & Cancellations | Stryvexi",
  description: "Understand Stryvexi's cancellation, refund, duplicate payment, and failed transaction process.",
};

export default function RefundPolicyPage() {
  return (
    <PolicyLayout eyebrow="PAYMENTS, CREDITS & CUSTOMER CARE" title="Fair and clear." accent="Our refund policy.">
      <p className="policy-lead">
        This policy explains how cancellations, refunds, failed payments, and payment
        disputes are handled for digital products and services purchased through Stryvexi.
        Please review it before completing a purchase.
      </p>

      <h2>1. Digital products and services</h2>
      <p>
        Stryvexi sells digital access and usage credits for online career-preparation
        tools, including resume analysis, resume-to-role insights, mock interviews,
        and skill challenges. Digital services may begin processing or become available
        shortly after successful payment.
      </p>

      <h2>2. Cancellation by the customer</h2>
      <p>
        You may contact us to request cancellation if an order has not yet been
        processed or the purchased digital service has not been used. Once credits
        have been added to your account or a digital service has been used, cancellation
        may not be possible, except where required by applicable law or where we
        determine that a refund is appropriate.
      </p>

      <h2>3. Refund eligibility</h2>
      <p>Refund requests may be considered in the following situations:</p>
      <ul>
        <li><strong>Duplicate payment:</strong> You were charged more than once for the same order.</li>
        <li><strong>Payment successful but credits not received:</strong> The payment is confirmed but the purchased credits were not added to your account.</li>
        <li><strong>Technical failure:</strong> A verified technical issue prevented delivery of the purchased digital service.</li>
        <li><strong>Incorrect charge:</strong> You were charged an amount different from the amount confirmed at checkout.</li>
        <li><strong>Other legally required cases:</strong> A refund is required under applicable law.</li>
      </ul>

      <h2>4. When refunds may not be available</h2>
      <ul>
        <li>Credits or digital services have been fully or partially used, except where a refund is required by law or the service was not delivered as promised.</li>
        <li>You purchased the wrong pack or changed your mind after the digital credits were successfully delivered and made available.</li>
        <li>Credits expired after the validity period displayed at purchase.</li>
        <li>Your account was restricted due to a breach of the Terms & Conditions, except where applicable law requires otherwise.</li>
        <li>You are dissatisfied with an AI-generated score or recommendation where the service was delivered and operated as described. AI outputs are suggestions and are not guaranteed outcomes.</li>
      </ul>

      <div className="policy-callout">
        <p>
          <strong>Important:</strong> Nothing in this policy is intended to remove or
          restrict any consumer right or remedy available to you under applicable Indian law.
        </p>
      </div>

      <h2>5. Failed, pending, or reversed payments</h2>
      <p>
        If money is debited but the order is shown as failed or pending, please allow
        time for the payment provider and banks to update the transaction status.
        If the payment is ultimately unsuccessful, any amount captured by the payment
        provider should be reversed or refunded through the original payment method,
        subject to the provider and bank processing timelines.
      </p>
      <p>
        Please do not make repeated payments for the same order while its status is
        pending. Contact us with your order ID if the status does not update.
      </p>

      <h2>6. How to request a refund</h2>
      <p>Email <a href="mailto:contact@stryvexi.com?subject=Refund%20Request">contact@stryvexi.com</a> with the following details:</p>
      <ul>
        <li>Your registered Stryvexi email address.</li>
        <li>Cashfree order ID and payment reference, if available.</li>
        <li>Transaction date and amount in INR.</li>
        <li>Reason for the refund request.</li>
        <li>Relevant screenshot or supporting information, with sensitive payment details hidden.</li>
      </ul>

      <h2>7. Review and processing</h2>
      <p>
        We will review your request and may contact you for additional information.
        If approved, the refund will generally be initiated to the original payment
        method used for the transaction. The time taken for the amount to appear in
        your account depends on the payment provider, bank, and payment method.
      </p>
      <p>
        We aim to acknowledge support requests within 2 business days and communicate
        the outcome after reviewing the transaction. These are support targets, not
        a guarantee of bank settlement time.
      </p>

      <h2>8. Cancellation by Stryvexi</h2>
      <p>
        If Stryvexi is unable to provide a purchased service, we may restore the
        affected credits or issue an appropriate refund, depending on the circumstances
        and applicable law. We will communicate the available resolution to the
        registered email address where reasonably possible.
      </p>

      <h2>9. Contact</h2>
      <div className="policy-contact-card">
        <div>
          <span>REFUNDS & PAYMENT SUPPORT</span>
          <strong>contact@stryvexi.com</strong>
        </div>
        <a href="mailto:contact@stryvexi.com?subject=Refund%20or%20Cancellation%20Request">Contact support ↗</a>
      </div>
      <p className="policy-small-note">
        Please never email your password, OTP, UPI PIN, CVV, or full card details.
        Stryvexi will not ask you to disclose these credentials to process a refund.
      </p>
    </PolicyLayout>
  );
}
