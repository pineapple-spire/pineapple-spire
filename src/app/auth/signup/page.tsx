'use client';

import { signIn } from 'next-auth/react';
import SignUpForm from '@/components/SignUpForm';
import { createUser } from '@/lib/dbActions';

export type SignUpFormData = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
  },
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem 1rem',
  },
} as const;

export default function SignUpPage() {
  const handleSignUp = async (data: SignUpFormData) => {
    try {
      await createUser(data);
      await signIn('credentials', {
        callbackUrl: '/add',
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error('Error during sign up:', error);
    }
  };

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <SignUpForm onSubmit={handleSignUp} />
      </main>
    </div>
  );
}
