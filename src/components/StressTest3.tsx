'use client';

import React, { useState, ChangeEvent } from 'react';
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
  calculateCompoundInterest,
  formatCurrency,
} from '@/lib/mathUtils';
import CommonTabs from '@/components/CommonTabs';
import LinePlot from '@/components/LinePlot';

interface YearData {
  amount: number;
  lost: number;
}

const StressTest3: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
  'stressEffects' | 'residualEffects'
  >('stressEffects');

  // Annual return rate (%) input
  const [annualRate, setAnnualRate] = useState<number>(6.02);

  // Initialize years 2025–2036 with amount=0, lost=0
  const [data, setData] = useState<Record<number, YearData>>(() => {
    const obj: Record<number, YearData> = {};
    for (let y = 2025; y <= 2036; y++) {
      obj[y] = { amount: 0, lost: 0 };
    }
    return obj;
  });

  const [isSaving, setIsSaving] = useState(false);
  const handleInputUpdate = (
    year?: number,
    value?: string,
    isRateChange?: boolean,
  ) => {
    const newData = { ...data };

    if (isRateChange && value !== undefined) {
      setAnnualRate(parseFloat(value) || 0);
    } else if (year !== undefined && value !== undefined) {
      newData[year].amount = parseFloat(value) || 0;
    }

    // reset lost
    Object.keys(newData).forEach((y) => {
      newData[+y].lost = 0;
    });

    const years = Object.keys(newData)
      .map(Number)
      .sort((a, b) => a - b);

    // For each event year, propagate compound interest loss forward
    years.forEach((startYear) => {
      const principal = newData[startYear].amount;
      years.forEach((_, idx) => {
        const future = startYear + idx;
        if (newData[future]) {
          const rate = isRateChange
            ? parseFloat(value || '') || annualRate
            : annualRate;
          const total = calculateCompoundInterest(principal, rate, idx + 1);
          newData[future].lost += Math.round(total);
        }
      });
    });

    setData(newData);
  };

  const sortedYears = Object.keys(data)
    .map(Number)
    .sort((a, b) => a - b);

  const stressChartData = {
    labels: sortedYears.map((y) => y.toString()),
    datasets: [
      {
        label: 'One-Time Expense',
        data: sortedYears.map((y) => data[y].amount),
        borderColor: 'red',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const residualChartData = {
    labels: sortedYears.map((y) => y.toString()),
    datasets: [
      {
        label: 'Lost Earnings',
        data: sortedYears.map((y) => data[y].lost),
        borderColor: 'blue',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  // Save to DB
  const handleSave = async () => {
    const title = (await swal({
      text: 'Enter a title for this scenario (this will be used for version selection):',
      content: {
        element: 'input',
        attributes: {
          placeholder: 'My Scenario Title',
          type: 'text',
        },
      },
      buttons: ['Cancel', 'Save'],
    })) as string;
    if (!title) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/stress-test/3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          annualRate,
          events: sortedYears.map((y) => ({
            year: y,
            amount: data[y].amount,
          })),
        }),
      });
      if (!res.ok) throw new Error();
      await res.json();
      swal('Saved!', 'Scenario saved successfully.', 'success');
    } catch (err) {
      console.error(err);
      swal('Error', 'Failed to save scenario.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container className="my-4">
      <Row className="align-items-end mb-3">
        <Col>
          <h3>One-Time Event Impact</h3>
        </Col>
        <Col md={3}>
          <Form.Group controlId="annualRate">
            <Form.Label>Annual Return Rate (%)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={annualRate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputUpdate(undefined, e.target.value, true)}
              onBlur={(e) => {
                if (e.target.value.trim() === '') {
                  handleInputUpdate(undefined, '6.02', true);
                }
              }}
            />
          </Form.Group>
        </Col>
      </Row>

      <CommonTabs
        defaultTab="stressEffects"
        onTabChange={(tab) => setActiveTab(
          tab === 'residualEffects' ? 'residualEffects' : 'stressEffects',
        )}
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

      {activeTab === 'stressEffects' ? (
        <>
          {/* Chart */}
          <Row className="mb-4">
            <Col md={{ span: 8, offset: 2 }}>
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">
                    One-Time Expenses by Year
                  </Card.Title>
                  <LinePlot
                    data={stressChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                        title: {
                          display: true,
                          text: 'Annual One-Time Expenses',
                        },
                      },
                      scales: {
                        x: { title: { display: true, text: 'Year' } },
                        y: { title: { display: true, text: 'Amount ($)' } },
                      },
                    }}
                    style={{ minHeight: '450px', maxHeight: '650px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Editable table of events */}
          <Row>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Fiscal Year</th>
                  <th>Expense ($)</th>
                </tr>
              </thead>
              <tbody>
                {sortedYears.map((year) => (
                  <tr key={year}>
                    <td>{year}</td>
                    <td>
                      <Form.Control
                        type="number"
                        value={data[year].amount}
                        onChange={(e) => handleInputUpdate(year, e.target.value)}
                        onBlur={(e) => {
                          if (e.target.value.trim() === '') {
                            handleInputUpdate(year, '0');
                          }
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        </>
      ) : (
        <>
          {/* Residual effects chart */}
          <Row className="mb-4">
            <Col md={{ span: 8, offset: 2 }}>
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">
                    Lost Earnings Over Time
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
                          text: 'Cumulative Lost Earnings',
                        },
                      },
                      scales: {
                        x: { title: { display: true, text: 'Year' } },
                        y: { title: { display: true, text: 'Lost ($)' } },
                      },
                    }}
                    style={{ minHeight: '450px', maxHeight: '650px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Residual effects table */}
          <Row>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Fiscal Year</th>
                  <th>Expense ($)</th>
                  <th>Lost Earnings ($)</th>
                </tr>
              </thead>
              <tbody>
                {sortedYears.map((year) => (
                  <tr key={year}>
                    <td>{year}</td>
                    <td>{formatCurrency(data[year].amount)}</td>
                    <td>{formatCurrency(data[year].lost)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        </>
      )}
    </Container>
  );
};

export default StressTest3;
