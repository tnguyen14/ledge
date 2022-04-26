import {
  getUniqueTransactionId,
  decorateTransaction
} from '../util/transaction.js';
import {
  addMerchantToCounts,
  removeMerchantFromCounts
} from '../util/merchants.js';
import { updateMerchantCounts } from './meta.js';
import {
  getTransactions,
  getTransactionsWithMerchantName,
  postTransaction,
  patchTransaction,
  deleteTransaction
} from '../util/api.js';

export const LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS';
export const LOAD_TRANSACTIONS_SUCCESS = 'LOAD_TRANSACTIONS_SUCCESS';
export function loadTransactions(startDate, endDate) {
  return async function loadTransactionsAsync(dispatch) {
    dispatch({
      type: LOAD_TRANSACTIONS
    });
    dispatch({
      type: LOAD_TRANSACTIONS_SUCCESS,
      payload: {
        start: startDate,
        end: endDate,
        transactions: await getTransactions(startDate, endDate)
      }
    });
  };
}

export const ADD_TRANSACTION_FAILURE = 'ADD_TRANSACTION_FAILURE';
export const UPDATE_TRANSACTION_FAILURE = 'UPDATE_TRANSACTION_FAILURE';
export const ADD_TRANSACTION_SUCCESS = 'ADD_TRANSACTION_SUCCESS';
export const UPDATE_TRANSACTION_SUCCESS = 'UPDATE_TRANSACTION_SUCCESS';

export function addTransaction(transaction) {
  return async function addTransactionAsync(dispatch, getState) {
    const {
      meta: { merchants_count }
    } = getState();

    try {
      const decoratedTransaction = decorateTransaction(transaction);
      const id = await getUniqueTransactionId(
        new Date(decoratedTransaction.date).valueOf()
      );
      await postTransaction({
        ...decoratedTransaction,
        id
      });
      dispatch({
        type: ADD_TRANSACTION_SUCCESS,
        payload: {
          ...decoratedTransaction,
          id
        }
      });
      dispatch(
        updateMerchantCounts(
          addMerchantToCounts(transaction.merchant, merchants_count)
        )
      );
    } catch (e) {
      console.error(e);
      dispatch({
        type: ADD_TRANSACTION_FAILURE
      });
    }
  };
}

export function updateTransaction(transaction, oldMerchant) {
  return async function updateTransactionAsync(dispatch, getState) {
    const {
      meta: { merchants_count }
    } = getState();

    try {
      const decoratedTransaction = decorateTransaction(transaction);
      const id = transaction.id;

      await patchTransaction({
        ...decoratedTransaction,
        id
      });
      dispatch({
        type: UPDATE_TRANSACTION_SUCCESS,
        payload: {
          ...decoratedTransaction,
          id
        }
      });
      if (transaction.merchant != oldMerchant) {
        const transactionsWithOldMerchantName = await getTransactionsWithMerchantName(
          oldMerchant
        );
        const updatedMerchantsCount = addMerchantToCounts(
          transaction.merchant,
          removeMerchantFromCounts(
            oldMerchant,
            merchants_count,
            transactionsWithOldMerchantName.length
          )
        );
        dispatch(updateMerchantCounts(updatedMerchantsCount));
      }
    } catch (e) {
      console.error(e);
      dispatch({
        type: UPDATE_TRANSACTION_FAILURE
      });
    }
  };
}

export const REMOVING_TRANSACTION = 'REMOVING_TRANSACTION';
export const REMOVE_TRANSACTION_SUCCESS = 'REMOVE_TRANSACTION_SUCCESS';
export function removeTransaction(transaction) {
  return async function removeTransactionAsync(dispatch, getState) {
    const {
      meta: { merchants_count }
    } = getState();

    dispatch({
      type: REMOVING_TRANSACTION
    });
    await deleteTransaction(transaction.id);
    dispatch({
      type: REMOVE_TRANSACTION_SUCCESS,
      payload: transaction.id
    });
    const transactionsWithMerchantName = await getTransactionsWithMerchantName(
      transaction.merchant
    );
    const updatedMerchantsCount = removeMerchantFromCounts(
      transaction.merchant,
      merchants_count,
      transactionsWithMerchantName.length
    );
    dispatch(updateMerchantCounts(updatedMerchantsCount));
  };
}
