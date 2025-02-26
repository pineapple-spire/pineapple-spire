'use client';

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

/* Landing Page */
const FinancialCompilation = () => (
  <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="text-center">
        <Col className="my-3 justify-content-center">
          <h1>Welcome to Financial Compilation</h1>
          <p>
            Explore detailed financial statements, costs of goods sold, operating expenses, assets, and liabilities to
            analyze and plan your financial future.
          </p>
        </Col>
        <Col>
          <Row className="justify-content-center">
            <Button
              className="d-flex align-items-center justify-content-center transparent-button1"
              style={{ height: '60px', width: '250px' }}
              href="/financial-compilation/income-statement"
            >
              Income Statement &#x2192;
            </Button>
          </Row>
          <Row className="justify-content-center">
            <Button
              className="d-flex align-items-center justify-content-center transparent-button1"
              style={{ height: '60px', width: '250px' }}
              href="/financial-compilation/costs-of-goods"
            >
              Costs of Goods &#x2192;
            </Button>
          </Row>
          <Row className="justify-content-center">
            <Button
              className="d-flex align-items-center justify-content-center transparent-button1"
              style={{ height: '60px', width: '250px' }}
              href="/financial-compilation/operating-expenses"
            >
              Operating Expenses &#x2192;
            </Button>
          </Row>
          <Row className="justify-content-center">
            <Button
              className="d-flex align-items-center justify-content-center transparent-button1"
              style={{ height: '60px', width: '250px' }}
              href="/financial-compilation/assets"
            >
              Assets &#x2192;
            </Button>
          </Row>
          <Row className="justify-content-center">
            <Button
              className="d-flex align-items-center justify-content-center transparent-button1"
              style={{ height: '60px', width: '250px' }}
              href="/financial-compilation/liabilities-equity"
            >
              Liabilities & Equity &#x2192;
            </Button>
          </Row>
        </Col>
      </Row>
    </Container>
  </div>
);

export default FinancialCompilation;
