/**
 * Converts a currency amount to its subcurrency equivalent.
 * For example, if the currency is dollars, this function converts it to cents.
 *
 * @param {number} amount - The amount in the main currency.
 * @returns {number} The equivalent amount in the subcurrency (e.g., cents).
 */
export default function convertToSubcurrency(amount: number): number {
    return Math.round(amount * 100);
  }
  