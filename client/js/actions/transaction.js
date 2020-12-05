import { getJson, postJson, patchJson } from '../util/fetch';
import {
  getUniqueTransactionId,
  decorateTransaction
} from '../util/transaction';

export const ADD_TRANSACTION_SUCCESS = 'ADD_TRANSACTION_SUCCESS';
export const UPDATE_TRANSACTION_SUCCESS = 'UPDATE_TRANSACTION_SUCCESS';

export function addTransaction(transaction) {
  return async function (dispatch, getState) {
    const {
      user: { idToken }
    } = getState();

    const id = await getUniqueTransactionId(idToken, transaction.date);
    // TODO handle error
    await postJson(idToken, `${SERVER_URL}/items`, {
      ...decorateTransaction(transaction),
      id
    });
    dispatch({
      type: ADD_TRANSACTION_SUCCESS,
      data: transaction
    });
  };
}

export function updateTransaction(transaction) {
  return async function (dispatch, getState) {
    const {
      user: { idToken }
    } = getState();

    // TODO handle error
    await patchJson(
      idToken,
      `${SERVER_URL}/items/${transaction.id}`,
      decorateTransaction(transaction)
    );
    dispatch({
      type: UPDATE_TRANSACTION_SUCCESS,
      data: transaction
    });
  };
}
