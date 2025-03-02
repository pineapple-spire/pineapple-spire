'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Table, Form } from 'react-bootstrap';
import { computeFutureValue, formatCurrency } from '@/lib/mathUtils';

/**
 * Returns an array of objects representing a year-by-year breakdown of investment.
 */
function getYearlyBreakdown(
  presentValue: number,
  monthlyContribution: number,
  monthlyRate: number,
  years: number,
) {
  const breakdown = [];
  let balance = presentValue;

  for (let y = 1; y <= years; y++) {
    let interestEarnedThisYear = 0;

    for (let m = 1; m <= 12; m++) {
      const preContributionBalance = balance * (1 + monthlyRate);
      const interestThisMonth = preContributionBalance - balance;

      balance = preContributionBalance + monthlyContribution;
      interestEarnedThisYear += interestThisMonth;
    }

    const totalContributionThisYear = monthlyContribution * 12;

    breakdown.push({
      year: y,
      balance,
      contribution: totalContributionThisYear,
      interestEarned: interestEarnedThisYear,
    });
  }

  return breakdown;
}

/**
 * StressTest1
 *
 * This component demonstrates a side-by-side comparison of an investment
 * scenario with a 30% drop vs. without a 30% drop. The user can modify:
 *   - Present Value
 *   - Interest Rate
 *   - Term (years)
 *   - Monthly Contribution
 *   - % Rate of Return Drop
 */
const StressTest1: React.FC = () => {
  const [presentValue, setPresentValue] = useState<number>(50000);
  const [interestRate, setInterestRate] = useState<number>(4.2);
  const [term, setTerm] = useState<number>(30);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(1000);
  const [dropRate, setDropRate] = useState<number>(30);

  const monthlyRateNoDrop = (interestRate / 100) / 12;
  const monthlyRateWithDrop = ((interestRate * (1 - dropRate / 100)) / 100) / 12;

  const fvWithDrop5 = computeFutureValue(
    presentValue,
    monthlyContribution,
    monthlyRateWithDrop,
    5 * 12,
  );
  const fvNoDrop5 = computeFutureValue(
    presentValue,
    monthlyContribution,
    monthlyRateNoDrop,
    5 * 12,
  );

  const fvWithDropTerm = computeFutureValue(
    presentValue,
    monthlyContribution,
    monthlyRateWithDrop,
    term * 12,
  );
  const fvNoDropTerm = computeFutureValue(
    presentValue,
    monthlyContribution,
    monthlyRateNoDrop,
    term * 12,
  );

  const totalPrincipal5 = presentValue + monthlyContribution * 12 * 5;
  const totalPrincipalTerm = presentValue + monthlyContribution * 12 * term;

  const interestWithDrop5 = fvWithDrop5 - totalPrincipal5;
  const interestNoDrop5 = fvNoDrop5 - totalPrincipal5;
  const interestWithDropTerm = fvWithDropTerm - totalPrincipalTerm;
  const interestNoDropTerm = fvNoDropTerm - totalPrincipalTerm;

  const breakdownWithDrop = getYearlyBreakdown(
    presentValue,
    monthlyContribution,
    monthlyRateWithDrop,
    term,
  );
  const breakdownNoDrop = getYearlyBreakdown(
    presentValue,
    monthlyContribution,
    monthlyRateNoDrop,
    term,
  );

  return (
    <Container className="my-4">
      <h2 className="mb-4">Stress Test #1 - 30% Drop in Return on Initial Investment</h2>

      <Row className="mb-4">
        {/* Inputs Section */}
        <Col xs={12} md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Present Value</Form.Label>
            <Form.Control
              type="number"
              value={presentValue}
              onChange={(e) => setPresentValue(Number(e.target.value))}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Interest Rate (%)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Term (in years)</Form.Label>
            <Form.Control
              type="number"
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Monthly Contribution</Form.Label>
            <Form.Control
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>% Rate of Return Drop</Form.Label>
            <Form.Control
              type="number"
              step="1"
              value={dropRate}
              onChange={(e) => setDropRate(Number(e.target.value))}
            />
          </Form.Group>
        </Col>

        {/* Summary Tables */}
        <Col xs={12} md={8}>
          <Row>
            <Col xs={6}>
              <Table bordered>
                <thead>
                  <tr>
                    <th colSpan={2} className="text-center">
                      With
                      {' '}
                      {dropRate}
                      % Drop
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Value after 5 years</td>
                    <td>{formatCurrency(fvWithDrop5)}</td>
                  </tr>
                  <tr>
                    <td>Interest Earned after 5 years</td>
                    <td>{formatCurrency(interestWithDrop5)}</td>
                  </tr>
                  <tr>
                    <td>
                      Value after
                      {term}
                      {' '}
                      years
                    </td>
                    <td>{formatCurrency(fvWithDropTerm)}</td>
                  </tr>
                  <tr>
                    <td>
                      Interest Earned after
                      {term}
                      {' '}
                      years
                    </td>
                    <td>{formatCurrency(interestWithDropTerm)}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col xs={6}>
              <Table bordered>
                <thead>
                  <tr>
                    <th colSpan={2} className="text-center">
                      Without
                      {' '}
                      {dropRate}
                      % Drop
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Value after 5 years</td>
                    <td>{formatCurrency(fvNoDrop5)}</td>
                  </tr>
                  <tr>
                    <td>Interest Earned after 5 years</td>
                    <td>{formatCurrency(interestNoDrop5)}</td>
                  </tr>
                  <tr>
                    <td>
                      Value after
                      {term}
                      {' '}
                      years
                    </td>
                    <td>{formatCurrency(fvNoDropTerm)}</td>
                  </tr>
                  <tr>
                    <td>
                      Interest Earned after
                      {term}
                      {' '}
                      years
                    </td>
                    <td>{formatCurrency(interestNoDropTerm)}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Detailed Year-by-Year Tables */}
      <Row>
        <Col xs={12} md={6}>
          <h5>
            Detailed Breakdown (With
            {dropRate}
            % Drop)
          </h5>
          <Table bordered>
            <thead>
              <tr>
                <th>Year</th>
                <th>End-of-Year Balance</th>
                <th>Total Contrib. This Year</th>
                <th>Interest Earned This Year</th>
              </tr>
            </thead>
            <tbody>
              {breakdownWithDrop.map((row) => (
                <tr key={row.year}>
                  <td>{row.year}</td>
                  <td>{formatCurrency(row.balance)}</td>
                  <td>{formatCurrency(row.contribution)}</td>
                  <td>{formatCurrency(row.interestEarned)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        <Col xs={12} md={6}>
          <h5>
            Detailed Breakdown (Without
            {dropRate}
            % Drop)
          </h5>
          <Table bordered>
            <thead>
              <tr>
                <th>Year</th>
                <th>End-of-Year Balance</th>
                <th>Total Contrib. This Year</th>
                <th>Interest Earned This Year</th>
              </tr>
            </thead>
            <tbody>
              {breakdownNoDrop.map((row) => (
                <tr key={row.year}>
                  <td>{row.year}</td>
                  <td>{formatCurrency(row.balance)}</td>
                  <td>{formatCurrency(row.contribution)}</td>
                  <td>{formatCurrency(row.interestEarned)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default StressTest1;
