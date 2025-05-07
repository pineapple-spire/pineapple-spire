'use client';

import React, { useState, useMemo, ChangeEvent } from 'react';
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
import {
  calculateResidualEffects,
  formatCurrency,
} from '@/lib/mathUtils';
import CommonTabs from '@/components/CommonTabs';
import LinePlot from '@/components/LinePlot';

interface StressRow {
  year: number
  balance: number
  contribution: number
  interest: number
  total: number
}

interface Contribution {
  year: number
  contribution: number
}

const START_YEAR = 2025;

export default function StressTest5() {
  const [presentValue, setPresentValue] = useState<number>(5000);
  const [interestRate, setInterestRate] = useState<number>(6.0);
  const [term, setTerm] = useState<number>(30);
  const [fullyFunded, setFullyFunded] = useState<number>(100);

  const [contributions, setContributions] = useState<Contribution[]>(
    () => Array.from({ length: term }, (_, i) => ({
      year: START_YEAR + i,
      contribution: 0,
    })),
  );

  // UI state
  const [activeTab, setActiveTab] = useState<
  'stressEffects' | 'residualEffects'
  >('stressEffects');
  const [isSaving, setIsSaving] = useState(false);

  const handleNumber = (setter: (v: number) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!Number.isNaN(v) && v >= 0) setter(v);
  };

  const handleContributionChange = (year: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value) || 0;
    setContributions((cs) => cs.map((c) => (c.year === year ? { ...c, contribution: v } : c)));
  };

  // 1) build our stress‐effect rows
  const stressRows: StressRow[] = useMemo(() => {
    const rows: StressRow[] = [];
    let balance = presentValue;

    for (let i = 0; i < term; i++) {
      const year = START_YEAR + i;
      const contrib = contributions.find((c) => c.year === year)?.contribution ?? 0;
      const interest = parseFloat(
        (balance * (interestRate / 100)).toFixed(2),
      );
      const total = parseFloat((balance + interest + contrib).toFixed(2));

      rows.push({ year, balance, contribution: contrib, interest, total });
      balance = total;
    }

    return rows;
  }, [presentValue, interestRate, term, contributions]);

  // 2) chart data for stress effects
  const stressChartData = useMemo(
    () => ({
      labels: stressRows.map((r) => r.year.toString()),
      datasets: [
        {
          label: 'Balance',
          data: stressRows.map((r) => r.balance),
          borderColor: 'green',
          fill: false,
          tension: 0.1,
        },
        {
          label: 'Interest',
          data: stressRows.map((r) => r.interest),
          borderColor: 'red',
          fill: false,
          tension: 0.1,
        },
      ],
    }),
    [stressRows],
  );

  // 3) feed end-of-year totals into residual‐effects
  const residualData = useMemo(() => {
    const principals = stressRows.map((r) => r.total);
    const fundedFlags = Array(term).fill(fullyFunded === 100);
    return calculateResidualEffects(
      principals,
      interestRate,
      interestRate,
      term,
      fundedFlags,
    );
  }, [stressRows, interestRate, term, fullyFunded]);

  const residualChartData = useMemo(
    () => ({
      labels: residualData.map((r) => r.year.toString()),
      datasets: [
        {
          label: 'Cumulative Lost Earnings',
          data: residualData.map((r) => r.cumulativeLostEarnings),
          borderColor: 'blue',
          fill: false,
          tension: 0.1,
        },
      ],
    }),
    [residualData],
  );

  // 4) Save the scenario
  const handleSave = async () => {
    const title = (await swal({
      text: 'Enter a title for this scenario (this will be used for version selection):',
      content: {
        element: 'input',
        attributes: { placeholder: 'Scenario Title', type: 'text' },
      },
      buttons: ['Cancel', 'Save'],
    })) as string;
    if (!title) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/stress-test/5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          presentValue,
          interestRate,
          term,
          fullyFunded,
          contributions,
        }),
      });
      if (!res.ok) throw new Error();
      await res.json();
      swal('Saved!', 'Scenario saved.', 'success');
    } catch (err) {
      console.error(err);
      swal('Error', 'Save failed.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container className="my-4">
      <h2>Bond Return vs. Inflation</h2>

      {/* inputs + save */}
      <Row className="align-items-end mb-3">
        <Col md={2}>
          <Form.Group controlId="presentValue">
            <Form.Label>Present Value</Form.Label>
            <Form.Control
              type="number"
              value={presentValue}
              onChange={handleNumber(setPresentValue)}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group controlId="interestRate">
            <Form.Label>Interest Rate (%)</Form.Label>
            <Form.Control
              type="number"
              value={interestRate}
              onChange={handleNumber(setInterestRate)}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group controlId="term">
            <Form.Label>Term (Years)</Form.Label>
            <Form.Control
              type="number"
              value={term}
              onChange={handleNumber(setTerm)}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group controlId="fullyFunded">
            <Form.Label>Fully Funded (%)</Form.Label>
            <Form.Control
              type="number"
              value={fullyFunded}
              onChange={handleNumber(setFullyFunded)}
            />
          </Form.Group>
        </Col>
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
      </Row>

      <CommonTabs
        defaultTab="stressEffects"
        onTabChange={(tab) => setActiveTab(
          tab === 'residualEffects' ? 'residualEffects' : 'stressEffects',
        )}
      />

      {activeTab === 'stressEffects' ? (
        <>
          {/* chart */}
          <Row className="mb-4">
            <Col md={{ span: 8, offset: 2 }}>
              <Card>
                <Card.Body>
                  <LinePlot
                    data={stressChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        title: {
                          display: true,
                          text: 'Balance & Interest Over Time',
                        },
                      },
                      scales: {
                        x: { title: { display: true, text: 'Year' } },
                        y: { title: { display: true, text: 'Amount' } },
                      },
                    }}
                    style={{ minHeight: '400px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* table */}
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Balance</th>
                  <th>Contribution</th>
                  <th>Interest</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {stressRows.map((r) => (
                  <tr key={r.year}>
                    <td>{r.year}</td>
                    <td>{formatCurrency(r.balance)}</td>
                    <td>
                      <Form.Control
                        type="number"
                        value={r.contribution}
                        onChange={handleContributionChange(r.year)}
                      />
                    </td>
                    <td>{formatCurrency(r.interest)}</td>
                    <td>{formatCurrency(r.total)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        </>
      ) : (
        <>
          {/* residual chart */}
          <Row className="mb-4">
            <Col md={{ span: 8, offset: 2 }}>
              <Card>
                <Card.Body>
                  <LinePlot
                    data={residualChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        title: {
                          display: true,
                          text: 'Cumulative Lost Earnings',
                        },
                      },
                      scales: {
                        x: { title: { display: true, text: 'Year' } },
                        y: { title: { display: true, text: 'Amount' } },
                      },
                    }}
                    style={{ minHeight: '400px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* residual table */}
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Principal</th>
                  <th>Lost Earnings</th>
                  <th>Cumulative Lost</th>
                </tr>
              </thead>
              <tbody>
                {residualData.map((r) => (
                  <tr key={r.year}>
                    <td>{r.year}</td>
                    <td>{formatCurrency(r.principal)}</td>
                    <td>{formatCurrency(r.lostEarnings)}</td>
                    <td>{formatCurrency(r.cumulativeLostEarnings)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        </>
      )}
    </Container>
  );
}
