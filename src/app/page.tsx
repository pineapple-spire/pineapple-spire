'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Button, Row, Col, Image } from 'react-bootstrap';

const Home: React.FC = () => (
  <Container className="py-5 text-center">
    <Row className="align-items-center text-center">
      <Col xs={12} md={4} className="mb-4 mb-md-0">
        <Image src="home-img.png" alt="Landing Page" fluid className="home-page-img" />
      </Col>

      <Col xs={12} md={8} className="d-flex flex-column align-items-center align-items-md-end">
        {/* Navigation Buttons */}
        <div className="mt-4 w-100" style={{ maxWidth: '600px' }}>
          <Link href="/about" passHref>
            <Button className="transparent-button1 mb-2">
              <span className="star">✦</span>
              Get Started &#x2192;
            </Button>
          </Link>
          <Link href="/fiscal-sustainability-model" passHref>
            <Button className="transparent-button1 mb-2">
              <span className="star">✦</span>
              Fiscal Sustainability Model (FSM) &#x2192;
            </Button>
          </Link>
          <Link href="/financial-compilation" passHref>
            <Button className="transparent-button1 mb-2">
              <span className="star">✦</span>
              Financial Compilations &#x2192;
            </Button>
          </Link>
          <Link href="/stress-test-tool" passHref>
            <Button className="transparent-button1">
              <span className="star">✦</span>
              Stress Test Tool &#x2192;
            </Button>
          </Link>
        </div>
      </Col>
    </Row>
  </Container>
);

export default Home;
