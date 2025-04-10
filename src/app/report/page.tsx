'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface StatusMessage {
  success: boolean;
  msg: string;
}

/**
 * ReportPage Component
 *
 * This component allows a user to report problems with the application.
 * It pre-populates the the email field if the user is authenticated.
 */
const ReportPage: React.FC = () => {
  const { data: session } = useSession();

  // State variables for form fields and feedback
  const [email, setEmail] = useState<string>('');
  const [problem, setProblem] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Populate the user email from the session
  useEffect(() => {
    if (session?.user) {
      setEmail(session.user.email || '');
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, problem }),
      });

      if (response.ok) {
        setProblem('');
        setStatusMessage({ success: true, msg: 'Problem reported successfully!' });
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

  // Determine if fields should be read-only based on the user's session
  const isEmailReadOnly = Boolean(session?.user?.email);

  // Base styling for inputs
  const inputBaseStyle: React.CSSProperties = {
    width: '100%',
    padding: 8,
    border: '1px solid #ccc',
    borderRadius: 4,
  };

  // Styling for read-only inputs
  const inputReadOnlyStyle: React.CSSProperties = {
    ...inputBaseStyle,
    backgroundColor: '#f0f0f0',
    cursor: 'not-allowed',
  };

  return (
    <div style={{ maxWidth: 500, margin: '50px auto', padding: '0 20px' }}>
      <h1>Report a Problem</h1>
      <p>Thank you for helping enhance our application!</p>

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

        <label htmlFor="problem">
          Problem
          <textarea
            id="problem"
            value={problem}
            placeholder="Write your problem here..."
            onChange={(e) => setProblem(e.target.value)}
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

export default ReportPage;
