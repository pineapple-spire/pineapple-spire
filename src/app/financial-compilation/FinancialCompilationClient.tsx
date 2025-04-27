'use client';

import { useState } from 'react';
import { Col, Container, Row, Table, Form, ButtonGroup, ToggleButton } from 'react-bootstrap';
import MultiplierInput from '@/components/MultiplierInput';
import ForecastTypeDropdown from '@/components/ForecastTypeDropdown';
import LinePlot from '@/components/LinePlot';
import { computeMultiplier, computeAverage, calculateFinancialData } from '@/lib/mathUtils';
import { FinancialDataValues } from '@/lib/dbActions';

// Years to forecast (Default: Starting from 2025)
const years = Array.from({ length: 10 }, (_, i) => 2025 + i);

// Categories for the financial data
const incomeCategories = [
  'Revenue',
  'Net Sales',
];
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
  'Cash & Cash Equivalents',
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

const palette = [
  '#4e73df', // blue
  '#1cc88a', // green
  '#36b9cc', // cyan
  '#f6c23e', // yellow
  '#e74a3b', // red
  '#858796', // gray
  '#fd7e14', // orange
  '#6f42c1', // purple
];

const formatForecastCell = (value: number | string, name: string) => {
  if (typeof value !== 'number') {
    return value;
  }
  if (name.includes('%')) {
    return `${(value * 100).toFixed(1)}%`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
};

const getHeatmapStyle = (value: number | string, rowMax: number) => {
  if (typeof value !== 'number' || rowMax === 0) return {};
  const intensity = Math.min(Math.abs(value) / rowMax, 1);
  const baseColor = value >= 0 ? '0, 128, 0' : '128, 0, 0';
  return {
    backgroundColor: `rgba(${baseColor}, ${intensity})`,
    color: intensity > 0.4 ? 'white' : 'black',
    textShadow: intensity > 0.4 ? '0 0 3px rgba(0,0,0,0.5)' : 'none',
  };
};

const FinancialCompilationClient: React.FC<{ initialData: FinancialDataValues[] }> = ({ initialData }) => {
  const [heatmapOn, setHeatmapOn] = useState<'true' | 'false'>('true');
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  const forecastedData = initialData.map(item => calculateFinancialData(item));
  const baseAuditRecord = forecastedData.slice(-1)[0] || {};

  const auditedDataKeyMap: Record<string, keyof typeof baseAuditRecord> = {
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
    'Total Other Income (expense) %': 'operatingExpensesPercent',
    'Income (loss) before Income Taxes': 'incomeBeforeIncomeTaxes',
    'Pre-tax Income %': 'preTaxIncomePercent',
    'Income Taxes': 'incomeTaxes',
    'Net Income (loss)': 'netIncome',
    'Salaries & Benefits': 'salariesAndBenefits',
    'Rent & Overhead': 'rentAndOverhead',
    'Depreciation & Amortization': 'depreciationAndAmortization',
    Interest: 'interest',
    'Total Operating Expenses': 'totalOperatingExpenses',
    'Operating Expenses %': 'operatingExpensesPercent',
    'Profit (loss) from Operations': 'profitFromOperations',
    'Profit (loss) from Operations %': 'profitFromOperationsPercent',
    'Cash & Cash Equivalents': 'cashAndEquivalents',
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

  const getForecastValueForYear = (
    baseValue: number,
    yearIndex: number,
    multiplier: number,
    forecastType: string | undefined,
    name: string,
  ): number => {
    if (forecastType === 'Multiplier') {
      let val = baseValue;
      for (let i = 0; i < yearIndex; i++) {
        val = computeMultiplier(multiplier, val);
      }
      return val;
    }
    return computeAverage(auditedDataKeyMap, name, initialData);
  };

  const [showIncome, setShowIncome] = useState(true);
  const [showGoods, setShowGoods] = useState(true);
  const [showOtherIncome, setShowOtherIncome] = useState(true);
  const [showOperating, setShowOperating] = useState(true);
  const [showAssets, setShowAssets] = useState(true);
  const [showLiabilities, setShowLiabilities] = useState(true);
  const [multiplier, setMultiplier] = useState(1);
  const [forecastTypes, setForecastTypes] = useState<Record<string, string>>({});

  const handleForecastTypeChange = (category: string, newType: string) => {
    setForecastTypes(prev => ({ ...prev, [category]: newType }));
  };
  const handleMultiplierChange = (m: number) => setMultiplier(m);

  const getForecastedValues = () => {
    const values: Record<number, any> = {};
    const prior = [...forecastedData];
    years.forEach((_, idx) => {
      const record: any = {};
      Object.entries(auditedDataKeyMap).forEach(([label, key]) => {
        const type = forecastTypes[label];
        const baseVal = forecastedData[0][key] ?? 0;
        record[key] = type === 'Average'
          ? computeAverage(auditedDataKeyMap, label, prior)
          : getForecastValueForYear(Number(baseVal), idx + 1, multiplier, type, label);
      });
      const calc = calculateFinancialData(record);
      values[idx] = calc;
      prior.push(calc);
    });
    return values;
  };

  const valuesForYear = getForecastedValues();

  const renderTable = (categories: string[]) => (
    <div className="my-3" style={{ overflowX: 'auto', width: '100%' }}>
      <Table
        striped
        bordered
        hover
        className="table-modern"
        style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '0.9rem' }}
      >
        <thead>
          <tr>
            <th>Select Forecast Type</th>
            <th>Name</th>
            {years.map(y => <th key={y}>{y}</th>)}
          </tr>
        </thead>
        <tbody>
          {categories.map(name => {
            const rowVals = years.map((_, i) => valuesForYear[i][auditedDataKeyMap[name]]);
            const rowMax = Math.max(...rowVals.map(v => Math.abs(Number(v))), 0);
            return (
              <tr key={name}>
                <td>
                  {!['Net Sales'].includes(name) && !name.includes('%') && !name.includes('Total') && (
                    <ForecastTypeDropdown onChange={type => handleForecastTypeChange(name, type)} />
                  )}
                </td>
                <td>{name}</td>
                {rowVals.map((val, i) => (
                  <td
                    key={i}
                    style={heatmapOn === 'true'
                      ? { ...getHeatmapStyle(val, rowMax), fontSize: '0.75rem' } : { fontSize: '0.75rem' }}
                  >
                    {formatForecastCell(val, name)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );

  const renderChart = (cats: string[]) => {
    const datasets = cats.map((name, idx) => ({
      label: name,
      data: years.map((_, i) => valuesForYear[i][auditedDataKeyMap[name]]),
      borderColor: palette[idx % palette.length],
      backgroundColor: palette[idx % palette.length],
      tension: 0.3,
      pointRadius: 3,
    }));
    const data = { labels: years.map(String), datasets };
    const options = {
      responsive: true,
      layout: { padding: 20 },
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, padding: 8 } },
        title: { display: true, text: `${cats[0]} – ${cats[cats.length - 1]}`, font: { size: 18, weight: '600' } },
        tooltip: { mode: 'index', intersect: false, padding: 10 },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#333', font: { size: 12 } } },
        y: { grid: { color: '#ddd' }, ticks: { color: '#333', font: { size: 12 }, callback: (v: any) => `$${v}` } },
      },
    };

    return (
      <div
        className="my-4 p-4"
        style={{ backgroundColor: '#fff',
          borderRadius: 12,
          boxShadow: '0 6px 18px rgba(0,0,0,0.1)' }}
      >
        <LinePlot data={data} options={options} style={{}} />
      </div>
    );
  };

  return (
    <Container>
      <Row className="m-3 align-items-center">
        <Col>
          <h3 style={{ fontWeight: 600, color: '#4e73df' }}>Financial Compilation</h3>
          <p className="text-muted" style={{ fontSize: '1rem' }}>
            Analyze the different types of financial data and their forecast.
          </p>
        </Col>
      </Row>
      {/* View mode toggle */}
      <Row className="mb-3">
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
          </ButtonGroup>
        </Col>
        <Col>
          {viewMode === 'table' && (
          <Form.Check
            type="switch"
            id="heatmap-switch"
            checked={heatmapOn === 'true'}
            onChange={() => setHeatmapOn(heatmapOn === 'true' ? 'false' : 'true')}
            label={heatmapOn === 'true' ? 'Hide Heatmap' : 'Show Heatmap'}
          />
          )}
        </Col>
        <Col><MultiplierInput onMultiplierChange={handleMultiplierChange} /></Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Check
            type="checkbox"
            label="Income Statement"
            checked={showIncome}
            onChange={() => setShowIncome(s => !s)}
          />
        </Col>
        <Col>
          <Form.Check
            type="checkbox"
            label="Costs of Goods"
            checked={showGoods}
            onChange={() => setShowGoods(s => !s)}
          />
        </Col>
        <Col>
          <Form.Check
            type="checkbox"
            label="Other Income"
            checked={showOtherIncome}
            onChange={() => setShowOtherIncome(s => !s)}
          />
        </Col>
        <Col>
          <Form.Check
            type="checkbox"
            label="Operating Expenses"
            checked={showOperating}
            onChange={() => setShowOperating(s => !s)}
          />
        </Col>
        <Col>
          <Form.Check
            type="checkbox"
            label="Assets"
            checked={showAssets}
            onChange={() => setShowAssets(s => !s)}
          />
        </Col>
        <Col>
          <Form.Check
            type="checkbox"
            label="Liabilities & Equity"
            checked={showLiabilities}
            onChange={() => setShowLiabilities(s => !s)}
          />
        </Col>
      </Row>

      {viewMode === 'table' && (
        <>
          {showIncome && renderTable(incomeCategories)}
          {showGoods && renderTable(goodsCategories)}
          {showOtherIncome && renderTable(otherIncomeCategories)}
          {showOperating && renderTable(operatingCategories)}
          {showAssets && renderTable(assetsCategories)}
          {showLiabilities && renderTable(liabilitiesCategories)}
        </>
      )}
      {viewMode === 'chart' && (
        <>
          {showIncome && renderChart(incomeCategories)}
          {showGoods && renderChart(goodsCategories)}
          {showOtherIncome && renderChart(otherIncomeCategories)}
          {showOperating && renderChart(operatingCategories)}
          {showAssets && renderChart(assetsCategories)}
          {showLiabilities && renderChart(liabilitiesCategories)}
        </>
      )}
    </Container>
  );
};

export default FinancialCompilationClient;
