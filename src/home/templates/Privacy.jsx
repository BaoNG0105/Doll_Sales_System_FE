import React from 'react';
import '../static/css/Privacy.css';

function Privacy() {
  return (
    <div className="privacy-container">
      <header className="privacy-header">
        <h1>Privacy Policy</h1>
        <p>Your privacy is important to us.</p>
      </header>

      <main className="privacy-main">
        <section className="privacy-section">
          <h2>1. Purpose of Policy</h2>
          <p>
            Doll World respects user privacy and is committed to protecting personal data in compliance with international standards (GDPR-compliant).
          </p>
        </section>

        <section className="privacy-section">
          <h2>2. Information We Collect</h2>
          <p>We collect the following information:</p>
          <ul>
            <li><strong>Personal Information:</strong> name, email, phone number, address (for registration and purchase).</li>
            <li><strong>Transaction Data:</strong> order history, payment method (we do not store card details).</li>
            <li><strong>Behavioral Data:</strong> browsing history and product interactions.</li>
            <li><strong>Technical Data:</strong> IP address, browser type, cookies for user experience improvement.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>3. Purpose of Data Usage</h2>
          <p>We use collected data to:</p>
          <ul>
            <li>Provide and maintain services.</li>
            <li>Process payments and activate AI characters.</li>
            <li>Verify accounts and send delivery/warranty updates.</li>
            <li>Analyze statistics and enhance shopping experience.</li>
            <li>Comply with legal and audit requirements.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>4. Data Protection</h2>
          <ul>
            <li>All data is encrypted and securely stored.</li>
            <li>Passwords are hashed using SHA-256 or equivalent.</li>
            <li>Accounts are locked after 5 failed login attempts.</li>
            <li>System logs are stored for at least 2 years.</li>
            <li>All data is transmitted via HTTPS.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>5. User Rights</h2>
          <p>Users have the right to:</p>
          <ul>
            <li>Access, edit, or delete their personal data.</li>
            <li>Request to unsubscribe from notifications.</li>
            <li>Request account deletion at any time via the contact form.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>6. Data Retention</h2>
          <p>
            Data is retained for 2 years after account deactivation. Transaction data may be kept longer for accounting compliance.
          </p>
        </section>

        <section className="privacy-section">
          <h2>7. Cookies</h2>
          <p>
            We use cookies to store login info and preferences. Disabling cookies may limit site functionality.
          </p>
        </section>

        <section className="privacy-section">
          <h2>8. Third-party Services</h2>
          <p>
            We integrate third-party providers such as Momo, Cloudinary, and AI services — all of which comply with respective privacy standards.
          </p>
        </section>

        <section className="privacy-section">
          <h2>9. Contact</h2>
          <p>
            For privacy-related inquiries, contact:
            <br />
            Email: support@dollworld.com
            <br />
            Hotline: 1900 1234
          </p>
        </section>
      </main>
    </div>
  );
}

export default Privacy;