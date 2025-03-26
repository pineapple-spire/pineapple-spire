'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function ContactPage() {
  const { data: session, status } = useSession();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ success: boolean; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session, status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setName('');
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
  }

  const isNameReadOnly = session?.user?.name;
  const isEmailReadOnly = session?.user?.email;

  const inputBaseStyle: React.CSSProperties = {
    width: '100%',
    padding: 8,
    border: '1px solid #ccc',
    borderRadius: 4,
  };

  const inputReadOnlyStyle: React.CSSProperties = {
    ...inputBaseStyle,
    backgroundColor: '#f0f0f0',
    cursor: 'not-allowed',
  };

  return (
    <div style={{ maxWidth: 500, margin: '50px auto', padding: '0 20px' }}>
      <h1>Contact Us</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label htmlFor="name">
          Name
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            readOnly={!!isNameReadOnly}
            style={isNameReadOnly ? inputReadOnlyStyle : inputBaseStyle}
          />
        </label>

        <label htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            readOnly={!!isEmailReadOnly}
            style={isEmailReadOnly ? inputReadOnlyStyle : inputBaseStyle}
          />
        </label>

        <label htmlFor="message">
          Message
          <textarea
            id="message"
            value={message}
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
}
