import {
	LOAD_ACCOUNT_SUCCESS,
	REMOVE_TRANSACTION,
	REMOVE_TRANSACTION_SUCCESS,
	CANCEL_REMOVE_TRANSACTION
} from '../actions/account';
const initialState = {
	merchants: [],
	isRemovingTransaction: false,
	categories: [],
	sources: []
};

export default function account(state = initialState, action) {
	switch (action.type) {
		case LOAD_ACCOUNT_SUCCESS:
			// flatten merchant values
			const merchants = action.data.merchants.reduce(
				(merchants, merchant) => {
					return merchants.concat(merchant.values);
				},
				[]
			);
			return { ...state, ...action.data, merchants: merchants };
		case REMOVE_TRANSACTION:
			return {
				...state,
				isRemovingTransaction: true,
				transactionToBeRemoved: action.data
			};
		case REMOVE_TRANSACTION_SUCCESS:
		case CANCEL_REMOVE_TRANSACTION:
			return {
				...state,
				isRemovingTransaction: false,
				transactionToBeRemoved: undefined
			};
		default:
			return state;
	}
}
