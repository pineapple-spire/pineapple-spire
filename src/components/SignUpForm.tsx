'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SignUpUserSchema } from '@/lib/validationSchemas';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import type { SignUpFormData } from '@/app/auth/signup/page';

const styles = {
  formContainer: {
    backgroundColor: '#e8e8e8',
    padding: '2rem',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '600px',
  },
  formHeader: {
    backgroundColor: '#ffff00',
    margin: '-2rem -2rem 2rem -2rem',
    padding: '1rem',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
  title: {
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
  },
  input: {
    textAlign: 'center',
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  submitButton: {
    backgroundColor: '#fff168',
    border: 'none',
    borderRadius: '9999px',
    padding: '0.5rem 2rem',
    color: 'black',
    width: 'fit-content',
    margin: '1rem auto',
    display: 'block',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.5rem',
  },
  signInLink: {
    color: '#2196f3',
    textDecoration: 'none',
  },
} as const;

interface SignUpFormProps {
  onSubmit: (data: SignUpFormData) => Promise<void>;
}

export default function SignUpForm({ onSubmit }: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(SignUpUserSchema),
  });

  return (
    <div style={styles.formContainer}>
      <div style={styles.formHeader}>
        <h1 style={styles.title}>Sign Up</h1>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                {...register('firstName')}
                placeholder="First Name"
                style={styles.input}
                className={errors.firstName ? 'is-invalid' : ''}
              />
              <div className="invalid-feedback">{errors.firstName?.message}</div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                {...register('lastName')}
                placeholder="Last Name"
                style={styles.input}
                className={errors.lastName ? 'is-invalid' : ''}
              />
              <div className="invalid-feedback">{errors.lastName?.message}</div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                {...register('email')}
                placeholder="Email"
                style={styles.input}
                className={errors.email ? 'is-invalid' : ''}
              />
              <div className="invalid-feedback">{errors.email?.message}</div>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                {...register('username')}
                placeholder="Username"
                style={styles.input}
                className={errors.username ? 'is-invalid' : ''}
              />
              <div className="invalid-feedback">{errors.username?.message}</div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                {...register('password')}
                placeholder="Password"
                style={styles.input}
                className={errors.password ? 'is-invalid' : ''}
              />
              <div className="invalid-feedback">{errors.password?.message}</div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                {...register('confirmPassword')}
                placeholder="Confirm Password"
                style={styles.input}
                className={errors.confirmPassword ? 'is-invalid' : ''}
              />
              <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col className="d-flex justify-content-center gap-3">
            <Button type="submit" style={styles.submitButton}>
              Sign Up
            </Button>
            <Button
              type="button"
              onClick={() => reset()}
              variant="warning"
              style={{ ...styles.submitButton, backgroundColor: '#ffd700' }}
            >
              Reset
            </Button>
          </Col>
        </Row>
      </Form>

      <div style={styles.footer}>
        Already have an account?
        {' '}
        <Link href="/auth/signin" style={styles.signInLink}>
          Sign In
        </Link>
      </div>
    </div>
  );
}
