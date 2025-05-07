'use client';

import React, { useState } from 'react';
import swal from 'sweetalert';
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Card,
  Button,
  Spinner,
} from 'react-bootstrap';
import { computeFutureValue, formatCurrency } from '@/lib/mathUtils';
import CommonTabs from '@/components/CommonTabs';
import LinePlot from '@/components/LinePlot';

/**
 * Returns an array of objects representing a year-by-year breakdown of investment.
 */
function getYearlyBreakdown(
  presentValue: number,
  monthlyContribution: number,
  monthlyRate: number,
  years: number,
) {
  const breakdown: Array<{
    year: number;
    balance: number;
    contribution: number;
    interestEarned: number;
  }> = [];
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
 * Computes residual (lost) interest year-by-year.
 */
function getResidualEffects(
  withDrop: Array<{ year: number; interestEarned: number }>,
  noDrop: Array<{ year: number; interestEarned: number }>,
) {
  let cumulativeLost = 0;
  return withDrop.map((withDropRow, idx) => {
    const noDropRow = noDrop[idx];
    const lostThisYear = noDropRow.interestEarned - withDropRow.interestEarned;
    cumulativeLost += lostThisYear;
    return {
      year: withDropRow.year,
      lostThisYear,
      cumulativeLost,
    };
  });
}

const StressTest1: React.FC = () => {
  // User inputs
  const [presentValue, setPresentValue] = useState<number>(50000);
  const [interestRate, setInterestRate] = useState<number>(4.2);
  const [term, setTerm] = useState<number>(30);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(1000);
  const [dropRate, setDropRate] = useState<number>(30);

  // Tab state
  const [activeTab, setActiveTab] = useState<'stressEffects' | 'residualEffects'>(
    'stressEffects',
  );

  // Save button state
  const [isSaving, setIsSaving] = useState(false);

  // Derived rates
  const monthlyRateNoDrop = interestRate / 100 / 12;
  const monthlyRateWithDrop = (interestRate * (1 - dropRate / 100)) / 100 / 12;

  // Future values & interest
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

  // Detailed breakdowns
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
  const residualData = getResidualEffects(breakdownWithDrop, breakdownNoDrop);

  // Chart datasets
  const chartData = {
    labels: breakdownNoDrop.map((r) => r.year.toString()),
    datasets: [
      {
        label: `With ${dropRate}% Drop`,
        data: breakdownWithDrop.map((r) => r.balance),
        borderColor: 'red',
        fill: false,
        tension: 0.1,
      },
      {
        label: `Without ${dropRate}% Drop`,
        data: breakdownNoDrop.map((r) => r.balance),
        borderColor: 'green',
        fill: false,
        tension: 0.1,
      },
    ],
  };
  const residualChartData = {
    labels: residualData.map((r) => r.year.toString()),
    datasets: [
      {
        label: 'Lost Interest This Year',
        data: residualData.map((r) => r.lostThisYear),
        borderColor: 'blue',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Cumulative Lost Interest',
        data: residualData.map((r) => r.cumulativeLost),
        borderColor: 'orange',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  // Save current scenario to DB
  const handleSave = async () => {
    const title = await swal({
      text: 'Enter a title for this scenario (this will be used for version selection):',
      content: {
        element: 'input',
      },
      buttons: ['Cancel', 'Save'],
    });
    if (!title) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/stress-test/1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          data: {
            presentValue,
            interestRate,
            term,
            monthlyContribution,
            dropRate,
          },
        }),
      });
      if (!res.ok) throw new Error();
      await res.json();
      swal('Saved', 'Scenario saved successfully!', 'success', { timer: 2000 });
    } catch {
      swal('Error', 'Failed to save scenario.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">Model Drop in Return on Initial Investment</h2>

      {/* Input form */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Form.Label>Present Value ($)</Form.Label>
          <Form.Control
            type="number"
            value={presentValue}
            onChange={(e) => setPresentValue(+e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Label>Interest Rate (%)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(+e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Label>Term (years)</Form.Label>
          <Form.Control
            type="number"
            value={term}
            onChange={(e) => setTerm(+e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Label>Monthly Contribution ($)</Form.Label>
          <Form.Control
            type="number"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(+e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Label>% Rate of Return Drop</Form.Label>
          <Form.Control
            type="number"
            value={dropRate}
            onChange={(e) => setDropRate(+e.target.value)}
          />
        </Col>
      </Row>

      {/* Tabs */}
      <CommonTabs
        defaultTab="stressEffects"
        onTabChange={(tab) => setActiveTab(tab === 'residualEffects' ? 'residualEffects' : 'stressEffects')}
      />

      {/* Save button */}
      <Row className="mb-3 mt-3">
        <Col xs={12}>
          <Button
            variant="success"
            onClick={handleSave}
            disabled={isSaving}
            className="w-100"
          >
            {isSaving
              ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  {' '}
                  Saving...
                </>
              )
              : 'Save Scenario'}
          </Button>
        </Col>
      </Row>

      {/* Content */}
      {activeTab === 'stressEffects' ? (
        <>
          {/* Growth Comparison Chart */}
          <Row className="mb-4">
            <Col md={{ span: 8, offset: 2 }}>
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">Investment Growth Comparison</Card.Title>
                  <LinePlot
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Yearly Investment Balance' },
                      },
                      scales: {
                        x: { title: { display: true, text: 'Year' } },
                        y: { title: { display: true, text: 'Balance ($)' } },
                      },
                    }}
                    style={{ minHeight: '450px', maxHeight: '650px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Summary Tables */}
          <Row className="mb-4">
            <Col md={6}>
              <Card className="p-2">
                <Card.Body>
                  <Card.Title className="text-center">
                    With
                    {dropRate}
                    % Drop
                  </Card.Title>
                  <Table responsive striped bordered size="sm">
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
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="p-2">
                <Card.Body>
                  <Card.Title className="text-center">
                    Without
                    {dropRate}
                    % Drop
                  </Card.Title>
                  <Table responsive striped bordered size="sm">
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
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Year-by-Year Tables */}
          <Row>
            <Col xs={12} md={6}>
              <h5>
                Detailed Breakdown (With
                {dropRate}
                % Drop)
              </h5>
              <Table responsive striped bordered>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>End-of-Year Balance</th>
                    <th>Total Contribution</th>
                    <th>Interest Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdownWithDrop.map((r) => (
                    <tr key={r.year}>
                      <td>{r.year}</td>
                      <td>{formatCurrency(r.balance)}</td>
                      <td>{formatCurrency(r.contribution)}</td>
                      <td>{formatCurrency(r.interestEarned)}</td>
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
              <Table responsive striped bordered>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>End-of-Year Balance</th>
                    <th>Total Contribution</th>
                    <th>Interest Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdownNoDrop.map((r) => (
                    <tr key={r.year}>
                      <td>{r.year}</td>
                      <td>{formatCurrency(r.balance)}</td>
                      <td>{formatCurrency(r.contribution)}</td>
                      <td>{formatCurrency(r.interestEarned)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </>
      ) : (
        <>
          {/* Residual Effects */}
          <Row className="mb-4">
            <Col md={{ span: 8, offset: 2 }}>
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">
                    Residual Effects: Lost Interest
                  </Card.Title>
                  <LinePlot
                    data={residualChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                        title: {
                          display: true,
                          text: 'Lost Interest Over Time',
                        },
                      },
                      scales: {
                        x: { title: { display: true, text: 'Year' } },
                        y: { title: { display: true, text: 'Interest Lost ($)' } },
                      },
                    }}
                    style={{ minHeight: '450px', maxHeight: '650px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <h5>
                Residual Effects Over
                {term}
                {' '}
                Years
              </h5>
              <Table responsive striped bordered>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Lost Interest</th>
                    <th>Cumulative Lost</th>
                  </tr>
                </thead>
                <tbody>
                  {residualData.map((r) => (
                    <tr key={r.year}>
                      <td>{r.year}</td>
                      <td>{formatCurrency(r.lostThisYear)}</td>
                      <td>{formatCurrency(r.cumulativeLost)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default StressTest1;
