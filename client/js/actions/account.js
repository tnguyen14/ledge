import { getJson, deleteJson } from 'simple-fetch';
import config from 'config';

export const LOAD_ACCOUNT_SUCCESS = 'LOAD_ACCOUNT_SUCCESS';

const serverUrl = process.env.SERVER_URL;
export function loadAccount() {
	return function(dispatch, getState) {
		const { user: { idToken } } = getState();
		getJson(`${serverUrl}/accounts/${config.account_name}`, {
			headers: {
				Authorization: `Bearer ${idToken}`
			}
		}).then(account => {
			dispatch({
				type: LOAD_ACCOUNT_SUCCESS,
				data: account
			});
		});
	};
}

export const EDIT_TRANSACTION = 'EDIT_TRANSACTION';

export function editTransaction(transactionId) {
	return function(dispatch, getState) {
		// editTransaction is an action-creator creator
		return function() {
			const { weeks } = getState();
			let transaction;
			// iterate over each week to find the transaction
			// if it's already found, move on (short-circuiting by using
			// Array.prototype.some)
			Object.keys(weeks).some(offset => {
				if (transaction) {
					return true;
				}
				weeks[offset].transactions.some(tx => {
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
		};
	};
}

export const REMOVE_TRANSACTION = 'REMOVE_TRANSACTION';

export const REMOVE_TRANSACTION_SUCCESS = 'REMOVE_TRANSACTION_SUCCESS';

export function removeTransaction(transactionId) {
	return function(dispatch) {
		// removeTransaction is an action-creator creator
		return function() {
			dispatch({
				type: REMOVE_TRANSACTION,
				data: transactionId
			});
		};
	};
}

export function confirmRemoveTransaction(transactionId) {
	return function(dispatch, getState) {
		return function() {
			const { user: { idToken } } = getState();
			deleteJson(
				`${serverUrl}/accounts/${
					config.account_name
				}/transactions/${transactionId}`,
				{
					headers: {
						Authorization: `Bearer ${idToken}`
					}
				}
			).then(json => {
				dispatch({
					type: REMOVE_TRANSACTION_SUCCESS,
					data: transactionId
				});
			});
		};
	};
}

export const CANCEL_REMOVE_TRANSACTION = 'CANCEL_REMOVE_TRANSACTION';

export function cancelRemoveTransaction() {
	return {
		type: CANCEL_REMOVE_TRANSACTION
	};
}
