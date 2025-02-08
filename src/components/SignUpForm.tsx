'use client';

import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
  },

  navLink: {
    color: 'black',
    textDecoration: 'none',
    marginLeft: '2rem',
  },
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem 1rem',
  },
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

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export default function SignUpForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h1 style={styles.title}>Sign Up</h1>
          </div>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Control
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
                <Form.Control
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </Col>
              <Col md={6}>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </Col>
            </Row>

            <Button type="submit" style={styles.submitButton}>
              Sign Up
            </Button>
          </Form>
          {/* TODO: ADD SIGN UP LOGIC */}
          <div style={styles.footer}>
            Already have an account?
            {' '}
            <Link href="/signin" style={styles.signInLink}>
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
