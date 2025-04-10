'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface StatusMessage {
  success: boolean;
  msg: string;
}

/**
 * ContactPage Component
 *
 * This component renders a contact form that allows users to send messages.
 * If the user is logged in, their email is pre-populated and made read-only.
 */
const ContactPage: React.FC = () => {
  const { data: session } = useSession();

  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Populate email from session when available
  useEffect(() => {
    if (session?.user) {
      setEmail(session.user.email || '');
    }
  }, [session]);

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      });

      if (response.ok) {
        setMessage('');
        setStatusMessage({ success: true, msg: 'Message sent successfully!' });
      } else {
        const { error } = await response.json();
        setStatusMessage({ success: false, msg: error || 'Something went wrong.' });
      }
    } catch (err) {
      setStatusMessage({ success: false, msg: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Determine if the email field should be read-only
  const isEmailReadOnly = Boolean(session?.user?.email);
  const inputBaseStyle: React.CSSProperties = {
    width: '100%',
    padding: 8,
    border: '1px solid #ccc',
    borderRadius: 4,
  };

  // Styling for read-only input fields
  const inputReadOnlyStyle: React.CSSProperties = {
    ...inputBaseStyle,
    backgroundColor: '#f0f0f0',
    cursor: 'not-allowed',
  };

  return (
    <div style={{ maxWidth: 500, margin: '50px auto', padding: '0 20px' }}>
      <h1>Contact Us</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
            readOnly={isEmailReadOnly}
            style={isEmailReadOnly ? inputReadOnlyStyle : inputBaseStyle}
          />
        </label>

        <label htmlFor="message">
          Message
          <textarea
            id="message"
            value={message}
            placeholder="Write your message here..."
            onChange={(e) => setMessage(e.target.value)}
            required
            style={{ ...inputBaseStyle, minHeight: 100 }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#0070f3',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            cursor: 'pointer',
            borderRadius: 4,
          }}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {statusMessage && (
        <p style={{ marginTop: 20, color: statusMessage.success ? 'green' : 'red' }}>
          {statusMessage.msg}
        </p>
      )}
    </div>
  );
};

export default ContactPage;
