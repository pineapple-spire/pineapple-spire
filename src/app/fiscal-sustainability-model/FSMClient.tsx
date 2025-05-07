'use client';

import React, { useEffect, useState, Fragment } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Spinner,
  Card,
  Button,
} from 'react-bootstrap';
import {
  calculateCompoundInterest,
  calculateResidualEffects,
  formatCurrency,
} from '@/lib/mathUtils';

type Scenario = { id: number; title: string };

const DECISION_LABEL: Record<string, string> = {
  1: 'Decrease in Revenue',
  2: 'Decrease in Revenue',
  3: 'Increase in Expense',
  4: 'Increase in Expense',
  5: 'Decrease in Revenue',
};

const TESTS: { key: string; label: string; api: string }[] = [
  { key: '1', label: 'Drop in Return on Initial Investment', api: '/api/stress-test/1' },
  { key: '2', label: 'Revenue Drop Scenario', api: '/api/stress-test/2' },
  { key: '3', label: 'One-Time Event Impact', api: '/api/stress-test/3' },
  { key: '4', label: 'Expense Increase Impact', api: '/api/stress-test/4' },
  { key: '5', label: 'Bond Return vs. Inflation', api: '/api/stress-test/5' },
];

export default function FSMPage() {
  const [startYear] = useState(2025);
  const [numYears, setNumYears] = useState(8);

  const pageSize = 6;
  const totalPages = Math.ceil(numYears / pageSize);
  const [pageIdx, setPageIdx] = useState(0);

  const allYears = Array.from({ length: numYears }, (_, i) => startYear + i);
  const pageYears = allYears.slice(pageIdx * pageSize, pageIdx * pageSize + pageSize);

  const [lists, setLists] = useState<Record<string, Scenario[]>>({});
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [details, setDetails] = useState<Record<string, any>>({});
  const [loadingList, setLoadingList] = useState<Record<string, boolean>>({});
  const [loadingDetail, setLoadingDetail] = useState<Record<string, boolean>>({});

  useEffect(() => {
    TESTS.forEach(({ key, api }) => {
      setLoadingList(l => ({ ...l, [key]: true }));
      fetch(api)
        .then(r => r.json())
        .then((arr: Scenario[]) => setLists(prev => ({ ...prev, [key]: arr })))
        .catch(() => setLists(prev => ({ ...prev, [key]: [] })))
        .finally(() => setLoadingList(l => ({ ...l, [key]: false })));
    });
  }, []);

  // fetch details on selection
  useEffect(() => {
    Object.entries(selected).forEach(([key, id]) => {
      if (!id) return;
      setLoadingDetail(l => ({ ...l, [key]: true }));
      const { api } = (TESTS.find(t => t.key === key)!);
      fetch(`${api}?id=${id}`)
        .then(r => r.json())
        .then(body => {
          const payload = body.data ?? body;
          setDetails(d => ({ ...d, [key]: payload }));
        })
        .finally(() => setLoadingDetail(l => ({ ...l, [key]: false })));
    });
  }, [selected]);

  // StressTest1 breakdown helpers
  function getYearlyBreakdown(pv:number, mc:number, mr:number, yrs:number) {
    const b = []; let bal = pv;
    for (let y = 1; y <= yrs; y++) {
      let intY = 0;
      for (let m = 1; m <= 12; m++) {
        const pre = bal * (1 + mr);
        intY += pre - bal;
        bal = pre + mc;
      }
      b.push({ year: y, balance: bal, interestEarned: intY });
    }
    return b;
  }
  function getResidual(dropped:any[], normal:any[]) {
    let cum = 0;
    return dropped.map((r, i) => {
      const lost = normal[i].interestEarned - r.interestEarned;
      cum += lost;
      return { lost, cum };
    });
  }

  function calc1(d:any) {
    const { presentValue, interestRate, monthlyContribution, dropRate } = d;
    const mrNo = interestRate / 100 / 12;
    const mrDrop = (interestRate * (1 - dropRate / 100)) / 100 / 12;
    const bdNo = getYearlyBreakdown(presentValue, monthlyContribution, mrNo, numYears);
    const bdDrop = getYearlyBreakdown(presentValue, monthlyContribution, mrDrop, numYears);
    const res = getResidual(bdDrop, bdNo);
    return {
      stress: allYears.map((_, i) => bdNo[i].balance - bdDrop[i].balance),
      residual: res.map(r => r.lost),
    };
  }
  function calc2(d:any) {
    const { baseRevenue, growthRate, startYear: sy, totalYears, initialPercent } = d;
    const s:number[] = []; const
      r:number[] = [];
    allYears.forEach((y, idx) => {
      if (y < sy || idx >= totalYears) { s.push(0); r.push(0); } else {
        const i = y - sy;
        const rev = baseRevenue * (1 + growthRate) ** i;
        const drop = rev * (initialPercent / 100);
        s.push(-drop);
        const cum = allYears.slice(0, idx + 1).reduce((sum, yy, j) => {
          if (yy >= sy && j < totalYears) {
            const ii = yy - sy; const
              r2 = baseRevenue * (1 + growthRate) ** ii;
            return sum + r2 * (initialPercent / 100);
          }
          return sum;
        }, 0);
        r.push(-cum);
      }
    });
    return { stress: s, residual: r };
  }
  function calc3(d:any) {
    const { annualRate, events } = d;
    const s:number[] = []; const
      r:number[] = [];
    allYears.forEach(y => {
      const ev = events.find((e:any) => e.year === y);
      s.push(ev ? ev.amount : 0);
      const lost = events.reduce((sum:number, e:any) => (y > e.year
        ? sum + calculateCompoundInterest(e.amount, annualRate, y - e.year)
        : sum), 0);
      r.push(lost);
    });
    return { stress: s, residual: r };
  }
  function calc4(d:any) {
    const { initialExpense, increaseRate, returnRate } = d;
    const s:number[] = []; const
      r:number[] = [];
    allYears.forEach((_, i) => {
      const inc = initialExpense * (increaseRate / 100);
      s.push(inc);
      r.push(inc * ((1 + returnRate / 100) ** (i + 1) - 1));
    });
    return { stress: s, residual: r };
  }
  function calc5(d: any) {
    const { presentValue, interestRate, term, contributions, fullyFunded } = d;
    let bal = presentValue;
    const principals: number[] = [];
    for (let i = 0; i < term; i++) {
      const year = allYears[i];
      const c = contributions.find((e: any) => e.year === year)?.contribution || 0;
      const interest = +(bal * (interestRate / 100)).toFixed(2);
      bal = +(bal + interest + c).toFixed(2);
      principals.push(bal);
    }
    const totalYears = allYears.length;
    while (principals.length < totalYears) {
      principals.push(0);
    }

    const flags = Array(totalYears).fill(fullyFunded === 100);
    const residual = calculateResidualEffects(
      principals,
      interestRate,
      interestRate,
      totalYears,
      flags,
    ).map((r: any) => r.cumulativeLostEarnings);

    const stress = allYears.map((y) => contributions.find((e: any) => e.year === y)?.contribution || 0);
    return { stress, residual };
  }

  const computeByKey: Record<string, (d:any)=>{ stress:number[];residual:number[] }> = {
    1: calc1, 2: calc2, 3: calc3, 4: calc4, 5: calc5,
  };

  const handleSelect = (key:string) => (
    e:React.ChangeEvent<HTMLSelectElement>,
  ) => setSelected(s => ({ ...s, [key]: e.target.value }));

  return (
    <Container className="py-4">
      <h3 style={{ textAlign: 'center', textDecoration: 'underline' }}>Stress Test Sustainability Model (SM)</h3>
      <Card className="mb-4 p-3">
        <Row className="g-3">
          <Col md={4}>
            <Form.Label>Number of Years</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={numYears}
              onChange={e => { setNumYears(+e.target.value); setPageIdx(0); }}
            />
          </Col>
          <Col md={4} className="d-flex align-items-end justify-content-end">
            <Button variant="outline-primary" disabled={pageIdx === 0} onClick={() => setPageIdx(p => p - 1)}>
              ← Previous
            </Button>
            <Button
              variant="outline-primary"
              disabled={pageIdx >= totalPages - 1}
              onClick={() => setPageIdx(p => p + 1)}
              className="ms-2"
            >
              Next →
            </Button>
          </Col>
        </Row>
      </Card>

      <div style={{ overflowX: 'auto' }}>
        <Table bordered hover className="text-center align-middle">
          <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <tr>
              <th>Stress Test</th>
              <th>Version</th>
              <th>Decision Priorities</th>
              <th>Metric</th>
              {pageYears.map(y => <th key={y}>{y}</th>)}
            </tr>
          </thead>
          <tbody>
            {TESTS.map(({ key, label }) => {
              const list = lists[key] || [];
              const sel = selected[key] || '';
              const det = details[key];
              const loadingL = loadingList[key];
              const loadingD = loadingDetail[key];

              // 1) still loading the list of versions
              if (loadingL) {
                return (
                  <tr key={key}>
                    <td>{label}</td>
                    <td colSpan={pageYears.length + 3}>
                      <Spinner size="sm" animation="border" />
                      {' '}
                      Loading versions...
                    </td>
                  </tr>
                );
              }

              // 2) no saved scenarios
              if (list.length === 0) {
                return (
                  <tr key={key}>
                    <td>{label}</td>
                    <td colSpan={pageYears.length + 3}>
                      <em className="text-muted">No saved scenarios</em>
                    </td>
                  </tr>
                );
              }

              // 3) user has not yet chosen a version
              if (!sel) {
                return (
                  <tr key={key}>
                    <td>{label}</td>
                    <td>
                      {/* keep the dropdown always visible */}
                      <Form.Select size="sm" value={sel} onChange={handleSelect(key)}>
                        <option value="">— Select version —</option>
                        {list.map((s) => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                      </Form.Select>
                    </td>
                    <td colSpan={pageYears.length + 2}>
                      <em className="text-muted">Pending version selection</em>
                    </td>
                  </tr>
                );
              }

              // 4) version chosen, but detail is still loading
              if (loadingD || !det) {
                return (
                  <tr key={key}>
                    <td>{label}</td>
                    <td>
                      <Form.Select size="sm" value={sel} onChange={handleSelect(key)}>
                        <option value="">— Select version —</option>
                        {list.map((s) => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                      </Form.Select>
                    </td>
                    <td colSpan={pageYears.length + 2}>
                      <Spinner size="sm" animation="border" />
                      {' '}
                      Loading scenario...
                    </td>
                  </tr>
                );
              }

              // 5) we have the detail → compute and render
              const { stress, residual } = computeByKey[key](det);

              return (
                <Fragment key={key}>
                  <tr>
                    <td rowSpan={2}>{label}</td>
                    <td rowSpan={2}>
                      <Form.Select size="sm" value={sel} onChange={handleSelect(key)}>
                        {list.map((s) => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                      </Form.Select>
                    </td>
                    <td rowSpan={2}>{DECISION_LABEL[key]}</td>
                    <td>Stress Effect</td>
                    {stress.slice(pageIdx * pageSize, pageIdx * pageSize + pageSize).map((v, i) => (
                      <td key={i}>{formatCurrency(v)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Interest Lost</td>
                    {residual.slice(pageIdx * pageSize, pageIdx * pageSize + pageSize).map((v, i) => (
                      <td key={i}>{formatCurrency(v)}</td>
                    ))}
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}
