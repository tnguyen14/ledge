import { getJson, deleteJson, patchJson } from '../util/fetch';
import { LOGOUT } from './user';

export const LOAD_ACCOUNT_SUCCESS = 'LOAD_ACCOUNT_SUCCESS';

export function loadAccount() {
  return async function (dispatch, getState) {
    const {
      user: { idToken }
    } = getState();
    try {
      const account = await getJson(idToken, `${SERVER_URL}/meta`);
      dispatch({
        type: LOAD_ACCOUNT_SUCCESS,
        data: account
      });
    } catch (err) {
      if (err.message == 'Unauthorized') {
        dispatch({
          type: LOGOUT
        });
        return;
      }
      throw err;
    }
  };
}

export const EDIT_TRANSACTION = 'EDIT_TRANSACTION';

export function editTransaction(transactionId) {
  return function (dispatch, getState) {
    // editTransaction is an action-creator creator
    return function (e) {
      const { weeks } = getState();
      let transaction;
      // iterate over each week to find the transaction
      // if it's already found, move on (short-circuiting by using
      // Array.prototype.some)
      Object.keys(weeks).some((offset) => {
        if (transaction) {
          return true;
        }
        weeks[offset].transactions.some((tx) => {
          if (tx.id === transactionId) {
            transaction = tx;
            return true;
          }
        });
      });
      dispatch({
        type: EDIT_TRANSACTION,
        data: transaction
      });
      // avoid toggling the transaction as active
      e.stopPropagation();
    };
  };
}

export const INTEND_TO_REMOVE_TRANSACTION = 'INTEND_TO_REMOVE_TRANSACTION';

export function intendToRemoveTransaction(transaction) {
  return function (dispatch) {
    // removeTransaction is an action-creator creator
    return function () {
      dispatch({
        type: INTEND_TO_REMOVE_TRANSACTION,
        data: transaction
      });
    };
  };
}

// TODO update merchant counts in account reducer
const UPDATE_MERCHANT_COUNTS_SUCCESS = 'UPDATE_MERCHANT_COUNTS_SUCCESS';

export function updateMerchantCounts(merchants_count) {
  return async function (dispatch, getState) {
    const {
      user: { idToken }
    } = getState();
    await patchJson(idToken, `${SERVER_URL}/meta`, {
      merchants_count
    });
    dispatch({
      type: UPDATE_MERCHANT_COUNTS_SUCCESS,
      data: merchants_count
    });
  };
}

export const CANCEL_REMOVE_TRANSACTION = 'CANCEL_REMOVE_TRANSACTION';

export function cancelRemoveTransaction() {
  return {
    type: CANCEL_REMOVE_TRANSACTION
  };
}
