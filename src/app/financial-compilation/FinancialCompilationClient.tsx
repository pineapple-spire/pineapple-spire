'use client';

import React, { useState } from 'react';
import {
  Col,
  Container,
  Row,
  Table,
  Form,
  ButtonGroup,
  ToggleButton,
  InputGroup,
  Button,
} from 'react-bootstrap';
import ForecastTypeDropdown from '@/components/ForecastTypeDropdown';
import LinePlot from '@/components/LinePlot';
import {
  computeMultiplier,
  computeAverage,
  calculateFinancialData,
  formatCurrency,
} from '@/lib/mathUtils';
import swal from 'sweetalert';
import { FinancialDataValues } from '@/lib/dbActions';

const incomeCategories = ['Revenue', 'Net Sales'];
const goodsCategories = [
  'Cost of Contracting',
  'Overhead',
  'Cost of Goods Sold',
  'Gross Profit',
  'Gross Margin %',
];
const otherIncomeCategories = [
  'Interest Income',
  'Interest Expense',
  'Gain (loss) on Disposal of Assets',
  'Other Income (expense)',
  'Total Other Income (expense)',
  'Total Other Income (expense) %',
  'Income (loss) before Income Taxes',
  'Pre-tax Income %',
  'Income Taxes',
  'Net Income (loss)',
  'Net Income (loss) %',
];
const operatingCategories = [
  'Salaries & Benefits',
  'Rent & Overhead',
  'Depreciation & Amortization',
  'Interest',
  'Total Operating Expenses',
  'Operating Expenses %',
  'Profit (loss) from Operations',
  'Profit (loss) from Operations %',
];
const assetsCategories = [
  'Cash and Equivalents',
  'Accounts Receivable',
  'Inventory',
  'Total Current Assets',
  'Property, Plant, & Equipment',
  'Investment',
  'Total Long Term Assets',
  'Total Assets',
];
const liabilitiesCategories = [
  'Accounts Payable',
  'Current Debt Service',
  'Taxes Payable',
  'Total Current Liabilities',
  'Long Term Debt Service',
  'Loans Payable',
  'Total Long Term Liabilities',
  'Total Liabilities',
  'Equity Capital',
  'Retained Earnings',
  'Total Stockholder Equity',
  'Total Liabilities & Equity',
];

const allCategories = [
  ...incomeCategories,
  ...goodsCategories,
  ...otherIncomeCategories,
  ...operatingCategories,
  ...assetsCategories,
  ...liabilitiesCategories,
];

const excluded = [
  'Net Sales',
  'Cost of Goods Sold',
  'Gross Profit',
  'Income (loss) before Income Taxes',
  'Net Income (loss)',
];
const canForecast = (label: string) => !excluded.includes(label)
  && !label.includes('%')
  && !label.includes('Total')
  && !label.includes('Profit (loss)');

