'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Button } from 'react-bootstrap';

const About: React.FC = () => (
  <Container className="py-5 text-center d-flex flex-column align-items-center">
    {/* Title Section */}
    <h1 className="mb-4 fw-bold">About Spire&apos;s Toolbox</h1>
    <p className="text-secondary mb-5" style={{ maxWidth: '700px', fontSize: '1.25em' }}>
      Spire&apos;s Financial Sustainability Modeling Portal is a tool designed to help organizations
      and individuals manage financial resources effectively.
      <br />
      <br />
      Developed by UH Manoa students for
      {' '}
      <strong>Spire Hawaii LLP</strong>
      , this web portal provides tools for fiscal sustainability modeling, financial compilation,
      and stress test tools to ensure informed decision-making.
    </p>

    {/* Navigation Back to Home */}
    <div>
      <Link href="/" passHref>
        <Button variant="primary" className="px-5">
          Go Back to Home
        </Button>
      </Link>
    </div>
  </Container>
);

export default About;
