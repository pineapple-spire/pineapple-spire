'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Button } from 'react-bootstrap';

const Home: React.FC = () => (
  <Container className="py-5 text-center d-flex flex-column align-items-center">
    {/* Title Section */}
    <h1 className="mb-3 fw-bold">Welcome to Spire&apos;s Toolbox!</h1>
    <div
      className="d-inline-block px-5 py-3 rounded position-relative"
      style={{
        fontSize: '1rem',
        fontWeight: '500',
        backgroundColor: '#fff24b',
      }}
    >
      Financial Sustainability Modeling Portal
    </div>
    <p className="mt-3 text-secondary">Managed by Spire Hawaii LLP</p>

    {/* Navigation Buttons */}
    <div className="mt-4 w-100" style={{ maxWidth: '600px' }}>
      <Link href="/about" passHref>
        <Button variant="outline-primary" className="w-100 mb-3">
          ✨ Get Started
        </Button>
      </Link>
      <Link href="/fiscal-sustainability-model" passHref>
        <Button variant="outline-primary" className="w-100 mb-3">
          ✨ Fiscal Sustainability Model (FSM)
        </Button>
      </Link>
      <Link href="/financial-compilation" passHref>
        <Button variant="outline-primary" className="w-100 mb-3">
          ✨ Financial Compilation
        </Button>
      </Link>
      <Link href="/stress-test-tool" passHref>
        <Button variant="outline-primary" className="w-100">
          ✨ Stress Test Tool Page
        </Button>
      </Link>
    </div>
  </Container>
);

export default Home;
