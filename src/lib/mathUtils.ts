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
 * TODO: Have a method for each stress test that returns a suitable
 * data type for the row, then we can populate table on the UI.
 * E.g.,
 *
 * Function that returns Stress1DataRow[]
 *
 * Array.from({ length: years }, (_, i)) => {
 *  const row: Stress1DataRow = {
 *      ...
 *      year, balance, interestEarned, etc.
 *  };
 *  return row;
 * });
 */
