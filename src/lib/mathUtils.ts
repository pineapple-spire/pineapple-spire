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

// Function to calculate the balance and interest for each year, including monthly contributions
export function calculateInterestAndBalance(
  presentValue: number,
  interestRate: number,
  term: number,
) {
  const results = [];
  let balance = presentValue; // Start with $5000
  const annualInterestRate = interestRate / 100;

  for (let year = 1; year <= term; year++) {
    const interestEarned = balance * annualInterestRate; // Interest earned
    const newBalance = balance - interestEarned; // Deduct interest to get new balance
    const total = balance + interestEarned;

    results.push({
      year,
      balance: formatCurrency(balance), // Balance before interest is deducted
      contribution: formatCurrency(0), // No yearly contribution
      interest: formatCurrency(interestEarned), // Interest deducted
      total: formatCurrency(total), // Corrected balance after interest deduction
    });

    balance = newBalance; // Update balance for next year
  }

  return results;
}