export default function FinancialCompilationClient({
  initialData,
}: {
  initialData: FinancialDataValues[];
}) {
  const [startYear] = useState<number>(2025);
  const [numYears, setNumYears] = useState<number>(8);
  const years = Array.from({ length: numYears }, (_, i) => startYear + i);

  const forecastedData = initialData.map((row) => calculateFinancialData(row));
  const baseAuditRecord = forecastedData[forecastedData.length - 1] || {};
  const keyMap: Record<string, keyof typeof baseAuditRecord> = {
    Revenue: 'revenue',
    'Net Sales': 'netSales',
    'Cost of Contracting': 'costContracting',
    Overhead: 'overhead',
    'Cost of Goods Sold': 'costGoodsSold',
    'Gross Profit': 'grossProfit',
    'Gross Margin %': 'grossMarginPercent',
    'Interest Income': 'interestIncome',
    'Interest Expense': 'interestExpense',
    'Gain (loss) on Disposal of Assets': 'gainOnDisposalAssets',
    'Other Income (expense)': 'otherIncome',
    'Total Other Income (expense)': 'totalOtherIncome',
    'Total Other Income (expense) %': 'totalOtherIncomePercent',
    'Income (loss) before Income Taxes': 'incomeBeforeIncomeTaxes',
    'Pre-tax Income %': 'preTaxIncomePercent',
    'Income Taxes': 'incomeTaxes',
    'Net Income (loss)': 'netIncome',
    'Net Income (loss) %': 'netIncomePercent',
    'Salaries & Benefits': 'salariesAndBenefits',
    'Rent & Overhead': 'rentAndOverhead',
    'Depreciation & Amortization': 'depreciationAndAmortization',
    Interest: 'interest',
    'Total Operating Expenses': 'totalOperatingExpenses',
    'Operating Expenses %': 'operatingExpensesPercent',
    'Profit (loss) from Operations': 'profitFromOperations',
    'Profit (loss) from Operations %': 'profitFromOperationsPercent',
    'Cash and Equivalents': 'cashAndEquivalents',
    'Accounts Receivable': 'accountsReceivable',
    Inventory: 'inventory',
    'Total Current Assets': 'totalCurrentAssets',
    'Property, Plant, & Equipment': 'propertyPlantAndEquipment',
    Investment: 'investment',
    'Total Long Term Assets': 'totalLongTermAssets',
    'Total Assets': 'totalAssets',
    'Accounts Payable': 'accountsPayable',
    'Current Debt Service': 'currentDebtService',
    'Taxes Payable': 'taxesPayable',
    'Total Current Liabilities': 'totalCurrentLiabilities',
    'Long Term Debt Service': 'longTermDebtService',
    'Loans Payable': 'loansPayable',
    'Total Long Term Liabilities': 'totalLongTermLiabilities',
    'Total Liabilities': 'totalLiabilities',
    'Equity Capital': 'equityCapital',
    'Retained Earnings': 'retainedEarnings',
    'Total Stockholder Equity': 'totalStockholdersEquity',
    'Total Liabilities & Equity': 'totalLiabilitiesAndEquity',
  };
  const forecastableLabels = allCategories.filter(canForecast);

  const [showIncome, setShowIncome] = useState(true);
  const [showGoods, setShowGoods] = useState(true);
  const [showOtherIncome, setShowOtherIncome] = useState(true);
  const [showOperating, setShowOperating] = useState(true);
  const [showAssets, setShowAssets] = useState(true);
  const [showLiabilities, setShowLiabilities] = useState(true);

  const [heatmapOn, setHeatmapOn] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [forecastTypes, setForecastTypes] = useState<
  Record<string, 'Multiplier' | 'Average'>
  >(
    () => Object.fromEntries(
      forecastableLabels.map((label) => [label, 'Average']),
    ) as Record<string, 'Multiplier' | 'Average'>,
  );
  const [forecastMultipliers, setForecastMultipliers] = useState<
  Record<string, number>
  >(
    () => Object.fromEntries(
      forecastableLabels.map((label) => [label, 5]),
    ) as Record<string, number>,
  );

  const formatForecastCell = (value: number | string, name: string) => {
    if (typeof value !== 'number') return value;
    if (name.includes('%')) return `${(value * 100).toFixed(1)}%`;
    return formatCurrency(value);
  };
  const getHeatmapStyle = (value: number | string, rowMax: number) => {
    if (typeof value !== 'number' || rowMax === 0) return {};
    const intensity = Math.min(Math.abs(value) / rowMax, 1);
    const baseColor = value >= 0 ? '0,128,0' : '128,0,0';
    return {
      backgroundColor: `rgba(${baseColor},${intensity})`,
      color: intensity > 0.4 ? 'white' : 'black',
      textShadow: intensity > 0.4 ? '0 0 3px rgba(0,0,0,0.5)' : undefined,
    };
  };

  const valuesForYear: Record<number, any> = (() => {
    const out: Record<number, any> = {};
    const prior: any[] = [...forecastedData];
    years.forEach((_, idx) => {
      const rec: any = {};
      Object.entries(keyMap).forEach(([label, key]) => {
        const type = forecastTypes[label];
        if (type === 'Average') {
          rec[key] = computeAverage(keyMap, label, prior);
        } else {
          let val = Number(forecastedData[0][key] ?? 0);
          const m = forecastMultipliers[label] ?? 1;
          for (let i = 0; i < idx + 1; i++) {
            val = computeMultiplier(m, val);
          }
          rec[key] = val;
        }
      });
      const calc = calculateFinancialData(rec);
      out[idx] = calc;
      prior.push(calc);
    });
    return out;
  })();

  const palette = ['#673ab7', '#3f51b5', '#2196f3', '#009688', '#4caf50', '#cddc39', '#ffeb3b', '#ff9800', '#ff5722'];

  const renderTableRow = (label: string, rowVals: number[]) => {
    const rowMax = Math.max(...rowVals.map((v) => Math.abs(v)), 0);
    const type = forecastTypes[label];
    return (
      <tr key={label}>
        <td style={{ width: 200 }}>
          {canForecast(label) && (
            <InputGroup size="sm">
              <ForecastTypeDropdown
                value={type}
                onChange={(t) => setForecastTypes((prev) => ({ ...prev, [label]: t as any }))}
              />
              {type === 'Multiplier' && (
                <>
                  <InputGroup.Text>x</InputGroup.Text>
                  <Form.Control
                    type="number"
                    size="sm"
                    step="0.1"
                    value={forecastMultipliers[label]}
                    onChange={(e) => {
                      const num = parseFloat(e.target.value) || 0;
                      setForecastMultipliers((prev) => ({ ...prev, [label]: num }));
                    }}
                  />
                </>
              )}
            </InputGroup>
          )}
        </td>
        <td>{label}</td>
        {rowVals.map((v, i) => (
          <td
            key={i}
            style={heatmapOn
              ? { ...getHeatmapStyle(v, rowMax), fontSize: '0.75rem' } : { fontSize: '0.75rem' }}
          >
            {formatForecastCell(v, label)}
          </td>
        ))}
      </tr>
    );
  };

  const renderTable = (cats: string[], title: string) => (
    <div className="my-3" style={{ overflowX: 'auto' }}>
      <h4 style={{ textDecoration: 'underline' }}>{title}</h4>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Type &amp; Value</th>
            <th>Name</th>
            {years.map((y) => <th key={y}>{y}</th>)}
          </tr>
        </thead>
        <tbody>
          {cats.map((label) => {
            const row = years.map((_, i) => valuesForYear[i][keyMap[label]]);
            return renderTableRow(label, row);
          })}
        </tbody>
      </Table>
    </div>
  );

  const renderChart = (cats: string[], title: string) => {
    const datasets = cats.map((label, idx) => ({
      label,
      data: years.map((_, i) => valuesForYear[i][keyMap[label]]),
      borderColor: palette[idx % palette.length],
      fill: false,
      tension: 0.3,
      pointRadius: 3,
    }));
    return (
      <div key={title} className="my-4 p-4 bg-white rounded shadow-sm">
        <LinePlot
          data={{ labels: years.map(String), datasets }}
          style={{}}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'bottom' as const },
              title: { display: true, text: title, font: { size: 18 } },
            },
            scales: {
              x: { grid: { display: false } },
              y: { grid: { color: '#ddd' }, ticks: { callback: (v: any) => `$${v}` } },
            },
          }}
          redraw
        />
      </div>
    );
  };

  return (
    <Container className="my-4">

      <Row className="g-3 mb-3">
        <Col md={3}>
          <Form.Group controlId="numYears">
            <Form.Label>Number of Years</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={numYears}
              onChange={(e) => setNumYears(Math.max(1, +e.target.value))}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col xs="auto">
          <Form.Check
            type="checkbox"
            label="Income Statement"
            checked={showIncome}
            onChange={() => setShowIncome(!showIncome)}
          />
        </Col>
        <Col xs="auto">
          <Form.Check
            type="checkbox"
            label="COGS & Goods"
            checked={showGoods}
            onChange={() => setShowGoods(!showGoods)}
          />
        </Col>
        <Col xs="auto">
          <Form.Check
            type="checkbox"
            label="Other Income"
            checked={showOtherIncome}
            onChange={() => setShowOtherIncome(!showOtherIncome)}
          />
        </Col>
        <Col xs="auto">
          <Form.Check
            type="checkbox"
            label="Operating Expenses"
            checked={showOperating}
            onChange={() => setShowOperating(!showOperating)}
          />
        </Col>
        <Col xs="auto">
          <Form.Check
            type="checkbox"
            label="Assets"
            checked={showAssets}
            onChange={() => setShowAssets(!showAssets)}
          />
        </Col>
        <Col xs="auto">
          <Form.Check
            type="checkbox"
            label="Liabilities & Equity"
            checked={showLiabilities}
            onChange={() => setShowLiabilities(!showLiabilities)}
          />
        </Col>
      </Row>

      <Row className="mb-3 align-items-center">
        <Col>
          <ButtonGroup>
            <ToggleButton
              id="view-table"
              type="radio"
              variant="outline-primary"
              name="viewMode"
              value="table"
              checked={viewMode === 'table'}
              onChange={() => setViewMode('table')}
            >
              Table
            </ToggleButton>
            <ToggleButton
              id="view-chart"
              type="radio"
              variant="outline-primary"
              name="viewMode"
              value="chart"
              checked={viewMode === 'chart'}
              onChange={() => setViewMode('chart')}
            >
              Charts
            </ToggleButton>
            <Button
              variant="success"
              onClick={async () => {
                const records = years.map((y, idx) => ({
                  year: y,
                  ...valuesForYear[idx],
                }));
                const res = await fetch('/api/save-forecast', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ records }),
                });
                const text = await res.text();
                let result;
                try {
                  result = JSON.parse(text);
                } catch {
                  swal('Error', 'Invalid response', 'error', { timer: 2000 });
                  return;
                }
                if (result.success) {
                  swal('Success', 'Forecast data saved!', 'success', { timer: 2000 });
                } else {
                  swal('Error', result.error || 'Save failed', 'error', { timer: 2000 });
                }
              }}
            >
              Save Forecast to Database
            </Button>
          </ButtonGroup>
        </Col>
        {viewMode === 'table' && (
          <Col xs="auto">
            <Form.Check
              type="switch"
              id="heatmap-switch"
              label={heatmapOn ? 'Hide Heatmap' : 'Show Heatmap'}
              checked={heatmapOn}
              onChange={() => setHeatmapOn(!heatmapOn)}
            />
          </Col>
        )}
      </Row>

      {viewMode === 'table' ? (
        <>
          {showIncome && renderTable(incomeCategories, 'Income Statement')}
          {showGoods && renderTable(goodsCategories, 'Cost of Goods Sold')}
          {showOperating && renderTable(operatingCategories, 'Operating Expenses')}
          {showOtherIncome && renderTable(otherIncomeCategories, 'Other Income (Expenses)')}
          {showAssets && renderTable(assetsCategories, 'Balance Sheet - Assets')}
          {showLiabilities && renderTable(liabilitiesCategories, 'Balance Sheet - Liabilities & Equity')}
        </>
      ) : (
        <>
          {showIncome && renderChart(incomeCategories, 'Income Statement')}
          {showGoods && renderChart(goodsCategories, 'Cost of Goods Sold')}
          {showOperating && renderChart(operatingCategories, 'Operating Expenses')}
          {showOtherIncome && renderChart(otherIncomeCategories, 'Other Income (Expenses)')}
          {showAssets && renderChart(assetsCategories, 'Balance Sheet - Assets')}
          {showLiabilities && renderChart(liabilitiesCategories, 'Balance Sheet - Liabilities & Equity')}
        </>
      )}
    </Container>
  );
}
