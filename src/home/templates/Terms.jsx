import React from 'react';
import '../static/css/Terms.css';

function Terms() {
  return (
    <div className="terms-container">
      <header className="terms-header">
        <h1>Terms of Service</h1>
        <p>Please read our terms of service carefully.</p>
      </header>

      <main className="terms-main">
        <section className="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Doll World, users agree to all terms listed below.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Actors and Account Responsibility</h2>
          <ul>
            <li><strong>Guest:</strong> View about, contact, privacy, and product libraries.</li>
            <li><strong>Customer:</strong> Can register, purchase dolls/AI characters, track order status, and manage account.</li>
            <li><strong>Admin:</strong> Manages dolls, characters, and order statuses.</li>
            <li><strong>Manager:</strong> Oversees users and sales dashboard.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>3. Use of Service</h2>
          <ul>
            <li>Users must be at least 13 years old.</li>
            <li>No illegal content or misuse allowed.</li>
            <li>Each account is linked to a unique email.</li>
            <li>A customer may own multiple dolls; each has a unique ID.</li>
            <li>AI integration applies only to products with matching IDs.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>4. Orders and Payments</h2>
          <ul>
            <li>Orders must be paid before processing.</li>
            <li>Transaction logs include timestamp and reference number.</li>
            <li>Order status: Confirmed → Shipping → Delivered.</li>
            <li>No discount or point system.</li>
            <li>Warranty starts when order reaches Delivered status.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>5. Warranty and Return Policy</h2>
          <ul>
            <li>Warranty applies only to intact items.</li>
            <li>Begins upon 'Delivered' status.</li>
            <li>Non-transferable between accounts.</li>
            <li>Refund requests must include a reason and be recorded.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>6. Intellectual Property</h2>
          <p>
            All content, AI models, and code belong to Doll World Co. Reuse or modification is prohibited without consent.
          </p>
        </section>

        <section className="terms-section">
          <h2>7. Limitation of Liability</h2>
          <p>Doll World is not responsible for:</p>
          <ul>
            <li>User errors during registration.</li>
            <li>Service downtime due to maintenance.</li>
            <li>Indirect damages or data loss.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>8. Termination</h2>
          <p>
            We reserve the right to suspend or delete accounts violating these terms or upon user request.
          </p>
        </section>

        <section className="terms-section">
          <h2>9. Changes to Terms</h2>
          <p>
            Terms may be updated periodically with notice via email or login prompt.
          </p>
        </section>

        <section className="terms-section">
          <h2>10. Contact</h2>
          <p>
            Email: support@dollworld.com
            <br />
            Hotline: 1900 1234
          </p>
        </section>
      </main>
    </div>
  );
}

export default Terms;