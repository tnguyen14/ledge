import {
  RENEWING_SESSION,
  AUTHENTICATED,
  RENEWED_SESSION
} from '../actions/user';
import { LOAD_INITIAL_WEEKS_SUCCESS } from '../actions/weeks';

const initialState = {
  content: ''
};

export default function app(state = initialState, action) {
  switch (action.type) {
    case RENEWING_SESSION:
      return {
        title: 'Authentication',
        content: 'Renewing session...'
      };
    case AUTHENTICATED:
    case RENEWED_SESSION:
      return {
        title: '',
        content: ''
      };
    case LOAD_INITIAL_WEEKS_SUCCESS:
      return {
        title: 'Transactions',
        content: `Finished loading ${action.data} weeks`,
        autohide: true
      };
    default:
      return state;
  }
}