'use client';

import { signIn } from 'next-auth/react';
import SignUpForm from '@/components/SignUpForm';
import { createUser } from '@/lib/dbActions';
import styles from '@/styles/formStyles';

export type SignUpFormData = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpPage() {
  const handleSignUp = async (data: SignUpFormData) => {
    try {
      await createUser(data);
      await signIn('credentials', {
        callbackUrl: '/',
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error('Error during sign up:', error);
    }
  };

  return (
    <div>
      <main style={styles.main}>
        <SignUpForm onSubmit={handleSignUp} />
      </main>
    </div>
  );
}
