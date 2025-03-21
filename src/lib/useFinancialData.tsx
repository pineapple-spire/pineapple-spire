'use client';

import { useState } from 'react';

interface FinancialDataValues {
  year: number;
  revenue: number;
  costContracting: number;
  overhead: number;
  salariesAndBenefits: number;
  rentAndOverhead: number;
  depreciationAndAmortization: number;
  interest: number;
  interestIncome: number;
  interestExpense: number;
  gainOnDisposalAssets: number;
  otherIncome: number;
  incomeTaxes: number;
  cashAndEquivalents: number;
  accountsReceivable: number;
  inventory: number;
  propertyPlantAndEquipment: number;
  investment: number;
  accountsPayable: number;
  currentDebtService: number;
  taxesPayable: number;
  longTermDebtService: number;
  loansPayable: number;
  equityCapital: number;
  retainedEarnings: number;
}

const useFinancialData = (inputData: FinancialDataValues) => {
  const [data, setData] = useState({ ...inputData });
  const setField = (field:string, value:number) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // Level 1 Computed Values
  const netSales = data.revenue;
  const costGoodsSold = data.costContracting + data.overhead;
  // eslint-disable-next-line max-len
  const totalOperatingExpenses = data.salariesAndBenefits + data.rentAndOverhead + data.depreciationAndAmortization + data.interest;
  const totalOtherIncome = data.interestIncome + data.interestExpense + data.gainOnDisposalAssets + data.otherIncome;
  const totalCurrentAssets = data.cashAndEquivalents + data.accountsReceivable + data.inventory;
  const totalLongTermAssets = data.propertyPlantAndEquipment + data.investment;
  const totalCurrentLiabilities = data.accountsPayable + data.currentDebtService + data.taxesPayable;
  const totalLongTermLiabilities = data.longTermDebtService + data.loansPayable;
  const totalStockholdersEquity = data.equityCapital + data.retainedEarnings;

  // Level 2 Computed Values
  const grossProfit = netSales - costGoodsSold;
  const profitFromOperations = grossProfit - totalOperatingExpenses;
  const incomeBeforeIncomeTaxes = profitFromOperations + totalOtherIncome;
  const netIncome = incomeBeforeIncomeTaxes + data.incomeTaxes;
  const totalAssets = totalCurrentAssets + totalLongTermAssets;
  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;
  const totalLiabilitiesAndEquity = totalLiabilities + totalStockholdersEquity;

  // Level 3 Computed Values: Percents
  const grossMarginPercent = (netSales === 0) ? '' : grossProfit / netSales;
  const operatingExpensesPercent = (netSales === 0) ? '' : totalOperatingExpenses / netSales;
  const profitFromOperationsPercent = (netSales === 0) ? '' : profitFromOperations / netSales;
  const totalOtherIncomePercent = (netSales === 0) ? '' : totalOtherIncome / netSales;
  const preTaxIncomePercent = (netSales === 0) ? '' : incomeBeforeIncomeTaxes / netSales;
  const netIncomePercent = (netSales === 0) ? '' : netIncome / netSales;

  // Returns an object that has all fields: the ones from the model as well as the computed values.
  return {
    ...data,
    netSales,
    costGoodsSold,
    totalOperatingExpenses,
    totalOtherIncome,
    totalCurrentAssets,
    totalLongTermAssets,
    totalCurrentLiabilities,
    totalLongTermLiabilities,
    totalStockholdersEquity,
    grossProfit,
    profitFromOperations,
    incomeBeforeIncomeTaxes,
    netIncome,
    totalAssets,
    totalLiabilities,
    totalLiabilitiesAndEquity,
    grossMarginPercent,
    operatingExpensesPercent,
    profitFromOperationsPercent,
    totalOtherIncomePercent,
    preTaxIncomePercent,
    netIncomePercent,
    setField,
  };
};

export default useFinancialData;
