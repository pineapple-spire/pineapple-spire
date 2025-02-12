'use client';

import React from 'react';
import { Table, Container, Col, Row } from 'react-bootstrap';

// TODO: Replace placeholders with actual data computations.

const StressTest1: React.FC = () => (
  <Container className="my-4">

    <Row>
      <Col>
        <Table bordered className="mb-4">
          <tbody>
            <tr>
              <td>% Rate of Return Drop</td>
              <td>30%</td>
            </tr>
            <tr>
              <td>Present Value</td>
              <td>$50,000</td>
            </tr>
            <tr>
              <td>Interest Rate</td>
              <td>4.20%</td>
            </tr>
            <tr>
              <td>Term (in years)</td>
              <td>30</td>
            </tr>
            <tr>
              <td>Monthly Contribution</td>
              <td>100.0%</td>
            </tr>
          </tbody>
        </Table>
      </Col>
      <Col>
        <div className="d-flex justify-content-between">
          {/* Table: With 30% Drop */}
          <Table bordered>
            <thead>
              <tr>
                <th colSpan={2}>With 30% Drop</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Value after 5 years</td>
                <td>$XXXX</td>
              </tr>
              <tr>
                <td>Interest Earned after 5 years</td>
                <td>XX.XX%</td>
              </tr>
              <tr>
                <td>Value after 30 years</td>
                <td>$XXXX</td>
              </tr>
              <tr>
                <td>Interest Earned after 30 years</td>
                <td>XX.XX%</td>
              </tr>
            </tbody>
          </Table>

          {/* Table: Without 30% Drop */}
          <Table bordered>
            <thead>
              <tr>
                <th colSpan={2}>Without 30% Drop</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Value after 5 years</td>
                <td>$XXXX</td>
              </tr>
              <tr>
                <td>Interest Earned after 5 years</td>
                <td>XX.XX%</td>
              </tr>
              <tr>
                <td>Value after 30 years</td>
                <td>$XXXX</td>
              </tr>
              <tr>
                <td>Interest Earned after 30 years</td>
                <td>XX.XX%</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Col>
    </Row>

  </Container>
);

export default StressTest1;
