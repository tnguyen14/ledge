import {
  SET_DISPLAY_FROM,
  SET_TOKEN,
  REFRESH_APP,
  INITIAL_LOAD_EXPENSE_SUCCESS,
  SHOW_CASHFLOW,
  INTEND_TO_REMOVE_TRANSACTION,
  CANCEL_REMOVE_TRANSACTION
} from '../actions/app.js';
import {
  LOAD_TRANSACTIONS,
  LOAD_TRANSACTIONS_SUCCESS,
  REMOVE_TRANSACTION_SUCCESS
} from '../actions/transactions.js';
import { SET_SEARCH } from '../actions/form.js';

const numVisibleWeeks = 12;

const defaultState = {
  appReady: false,
  isLoading: false,
  initialLoad: false,
  filter: '',
  yearsToLoad: 3,
  notification: {
    content: '',
    title: '',
    type: 'info'
  },
  lastRefreshed: 0,
  loadedTransactions: false,
  showCashflow: false
};

export default function app(state = defaultState, action) {
  switch (action.type) {
    case LOAD_TRANSACTIONS:
      return {
        ...state,
        isLoading: true
      };
    case LOAD_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        loadedTransactions: true,
        notification: {
          title: 'App',
          content: `Finished loading transactions from ${action.data.start} to ${action.data.end}`,
          autohide: 3000
        }
      };
    case INITIAL_LOAD_EXPENSE_SUCCESS:
      return {
        ...state,
        initialLoad: true
      };
    case REFRESH_APP:
      return {
        ...state,
        appReady: true,
        lastRefreshed: new Date().valueOf()
      };
    case SET_TOKEN:
      return {
        ...state,
        token: action.data
      };
    case SET_DISPLAY_FROM:
      return {
        ...state,
        displayFrom: action.data
      };
    case SHOW_CASHFLOW:
      return {
        ...state,
        showCashflow: action.data
      };
    case SET_SEARCH:
      return {
        ...state,
        search: action.data
      };
    case INTEND_TO_REMOVE_TRANSACTION:
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
