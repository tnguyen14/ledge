import React, { useEffect, useCallback } from 'https://esm.sh/react@18';
import { useSelector, useDispatch } from 'https://esm.sh/react-redux@9';
import { loadTransactions } from '../../slices/transactions.js';
import { getWeekById, getSortedTransactions } from '../../selectors/transactions.js';
import { getWeekStart, getWeekStartFromWeekId } from '../../selectors/week.js';
import Transaction from './Transaction.js';
import WeekStats from './WeekStats.js';
function Week(props) {
  const dispatch = useDispatch();
  const {
    weekId
  } = props;
  const transactions = useSelector(state => state.transactions);
  const recurring = useSelector(state => state.meta.recurring);
  const {
    transactions: weekTransactions,
    start,
    end
  } = getWeekById({
    transactions,
    weekId
  });
  const displayTransactions = getSortedTransactions({
    transactions: weekTransactions
  }).filter(tx => !tx.carriedOver);
  const loadWeek = useCallback(async weekId => {
    dispatch(loadTransactions({
      start: getWeekStart({
        date: getWeekStartFromWeekId({
          weekId
        })
      }),
      end: getWeekStart({
        date: getWeekStartFromWeekId({
          weekId
        }),
        offset: 1
      })
    }));
  }, [dispatch]);
  useEffect(() => {
    if (!displayTransactions.length) {
      dispatch(loadWeek.bind(null, weekId));
    }
  }, [weekId]);
  if (!start || !end) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "weekly transactions-container"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "week-title"
  }, start.toFormat('LLL d'), " - ", end.toFormat('LLL d, yyyy')), /*#__PURE__*/React.createElement("div", {
    className: "transactions-list"
  }, /*#__PURE__*/React.createElement("table", {
    className: "weekly-transactions table table-striped"
  }, /*#__PURE__*/React.createElement("tbody", null, displayTransactions.map(tx => /*#__PURE__*/React.createElement(Transaction, {
    key: tx.id,
    transaction: tx
  }))))), /*#__PURE__*/React.createElement(WeekStats, {
    weekId: weekId,
    label: "Regular Expenses"
  }));
}
export default Week;