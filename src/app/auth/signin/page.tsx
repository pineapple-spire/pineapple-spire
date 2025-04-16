'use client';

import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '@/styles/formStyles';

const SignIn = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;
    const result = await signIn('credentials', {
      callbackUrl: '/',
      email,
      password,
    });
    if (result?.error) {
      setErrorMessage(result.error);
    }
  };

  return (
    <div style={styles.formContainer}>
      <div style={styles.formHeader}>
        <h1 style={styles.title}>Sign In</h1>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            name="email"
            placeholder="Email"
            style={styles.input}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            style={styles.input}
            required
          />
        </Form.Group>
        {errorMessage && (
          <div className="text-danger text-center mb-3">{errorMessage}</div>
        )}
        <Button type="submit" style={styles.submitButton}>
          Sign In
        </Button>
      </Form>
      <div style={styles.footer}>
        Don&apos;t have an account?
        {' '}
        <Link href="/auth/signup" style={styles.signUpLink}>
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
