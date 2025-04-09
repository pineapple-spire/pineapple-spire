'use client';

import { useState } from 'react';
import { Col, Container, Row, Table, Form } from 'react-bootstrap';
import MultiplierInput from '@/components/MultiplierInput';
import ForecastTypeDropdown from '@/components/ForecastTypeDropdown';
import { computeMultiplier, computeAverage } from '@/lib/mathUtils';

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
  const [heatmapOn, setHeatmapOn] = useState<'true' | 'false'>('true');

  const [auditedData, setAuditedData] = useState(initialData || []);
  const auditDataLength = auditedData.length - 1;
  const [baseAuditRecord] = useState(auditedData[auditDataLength] || {});

  // Map the audited data to categories
  const categoryDataMap: Record<string, number | string> = {
    Revenue: baseAuditRecord.revenue,
    'Net Sales': baseAuditRecord.netSales,
    'Cost of Contracting': baseAuditRecord.costContracting,
    Overhead: baseAuditRecord.overhead,
    'Cost of Goods Sold': baseAuditRecord.costGoodsSold,
    'Gross Profit': baseAuditRecord.grossProfit,
    'Gross Margin %': baseAuditRecord.grossMarginPercent,
    'Interest Income': baseAuditRecord.interestIncome,
    'Interest Expense': baseAuditRecord.interestExpense,
    'Gain (loss) on Disposal of Assets': baseAuditRecord.gainOnDisposalAssets,
    'Other Income (expense)': baseAuditRecord.otherIncome,
    'Total Other Income (expense)': baseAuditRecord.totalOtherIncome,
    'Total Other Income (expense) %': baseAuditRecord.operatingExpensesPercent,
    'Income (loss) before Income Taxes': baseAuditRecord.incomeBeforeIncomeTaxes,
    'Pre-tax Income %': baseAuditRecord.preTaxIncomePercent,
    'Income Taxes': baseAuditRecord.incomeTaxes,
    'Net Income (loss)': baseAuditRecord.netIncome,
    'Net Income (loss) %': baseAuditRecord.netIncomePercent,
    'Salaries & Benefits': baseAuditRecord.salariesAndBenefits,
    'Rent & Overhead': baseAuditRecord.rentAndOverhead,
    'Depreciation & Amortization': baseAuditRecord.depreciationAndAmortization,
    Interest: baseAuditRecord.interest,
    'Total Operating Expenses': baseAuditRecord.totalOperatingExpenses,
    'Operating Expenses %': baseAuditRecord.operatingExpensesPercent,
    'Profit (loss) from Operations': baseAuditRecord.profitFromOperations,
    'Profit (loss) from Operations %': baseAuditRecord.profitFromOperationsPercent,
    'Cash & Cash Equivalents': baseAuditRecord.cashAndEquivalents,
    'Accounts Receivable': baseAuditRecord.accountsReceivable,
    Inventory: baseAuditRecord.inventory,
    'Total Current Assets': baseAuditRecord.totalCurrentAssets,
    'Property, Plant, & Equipment': baseAuditRecord.propertyPlantAndEquipment,
    Investment: baseAuditRecord.investment,
    'Total Long Term Assets': baseAuditRecord.totalLongTermAssets,
    'Total Assets': baseAuditRecord.totalAssets,
    'Accounts Payable': baseAuditRecord.accountsPayable,
    'Current Debt Service': baseAuditRecord.currentDebtService,
    'Taxes Payable': baseAuditRecord.taxesPayable,
    'Total Current Liabilities': baseAuditRecord.totalCurrentLiabilities,
    'Long Term Debt Service': baseAuditRecord.longTermDebtService,
    'Loans Payable': baseAuditRecord.loansPayable,
    'Total Long Term Liabilities': baseAuditRecord.totalLongTermLiabilities,
    'Total Liabilities': baseAuditRecord.totalLiabilities,
    'Equity Capital': baseAuditRecord.equityCapital,
    'Retained Earnings': baseAuditRecord.retainedEarnings,
    'Total Stockholder Equity': baseAuditRecord.totalStockholdersEquity,
    'Total Liabilities & Equity': baseAuditRecord.totalLiabilitiesAndEquity,
  };

  const auditedDataKeyMap: Record<string, string> = {
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

    setAuditedData((prevData: any) => {
      if (!prevData.length) return prevData;

      const updatedLastAuditRecord = { ...prevData[prevData.length - 1] };

      for (const name in categoryDataMap) {
        if (forecastTypes[name] === 'Multiplier') {
          const dataKey = auditedDataKeyMap[name];
          if (dataKey) {
            const baseValue = baseAuditRecord[dataKey];
            updatedLastAuditRecord[dataKey] = computeMultiplier(newMultiplier, Number(baseValue) || 0);
          }
        }
      }

      return [...prevData.slice(0, -1), updatedLastAuditRecord];
    });
  };

  const getCategoryData = (name: string) => {
    const baseValue = categoryDataMap[name] ?? 0;
    if (forecastTypes[name] === 'Multiplier') {
      return computeMultiplier(multiplier, baseValue);
    }
    if (forecastTypes[name] === 'Average') {
      return computeAverage(auditedDataKeyMap, name, auditedData);
    }
    return baseValue;
  };

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
            const rowValues = years.map((year, index) => {
              const forecastType = forecastTypes[name];
              const baseValue = Number(getCategoryData(name));

              if (forecastType === 'Multiplier') {
                return getForecastValueForYear(baseValue, index, multiplier);
              }
              return baseValue;
            });

            const rowMax = Math.max(...rowValues.map((val) => Math.abs(val)), 0);
            return (
              <tr key={name}>
                <td>
                  {!(name === 'Net Sales'
                  || name.includes('Goods')
                  || name.includes('Gross')
                  || name.includes('%')
                  || name.includes('Total')
                  || name.includes('Profit')
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
