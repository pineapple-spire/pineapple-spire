'use client';

import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import FCNavbar from '@/components/fc-components/FCNavbar';

/** The Stress Test Tool page. */
const FinancialCompilationPage = () => (
  <Container>
    <Row className="m-3 text-center">
      <h2>Financial Compilation</h2>
    </Row>
    <Row className="text-center">
      <p>12 Year Forecast</p>
    </Row>
    <Row>
      <FCNavbar />
    </Row>
  </Container>
);

export default FinancialCompilationPage;
