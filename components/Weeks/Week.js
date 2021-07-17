function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { useEffect } from 'https://cdn.skypack.dev/react@17';
import { useSelector, useDispatch } from 'https://cdn.skypack.dev/react-redux@7';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { INTEND_TO_REMOVE_TRANSACTION, EDIT_TRANSACTION } from '../../actions/account.js';
import { loadWeek, LOAD_WEEK_SUCCESS } from '../../actions/weeks.js';
import { sortTransactions } from '../../util/transaction.js';
import { getWeekById } from '../../selectors/transactions.js';
import Transaction from './Transaction.js';
import WeekStats from './WeekStats.js';

function editTransaction(transaction) {
  return {
    type: EDIT_TRANSACTION,
    data: transaction
  };
}

function intendToRemoveTransaction(transaction) {
  return {
    type: INTEND_TO_REMOVE_TRANSACTION,
    data: transaction
  };
}

function Week(props) {
  const dispatch = useDispatch();
  const {
    weekId
  } = props;
  const categories = useSelector(state => state.account.categories);
  const sources = useSelector(state => state.account.sources);
  const filter = useSelector(state => state.app.filter);
  const displayFrom = useSelector(state => state.app.displayFrom);
  const isLoading = useSelector(state => state.app.isLoading);
  const weekMeta = useSelector(state => state.app.weeksMeta[weekId]);
  const transactions = useSelector(state => state.transactions);
  const {
    transactions: weekTransactions,
    start,
    end
  } = getWeekById({
    transactions,
    weekId
  });
  const localWeekTransactions = weekTransactions.filter(tx => !tx.carriedOver);
  useEffect(() => {
    // wait for initial loadYears
    if (!isLoading) {
      if (localWeekTransactions.length) {
        // if there's no meta or meta hasn't been marked as loaded
        if (!(weekMeta && weekMeta.loaded)) {
          dispatch({
            type: LOAD_WEEK_SUCCESS,
            data: {
              weekId
            }
          });
        }
      } else {
        if (weekMeta && !weekMeta.loaded && weekMeta.visible) {
          dispatch(loadWeek({
            weekId
          }));
        }
      }
    }
  }, [weekMeta]);

  if (!weekMeta || !weekMeta.visible) {
    return null;
  }

  const displayTransactions = sortTransactions(localWeekTransactions).filter(tx => {
    if (filter) {
      if (tx.merchant.toLowerCase().includes(filter)) {
        return true;
      }

      if (String(tx.amount).includes(filter)) {
        return true;
      }

      if (tx.category.includes(filter)) {
        return true;
      }

      if (tx.source.includes(filter)) {
        return true;
      }

      return false;
    }

    return true;
  });

  if (!start || !end) {
    return null;
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "weekly"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "week-title"
  }, format(start, 'MMM d'), " - ", format(end, 'MMM d')), /*#__PURE__*/React.createElement("table", {
    className: "weekly-transactions table table-striped"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    "data-field": "day"
  }, "Day"), /*#__PURE__*/React.createElement("th", {
    "data-field": "merchant"
  }, "Merchant"), /*#__PURE__*/React.createElement("th", {
    "data-field": "amount"
  }, "Amount"), /*#__PURE__*/React.createElement("th", {
    "data-field": "source"
  }, "Source"), /*#__PURE__*/React.createElement("th", {
    "data-field": "description",
    className: "secondary"
  }, "Desc."), /*#__PURE__*/React.createElement("th", {
    "data-field": "category",
    className: "secondary"
  }, "Category"), /*#__PURE__*/React.createElement("th", {
    className: "secondary"
  })), /*#__PURE__*/React.createElement("tr", {
    className: "addition"
  })), /*#__PURE__*/React.createElement("tbody", null, displayTransactions.map(tx => /*#__PURE__*/React.createElement(Transaction, _extends({
    key: tx.id,
    handleRemove: () => dispatch(intendToRemoveTransaction(tx)),
    handleEdit: event => {
      // avoid toggling the transaction as active
      event.stopPropagation();
      dispatch(editTransaction(tx));
    },
    options: {
      categories,
      sources
    }
  }, tx))))), filter == '' && /*#__PURE__*/React.createElement(WeekStats, {
    weekId: weekId
  }));
}

export default Week;