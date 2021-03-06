import {
  LOAD_TRANSACTIONS,
  LOAD_TRANSACTIONS_SUCCESS,
  SET_FILTER,
  SET_DISPLAY_FROM,
  SET_TOKEN,
  REFRESH_APP
} from '../actions/app.js';
import { SHOW_WEEK, LOAD_WEEK, LOAD_WEEK_SUCCESS } from '../actions/weeks.js';
import { getPastWeeksIds } from '../selectors/week.js';
import { getVisibleWeeks } from '../selectors/weeks.js';

const defaultState = {
  isLoading: false,
  filter: '',
  yearsToLoad: 3,
  notification: {
    content: '',
    title: '',
    type: 'info'
  },
  lastRefreshed: 0,
  loadedTransactions: false,
  weeksMeta: {},
  numInitialVisibleWeeks: 12
};

export default function app(state = defaultState, action) {
  switch (action.type) {
    case LOAD_TRANSACTIONS:
    case LOAD_WEEK:
      return {
        ...state,
        isLoading: true
      };
    case LOAD_WEEK_SUCCESS:
      return {
        ...state,
        isLoading: false,
        weeksMeta: {
          ...state.weeksMeta,
          [action.data.weekId]: {
            ...state.weeksMeta[action.data.weekId],
            loaded: true
          }
        }
      };
    case LOAD_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        loadedTransactions: true,
        notification: {
          title: 'App',
          content: 'Finished loading transactions',
          autohide: 3000
        }
      };
    case REFRESH_APP:
      return {
        ...state,
        lastRefreshed: new Date().valueOf()
      };
    case SET_FILTER:
      return {
        ...state,
        filter: action.data
      };
    case SET_TOKEN:
      return {
        ...state,
        token: action.data
      };
    case SET_DISPLAY_FROM:
      const previousVisibleWeeks = getVisibleWeeks(state.weeksMeta);
      // show 4 weeks by default
      const newVisibleWeeks = getPastWeeksIds({
        weekId: action.data,
        numWeeks: state.numInitialVisibleWeeks
      });
      const newState = {
        ...state,
        displayFrom: action.data
      };
      for (let week of previousVisibleWeeks) {
        newState.weeksMeta[week] = {
          ...newState.weeksMeta[week],
          visible: false
        };
      }
      for (let week of newVisibleWeeks) {
        newState.weeksMeta[week] = {
          ...newState.weeksMeta[week],
          visible: true
        };
      }
      return newState;
    case SHOW_WEEK:
      return {
        ...state,
        weeksMeta: {
          ...state.weeksMeta,
          [action.data.weekId]: {
            ...state.weeksMeta[action.data.weekId],
            visible: true
          }
        }
      };
    default:
      return state;
  }
}
