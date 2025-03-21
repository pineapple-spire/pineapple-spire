/**
 * Calculates the earnings after compounding an
 * initial principal over a given number of years.
 *
 * @param principal - The initial amount e.g. loan.
 * @param annualReturnRate - The rate as a decimal.
 * @param years - The number of years to compound.
 * @returns The total earnings.
 */
export function calculateEarnings(
  principal: number,
  annualReturnRate: number,
  years: number,
) : number {
  return principal * (1 + annualReturnRate) ** years - principal;
}

/**
 * Calculates compound interest given principal, rate, and years.
 *
 * @param principal - The initial investment or loan amount.
 * @param annualReturnRate - Annual return rate as a percentage (e.g., 6.02 for 6.02%).
 * @param years - Number of years to calculate compound interest.
 * @returns The compounded value (principal + interest).
 */
export function calculateCompoundInterest(
  principal: number,
  annualReturnRate: number,
  years: number,
): number {
  const rateAsDecimal = annualReturnRate / 100;
  return principal * (1 + rateAsDecimal) ** years;
}

/**
 * Calculates the interest portion of a loan payment
 * for a given period. Equivalent to the IPMT in Excel.
 *
 * @param rate - The rate as a decimal.
 * @param period - The period for which we calculate interest (1-based index).
 * @param totalPeriods - The total number of periods (loan term in months).
 * @param presentValue - The loan amount (principal).
 * @returns The interest payment for the given period.
 */
export function calculateIPMT(
  rate: number,
  period: number,
  totalPeriods: number,
  presentValue: number,
) : number {
  if (period < 1 || period > totalPeriods) {
    throw new Error('Period must be between 1 and total periods.');
  }

  return -(presentValue * (1 + rate) ** (period - 1) * rate);
}

/**
 * Calculates the future value of an investment with monthly compounding, given:
 *
 *  @param presentValue - Initial lump sum.
 *  @param monthlyContribution - Amount contributed each month.
 *  @param monthlyRate - Monthly interest rate (if 4.2% APR, monthlyRate = 0.042/12).
 *  @param totalMonths - Total number of months in the investment period.
 *
 * Formula:
 *   FV = PV * (1 + i)^n + C * [((1 + i)^n - 1) / i]
 */
export function computeFutureValue(
  presentValue: number,
  monthlyContribution: number,
  monthlyRate: number,
  totalMonths: number,
): number {
  if (monthlyRate === 0) {
    return presentValue + monthlyContribution * totalMonths;
  }

  const fvLumpSum = presentValue * (1 + monthlyRate) ** totalMonths;
  const fvContributions = monthlyContribution * (((1 + monthlyRate) ** totalMonths - 1) / monthlyRate);

  return fvLumpSum + fvContributions;
}

/**
 * Format numbers as currency strings, e.g. 1234.56 -> "$1,234.56"
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
}

/**
 * Compute the multiplier based on the given value
 * This function is used for the financial compilation
 */
export function computeMultiplier(percent: number, value: any): number {
  const multiplierPercent = percent / 100;
  const calculatedValue = value + (value * multiplierPercent);
  return Math.round(calculatedValue);
}

/**
 * Casts a value to a number (if not already a number).
 */
export function toNumber(value: string | number): string | number {
  if (typeof value === 'string') {
    const parsedValue = parseFloat(value);
    return Number.isNaN(parsedValue) ? 0 : parsedValue;
  }
  return value.toFixed(2);
}

/**
 * Generates a random number in a given minmax range.
 */
export function randomNumber(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}

/**
 * Generates random data for the Financial Compilations page.
 */
export function generateRandomFinancialData(year: number) {
  const revenue = randomNumber(1_000_000, 5_000_000);
  const costContracting = randomNumber(200_000, 1_000_000);
  const overhead = randomNumber(150_000, 800_000);
  const salariesAndBenefits = randomNumber(500_000, 2_000_000);
  const rentAndOverhead = randomNumber(100_000, 500_000);
  const depreciationAndAmortization = randomNumber(50_000, 300_000);
  const interest = randomNumber(20_000, 100_000);
  const interestIncome = randomNumber(5_000, 30_000);
  const interestExpense = randomNumber(10_000, 50_000);
  const gainOnDisposalAssets = randomNumber(10_000, 100_000);
  const otherIncome = randomNumber(20_000, 150_000);
  const incomeTaxes = randomNumber(50_000, 300_000);
  const cashAndEquivalents = randomNumber(100_000, 1_000_000);
  const accountsReceivable = randomNumber(200_000, 1_500_000);
  const inventory = randomNumber(150_000, 800_000);
  const propertyPlantAndEquipment = randomNumber(1_000_000, 5_000_000);
  const investment = randomNumber(50_000, 500_000);
  const accountsPayable = randomNumber(100_000, 1_000_000);
  const currentDebtService = randomNumber(50_000, 300_000);
  const taxesPayable = randomNumber(20_000, 150_000);
  const longTermDebtService = randomNumber(100_000, 500_000);
  const loansPayable = randomNumber(50_000, 300_000);
  const equityCapital = randomNumber(1_000_000, 5_000_000);
  const retainedEarnings = randomNumber(200_000, 1_500_000);

  const netSales = Math.round(revenue * 0.97);
  const costGoodsSold = Math.round(revenue * (0.3 + Math.random() * 0.3));
  const grossProfit = revenue - costGoodsSold;
  const grossMarginPercent = Number(((grossProfit / revenue) * 100).toFixed(2));

  const totalCurrentAssets = cashAndEquivalents + accountsReceivable + inventory;
  const totalLongTermAssets = propertyPlantAndEquipment + investment;
  const totalAssets = totalCurrentAssets + totalLongTermAssets;

  const totalCurrentLiabilities = accountsPayable + currentDebtService + taxesPayable;
  const totalLongTermLiabilities = longTermDebtService + loansPayable;
  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;
  const totalStockholdersEquity = equityCapital + retainedEarnings;
  const totalLiabilitiesAndEquity = totalLiabilities + totalStockholdersEquity;

  return {
    year,
    revenue,
    netSales,
    costContracting,
    overhead,
    costGoodsSold,
    grossProfit,
    grossMarginPercent,
    salariesAndBenefits,
    rentAndOverhead,
    depreciationAndAmortization,
    interest,
    interestIncome,
    interestExpense,
    gainOnDisposalAssets,
    otherIncome,
    incomeTaxes,
    cashAndEquivalents,
    accountsReceivable,
    inventory,
    totalCurrentAssets,
    propertyPlantAndEquipment,
    investment,
    totalLongTermAssets,
    totalAssets,
    accountsPayable,
    currentDebtService,
    taxesPayable,
    totalCurrentLiabilities,
    longTermDebtService,
    loansPayable,
    totalLongTermLiabilities,
    totalLiabilities,
    equityCapital,
    retainedEarnings,
    totalStockholdersEquity,
    totalLiabilitiesAndEquity,
  };
}
