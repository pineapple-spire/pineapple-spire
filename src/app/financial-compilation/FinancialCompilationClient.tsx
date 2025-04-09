'use client';

import { useState } from 'react';
import { Col, Container, Row, Table, Form } from 'react-bootstrap';
import MultiplierInput from '@/components/MultiplierInput';
import ForecastTypeDropdown from '@/components/ForecastTypeDropdown';
import { computeMultiplier, computeAverage, calculateFinancialData } from '@/lib/mathUtils';
import { FinancialDataValues } from '@/lib/dbActions';

// Years to forecast (Default: Starting from 2025)
const years = Array.from({ length: 12 }, (_, i) => 2025 + i);

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

// Updated heatmap style function that accepts the row's maximum value.
const getHeatmapStyle = (value: number | string, rowMax: number) => {
  if (typeof value !== 'number' || rowMax === 0) return {};

  if (value >= 0) {
    const intensity = Math.min(value / rowMax, 1);
    return { backgroundColor: `rgba(0, 128, 0, ${intensity})` };
  }
  const intensity = Math.min(Math.abs(value) / rowMax, 1);
  return { backgroundColor: `rgba(128, 0, 0, ${intensity})` };
};

// @ts-ignore
const FinancialCompilationClient = ({ initialData }) => {
  const [heatmapOn, setHeatmapOn] = useState<'true' | 'false'>('true');

  const forecastedData = initialData.map((item: FinancialDataValues) => {
    const base = calculateFinancialData(item);
    return base;
  });

  const baseAuditRecord = forecastedData[forecastedData.length - 1] || {};

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

  // Applies the forecast type repeatedly for each successive year.
  const getForecastValueForYear = (
    baseValue: number,
    yearIndex: number,
    multiplier: number,
    forecastType: string,
    name: string,
  ): number => {
    let value = baseValue;

    if (forecastType === 'Multiplier') {
      for (let i = 0; i < yearIndex; i++) {
        value = computeMultiplier(multiplier, value);
      }
    } else if (forecastType === 'Average') {
      value = computeAverage(auditedDataKeyMap, name, initialData);
    }
    return value;
  };

  const [showIncome, setShowIncome] = useState(true);
  const [showGoods, setShowGoods] = useState(true);
  const [showOtherIncome, setShowOtherIncome] = useState(true);
  const [showOperating, setShowOperating] = useState(true);
  const [showAssets, setShowAssets] = useState(true);
  const [showLiabilities, setShowLiabilities] = useState(true);

  const [multiplier, setMultiplier] = useState(1);

  const [forecastTypes, setForecastTypes] = useState<Record<string, string>>({});

  const handleForecastTypeChange = (category: string, newForecastType: string) => {
    setForecastTypes((prev) => ({
      ...prev,
      [category]: newForecastType,
    }));
  };

  const handleMultiplierChange = (newMultiplier: number) => {
    setMultiplier(newMultiplier);
  };

  const valuesForYear: Record<number, any> = {};

  const priorRecords: any[] = [...forecastedData];

  years.forEach((_, index) => {
    const newRecord: any = {};

    for (const [label, key] of Object.entries(auditedDataKeyMap)) {
      const type = forecastTypes[label];
      let value: number;

      if (type === 'Average') {
        value = computeAverage(auditedDataKeyMap, label, priorRecords);
      } else {
        const baseValue = forecastedData[0][key] ?? 0;
        value = getForecastValueForYear(Number(baseValue), index + 1, multiplier, type, label);
      }

      newRecord[key] = value;
    }

    const calculated = calculateFinancialData(newRecord);
    valuesForYear[index] = calculated;
    priorRecords.push(calculated); // Add to history for next year's average
  });

  const renderTable = (categories: string[]) => (
    <div className="my-3" style={{ overflowX: 'auto', width: '100%' }}>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Select Forecast Type</th>
            <th>Name</th>
            {years.map((year) => (
              <th key={year}>{year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((name) => {
            const rowValues = years.map((_, index) => valuesForYear[index][auditedDataKeyMap[name]]);

            const rowMax = Math.max(...rowValues.map((val) => Math.abs(Number(val))), 0);
            return (
              <tr key={name}>
                <td>
                  {!(name === 'Net Sales'
                  || name.includes('Goods')
                  || name.includes('Gross')
                  || name.includes('%')
                  || name.includes('Total')
                  || name.includes('Profit')
                  || name.includes('Income (loss) before Income Taxes')
                  || name.includes('Net Income (loss)')
                  ) && (
                  <ForecastTypeDropdown
                    onChange={(newForecastType) => handleForecastTypeChange(name, newForecastType)}
                  />
                  )}
                </td>
                <td>{name}</td>
                {heatmapOn === 'true' ? (
                  rowValues.map((value, index) => (
                    <td key={`${name}-${years[index]}`} style={getHeatmapStyle(value, rowMax)}>
                      {value}
                    </td>
                  ))
                ) : (
                  rowValues.map((value, index) => (
                    <td key={`${name}-${years[index]}`}>
                      {value}
                    </td>
                  ))
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );

  return (
    <Container>
      <Row className="m-3">
        <Col>
          <h3 style={{ fontWeight: '600', color: '#4e73df' }}>Financial Compilation</h3>
          <p className="text-muted" style={{ fontSize: '1rem' }}>
            Analyze the different types of financial data and their forecast.
          </p>
          {/* Toggle switch row */}
          <Row className="mb-6 d-flex align-items-center">
            <Col md={12} className="d-flex align-items-center">
              <Form.Check
                type="switch"
                id="heatmapOnToggle"
                className="me-2"
                checked={heatmapOn === 'false'}
                onChange={() => setHeatmapOn(heatmapOn === 'true' ? 'false' : 'true')}
              />
              <span>{heatmapOn === 'false' ? 'Show Heatmap' : 'Hide Heatmap'}</span>
            </Col>
          </Row>
        </Col>
        <Col>
          <MultiplierInput onMultiplierChange={handleMultiplierChange} />
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Check
            type="checkbox"
            label="Income Statement"
            checked={showIncome}
            onChange={() => setShowIncome((prev) => !prev)}
          />
        </Col>
        <Col>
          <Form.Check
            type="checkbox"
            label="Costs of Goods"
            checked={showGoods}
            onChange={() => setShowGoods((prev) => !prev)}
          />
        </Col>
        <Col>
          <Form.Check
            type="checkbox"
            label="Other Income"
            checked={showOtherIncome}
            onChange={() => setShowOtherIncome((prev) => !prev)}
          />
        </Col>
        <Col>
          <Form.Check
            type="checkbox"
            label="Operating Expenses"
            checked={showOperating}
            onChange={() => setShowOperating((prev) => !prev)}
          />
        </Col>
        <Col>
          <Form.Check
            type="checkbox"
            label="Assets"
            checked={showAssets}
            onChange={() => setShowAssets((prev) => !prev)}
          />
        </Col>
        <Col>
          <Form.Check
            type="checkbox"
            label="Liabilities & Equity"
            checked={showLiabilities}
            onChange={() => setShowLiabilities((prev) => !prev)}
          />
        </Col>
      </Row>

      {showIncome && renderTable(incomeCategories)}
      {showGoods && renderTable(goodsCategories)}
      {showOtherIncome && renderTable(otherIncomeCategories)}
      {showOperating && renderTable(operatingCategories)}
      {showAssets && renderTable(assetsCategories)}
      {showLiabilities && renderTable(liabilitiesCategories)}
    </Container>
  );
};

export default FinancialCompilationClient;
