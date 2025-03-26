'use client';

import { useState } from 'react';
import { Col, Container, Row, Table, Form } from 'react-bootstrap';
import MultiplierInput from '@/components/MultiplierInput';
import ForecastTypeDropdown from '@/components/ForecastTypeDropdown';
import { computeMultiplier, toNumber } from '@/lib/mathUtils';
import useFinancialData from '@/lib/useFinancialData';

const years = Array.from({ length: 12 }, (_, i) => 2025 + i);

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

// Applies the multiplier repeatedly for each successive year.
const getForecastValueForYear = (baseValue: number, yearIndex: number, multiplier: number): number => {
  let value = baseValue;
  for (let i = 0; i < yearIndex; i++) {
    value = computeMultiplier(multiplier, value);
  }
  return value;
};

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
  const financialData = useFinancialData(initialData);
  const [randomData, setRandomData] = useState(financialData);

  const categoryDataMap: Record<string, number | string> = {
    Revenue: randomData.revenue,
    'Net Sales': randomData.netSales,
    'Cost of Contracting': randomData.costContracting,
    Overhead: randomData.overhead,
    'Cost of Goods Sold': randomData.costGoodsSold,
    'Gross Profit': randomData.grossProfit,
    'Gross Margin %': toNumber(randomData.grossMarginPercent),
    'Salaries & Benefits': randomData.salariesAndBenefits,
    'Rent & Overhead': randomData.rentAndOverhead,
    'Depreciation & Amortization': randomData.depreciationAndAmortization,
    Interest: randomData.interest,
    'Total Operating Expenses': randomData.totalOperatingExpenses,
    'Operating Expenses %': toNumber(randomData.operatingExpensesPercent),
    'Profit (loss) from Operations': randomData.profitFromOperations,
    'Profit (loss) from Operations %': toNumber(randomData.profitFromOperationsPercent),
    'Cash & Cash Equivalents': randomData.cashAndEquivalents,
    'Accounts Receivable': randomData.accountsReceivable,
    Inventory: randomData.inventory,
    'Total Current Assets': randomData.totalCurrentAssets,
    'Property, Plant, & Equipment': randomData.propertyPlantAndEquipment,
    Investment: randomData.investment,
    'Total Long Term Assets': randomData.totalLongTermAssets,
    'Total Assets': randomData.totalAssets,
    'Accounts Payable': randomData.accountsPayable,
    'Current Debt Service': randomData.currentDebtService,
    'Taxes Payable': randomData.taxesPayable,
    'Total Current Liabilities': randomData.totalCurrentLiabilities,
    'Long Term Debt Service': randomData.longTermDebtService,
    'Loans Payable': randomData.loansPayable,
    'Total Long Term Liabilities': randomData.totalLongTermLiabilities,
    'Total Liabilities': randomData.totalLiabilities,
    'Equity Capital': randomData.equityCapital,
    'Retained Earnings': randomData.retainedEarnings,
    'Total Stockholder Equity': randomData.totalStockholdersEquity,
    'Total Liabilities & Equity': randomData.totalLiabilitiesAndEquity,
  };

  const [showIncome, setShowIncome] = useState(true);
  const [showGoods, setShowGoods] = useState(true);
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
    for (const name in categoryDataMap) {
      if (forecastTypes[name] === 'Multiplier') {
        const baseValue = categoryDataMap[name];
        const updatedValue = computeMultiplier(newMultiplier, baseValue);
        categoryDataMap[name] = updatedValue;
      }
    }
    setRandomData({ ...randomData });
  };

  // If forecast type is set to 'Multiplier', we apply computeMultiplier once.
  const getCategoryData = (name: string) => {
    const baseValue = categoryDataMap[name] ?? 'N/A';
    if (forecastTypes[name] === 'Multiplier') {
      return computeMultiplier(multiplier, baseValue);
    }
    return baseValue;
  };

  // Each row computes forecast values per year.
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
            // For each row, compute the forecasted values for each year.
            const rowValues = years.map((year, index) => {
              const baseValue = Number(getCategoryData(name));
              return getForecastValueForYear(baseValue, index, multiplier);
            });
            // Compute the maximum absolute value in the row for heatmap scaling.
            const rowMax = Math.max(...rowValues.map((val) => Math.abs(val)), 0);
            return (
              <tr key={name}>
                <td>
                  {!(name !== 'Revenue' && name === 'Revenue')
                    && !name.includes('Total') && (
                      <ForecastTypeDropdown
                        onChange={(newForecastType) => handleForecastTypeChange(name, newForecastType)}
                      />
                  )}
                </td>
                <td>{name}</td>
                {rowValues.map((value, index) => (
                  <td key={`${name}-${years[index]}`} style={getHeatmapStyle(value, rowMax)}>
                    {value}
                  </td>
                ))}
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
      {showOperating && renderTable(operatingCategories)}
      {showAssets && renderTable(assetsCategories)}
      {showLiabilities && renderTable(liabilitiesCategories)}
    </Container>
  );
};

export default FinancialCompilationClient;
