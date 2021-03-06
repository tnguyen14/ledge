import { LOAD_YEARS_SUCCESS } from '../actions/years.js';
import { LOAD_WEEK_SUCCESS } from '../actions/weeks.js';
import {
  ADD_TRANSACTION_SUCCESS,
  UPDATE_TRANSACTION_SUCCESS,
  REMOVE_TRANSACTION_SUCCESS
} from '../actions/transaction.js';

export default function transactions(state = {}, action) {
  switch (action.type) {
    case LOAD_YEARS_SUCCESS:
    case LOAD_WEEK_SUCCESS:
      if (!action.data.transactions) {
        return state;
      }
      return action.data.transactions.reduce(
        function addTransation(currentState, transaction) {
          if (!currentState[transaction.id]) {
            currentState[transaction.id] = transaction;
          }
          return currentState;
        },
        { ...state }
      );
    case ADD_TRANSACTION_SUCCESS:
      return {
        ...state,
        [action.data.id]: action.data
      };
    case REMOVE_TRANSACTION_SUCCESS:
      const newState = { ...state };
      delete newState[action.data];
      return newState;
    case UPDATE_TRANSACTION_SUCCESS:
      return {
        ...state,
        [action.data.id]: action.data
      };
    default:
      return state;
  }
}
