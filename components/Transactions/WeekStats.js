import React from 'https://esm.sh/react@18.2.0';
import { useSelector } from 'https://esm.sh/react-redux@9.1.1';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import WeekCategory from './WeekCategory.js';
import { getCategoriesTotals } from '../../selectors/stats.js';
import { getPastWeeksIds } from '../../selectors/week.js';
import { getWeekById, calculateSum, calculateWeeklyAverage } from '../../selectors/transactions.js';
import { sum } from '../../util/calculate.js';
function WeekStats({
  weekId,
  label
}) {
  const numWeeks = 4;
  const categories = useSelector(state => state.meta.expenseCategories);
  const pastWeeks = useSelector(state => getPastWeeksIds({
    weekId,
    numWeeks
  }).map(weekId => getWeekById({
    ...state,
    weekId
  })));
  const thisWeek = pastWeeks[0];
  const rawTotal = calculateSum(thisWeek);
  const rawTotalId = `raw-total-${weekId}`;
  const transactions = thisWeek.transactions.filter(tx => tx.syntheticType == 'expense');
  const transactionsByCategory = transactions.reduce((txnsByCat, txn) => {
    if (!txnsByCat[txn.category]) {
      txnsByCat[txn.category] = [txn];
    } else {
      txnsByCat[txn.category].push(txn);
    }
    return txnsByCat;
  }, {});
  const categoriesTotals = getCategoriesTotals({
    transactions,
    categories
  });
  const budgetTotal = sum(categoriesTotals.map(s => s.amount));
  const budgetTotalId = `budget-total-${weekId}`;
  const pastWeeksAverage = calculateWeeklyAverage({
    transactions: Array.prototype.concat(...pastWeeks.map(week => week.transactions)),
    numWeeks
  });
  const pastWeeksAverageId = `past-weeks-average-${weekId}`;
  return /*#__PURE__*/React.createElement("div", {
    className: "stats week-stats"
  }, label && /*#__PURE__*/React.createElement("h4", null, label), /*#__PURE__*/React.createElement("table", {
    className: "table table-borderless"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", {
    key: budgetTotalId,
    className: "stat",
    "data-cat": budgetTotalId
  }, /*#__PURE__*/React.createElement("td", {
    id: budgetTotalId,
    className: "stat-label"
  }, "Budget Total"), /*#__PURE__*/React.createElement("td", {
    "aria-labelledby": budgetTotalId
  }, usd(budgetTotal))), /*#__PURE__*/React.createElement("tr", {
    key: rawTotalId,
    className: "stat",
    "data-cat": "raw-total"
  }, /*#__PURE__*/React.createElement("td", {
    id: rawTotalId,
    className: "stat-label"
  }, "Raw Total"), /*#__PURE__*/React.createElement("td", {
    "aria-labelledby": rawTotalId
  }, usd(rawTotal))), /*#__PURE__*/React.createElement("tr", {
    key: pastWeeksAverageId,
    className: "stat"
  }, /*#__PURE__*/React.createElement("td", {
    id: pastWeeksAverageId,
    className: "stat-label"
  }, "Raw ", numWeeks, "-week Average"), /*#__PURE__*/React.createElement("td", {
    "aria-labelledby": pastWeeksAverageId
  }, usd(pastWeeksAverage))))), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, "Category breakdown"), /*#__PURE__*/React.createElement("table", {
    className: "table table-borderless categories-stats"
  }, /*#__PURE__*/React.createElement("tbody", null, categoriesTotals.map(({
    slug,
    label,
    amount
  }) => /*#__PURE__*/React.createElement(WeekCategory, {
    key: slug,
    slug: slug,
    label: label,
    amount: amount,
    weekId: weekId,
    transactions: transactionsByCategory[slug]
  }))))));
}
export default WeekStats;