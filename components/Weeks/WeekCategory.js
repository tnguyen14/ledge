import React from 'https://cdn.skypack.dev/react@17';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import Tooltip from 'https://cdn.skypack.dev/@material-ui/core@4/Tooltip';
import { ClockIcon } from 'https://cdn.skypack.dev/@primer/octicons-react@11';
import { TIMEZONE } from '../../util/constants.js';

function WeekCategory(props) {
  const {
    slug,
    label,
    amount,
    weekId,
    transactions = []
  } = props;
  const carriedOvers = transactions.filter(tx => tx.carriedOver);
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
  }, "\xA0"), label, carriedOvers.length > 0 && /*#__PURE__*/React.createElement(Tooltip, {
    title: "Contains carried-over transactions"
  }, /*#__PURE__*/React.createElement("span", {
    className: "span-hint"
  }, /*#__PURE__*/React.createElement(ClockIcon, null))), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null), /*#__PURE__*/React.createElement("table", {
    className: "table table-borderless category-transactions"
  }, /*#__PURE__*/React.createElement("tbody", null, transactions.map(txn => /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, format(new Date(txn.date), 'MM/dd/yy')), /*#__PURE__*/React.createElement("td", null, txn.merchant), /*#__PURE__*/React.createElement("td", null, usd(txn.amount)), /*#__PURE__*/React.createElement("td", null, `(${txn.span})`))))))), /*#__PURE__*/React.createElement("td", {
    "aria-labelledby": statId
  }, usd(amount)));
}

export default WeekCategory;