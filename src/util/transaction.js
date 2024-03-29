import { toCents } from 'https://esm.sh/@tridnguyen/money@1';
import { getTransaction } from './api.js';

/**
 * Generate a unique transaction ID based on current timestamp
 * If that value already exists, keep incrementing it until it is unique
 * @param {string} idToken JWT token
 * @param {number} id The id as a number to check
 */
export async function getUniqueTransactionId(id) {
  try {
    await getTransaction(String(id));
    return await getUniqueTransactionId(++id);
  } catch (e) {
    if (e.response.status == 404) {
      return String(id);
    }
    throw e;
  }
}

export const SYNTHETIC_TYPES = [
  {
    slug: 'expense',
    value: 'Expense'
  },
  {
    slug: 'income',
    value: 'Income'
  },
  {
    slug: 'transfer',
    value: 'Transfer'
  }
];

export function decorateTransaction(params) {
  if (!(params.date && params.time)) {
    throw new Error('Date and time are required for a transaction');
  }
  if (!params.amount) {
    throw new Error('Amount is required for transaction');
  }

  const {
    memo,
    merchant,
    type,
    category,
    syntheticType,
    creditAccount,
    debitAccount,
    budgetSpan
  } = params;
  const date = new Date(`${params.date} ${params.time}`).toISOString();
  const budgetStart = params.budgetStart
    ? new Date(`${params.budgetStart} 00:00`).toISOString()
    : undefined;
  const budgetEnd = params.budgetEnd
    ? new Date(`${params.budgetEnd} 00:00`).toISOString()
    : undefined;
  const amount = toCents(params.amount);
  // TODO convert budgetStart and budgetEnd to ISOString
  return {
    date,
    amount,
    memo,
    merchant: merchant.trim(),
    type,
    category,
    budgetStart,
    budgetEnd,
    budgetSpan,
    syntheticType,
    debitAccount,
    creditAccount
  };
}
