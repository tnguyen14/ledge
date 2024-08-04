import React from 'https://esm.sh/react@18.2.0';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import CompactTransaction from './CompactTransaction.js';
function WeekCategory(props) {
  const {
    slug,
    label,
    amount,
    weekId,
    transactions = []
  } = props;
  const statId = `${slug}-${weekId}`;
  return /*#__PURE__*/React.createElement("tr", {
    key: statId,
    id: statId,
    className: "stat",
    "data-cat": slug
  }, /*#__PURE__*/React.createElement("td", {
    className: "stat-label"
  }, /*#__PURE__*/React.createElement("span", {
    className: "legend"
  }, "\xA0"), label, /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null), /*#__PURE__*/React.createElement("table", {
    className: "table table-borderless category-transactions"
  }, /*#__PURE__*/React.createElement("tbody", null, transactions.map(txn => /*#__PURE__*/React.createElement("tr", {
    key: txn.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(CompactTransaction, {
    transaction: txn
  })))))))), /*#__PURE__*/React.createElement("td", {
    "aria-labelledby": statId
  }, usd(amount)));
}
export default WeekCategory;