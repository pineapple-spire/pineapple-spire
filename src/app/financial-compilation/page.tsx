'use client';

import { useState } from 'react';
import { Col, Container, Row, Table, Form } from 'react-bootstrap';
import MultiplierInput from '@/components/MultiplierInput';
import ForecastTypeDropdown from '@/components/ForecastTypeDropdown';
import { computeMultiplier } from '@/lib/mathUtils';
import useFinancialData from '@/lib/useFinancialData';

// Define the years for the table
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

// Example of financial categories for the assets table
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

// Example of other financial tables (e.g., Liabilities, Income, etc.)
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

// Helper function to generate random financial data
const generateRandomFinancialData = (year: number) => ({
  year,
  revenue: 100,
  costContracting: 200,
  overhead: 300,
  salariesAndBenefits: 400,
  rentAndOverhead: 100,
  depreciationAndAmortization: 500,
  interest: 600,
  interestIncome: 700,
  interestExpense: 800,
  gainOnDisposalAssets: 900,
  otherIncome: 1000,
  incomeTaxes: 100,
  cashAndEquivalents: 200,
  accountsReceivable: 300,
  inventory: 400,
  propertyPlantAndEquipment: 500,
  investment: 600,
  accountsPayable: 700,
  currentDebtService: 800,
  taxesPayable: 900,
  longTermDebtService: 1000,
  loansPayable: 100,
  equityCapital: 200,
  retainedEarnings: 300,
});

const FinancialCompilation = () => {
  const data = generateRandomFinancialData(2025);
  const financialData = useFinancialData(data);
  const [randomData, setRandomData] = useState(financialData);

  const toNumber = (value: string | number): number => {
    if (typeof value === 'string') {
      // If it's a string, try converting it to a number
      const parsedValue = parseFloat(value);
      return Number.isNaN(parsedValue) ? 0 : parsedValue; // Return 0 if the conversion fails
    }
    return value; // If it's already a number, just return it
  };

  const categoryDataMap: Record<string, number> = {
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

    // Apply the multiplier to all forecast type "Multiplier"
    for (const name in categoryDataMap) {
      if (forecastTypes[name] === 'Multiplier') {
        const baseValue = categoryDataMap[name];
        // Compute the updated value with the multiplier
        const updatedValue = computeMultiplier(newMultiplier, baseValue);

        // Update the randomData object with the new value
        categoryDataMap[name] = updatedValue;
      }
    }

    // Update the state with modified data
    setRandomData(randomData);
  };

  const getCategoryData = (name: string) => {
    const baseValue = categoryDataMap[name] ?? 'N/A';
    // Apply the multiplier for rows marked as 'Multiplier'
    if (forecastTypes[name] === 'Multiplier') {
      const newValue = computeMultiplier(multiplier, baseValue);
      return newValue;
    }
    return baseValue;
  };

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

      {/* Toggle for showing assets table */}
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

      {/* Conditionally render tables based on the toggled checkboxes */}
      {showIncome && (
        <Row>
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
                {incomeCategories.map((name) => (
                  <tr key={name}>
                    <td>
                      {name === 'Revenue' ? (
                        <ForecastTypeDropdown
                          onChange={(newForecastType) => handleForecastTypeChange(name, newForecastType)}
                        />
                      ) : null}
                    </td>
                    <td>{name}</td>
                    {years.map((year) => (
                      <td key={`${name}-${year}`}>{getCategoryData(name)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Row>
      )}

      {showGoods && (
        <Row>
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
                {goodsCategories.map((name) => (
                  <tr key={name}>
                    <td>
                      {!name.includes('Gross') && (
                        <ForecastTypeDropdown
                          onChange={(newForecastType) => handleForecastTypeChange(name, newForecastType)}
                        />
                      )}
                    </td>
                    <td>{name}</td>
                    {years.map((year) => (
                      <td key={`${name}-${year}`}>{getCategoryData(name)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Row>
      )}

      {showOperating && (
        <Row>
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
                {operatingCategories.map((name) => (
                  <tr key={name}>
                    <td>
                      {!(name.includes('Expenses') || name.includes('%')) ? (
                        <ForecastTypeDropdown
                          onChange={(newForecastType) => handleForecastTypeChange(name, newForecastType)}
                        />
                      ) : null}
                    </td>
                    <td>{name}</td>
                    {years.map((year) => (
                      <td key={`${name}-${year}`}>{getCategoryData(name)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Row>
      )}

      {showAssets && (
        <Row>
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
                {assetsCategories.map((name) => (
                  <tr key={name}>
                    <td>
                      {!name.includes('Total') ? (
                        <ForecastTypeDropdown
                          onChange={(newForecastType) => handleForecastTypeChange(name, newForecastType)}
                        />
                      ) : null}
                    </td>
                    <td>{name}</td>
                    {years.map((year) => (
                      <td key={`${name}-${year}`}>{getCategoryData(name)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Row>
      )}

      {showLiabilities && (
        <Row>
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
                {liabilitiesCategories.map((name) => (
                  <tr key={name}>
                    <td>
                      {!name.includes('Total') ? (
                        <ForecastTypeDropdown
                          onChange={(newForecastType) => handleForecastTypeChange(name, newForecastType)}
                        />
                      ) : null}
                    </td>
                    <td>{name}</td>
                    {years.map((year) => (
                      <td key={`${name}-${year}`}>{getCategoryData(name)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Row>
      )}
    </Container>
  );
};

export default FinancialCompilation;
