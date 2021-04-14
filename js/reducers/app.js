import {
  RENEWING_SESSION,
  AUTHENTICATED,
  RENEWED_SESSION
} from '../actions/user';
import {
  LOAD_TRANSACTIONS,
  LOAD_TRANSACTIONS_SUCCESS,
  SET_FILTER
} from '../actions/app';

const defaultState = {
  isLoading: false,
  filter: '',
  notification: {
    content: '',
    title: ''
  }
};

export default function app(state = defaultState, action) {
  switch (action.type) {
    case RENEWING_SESSION:
      return {
        ...state,
        notification: {
          title: 'Authentication',
          content: 'Renewing session...'
        }
      };
    case AUTHENTICATED:
    case RENEWED_SESSION:
      return {
        ...state,
        notification: {
          title: '',
          content: ''
        }
      };
    case LOAD_TRANSACTIONS:
      return {
        ...state,
        isLoading: true
      };
    case LOAD_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        notification: {
          title: 'App',
          content: `Finished loading transactions`,
          autohide: true
        }
      };
    case SET_FILTER:
      return {
        ...state,
        filter: action.data
      };
    default:
      return state;
  }
}
