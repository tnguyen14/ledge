import React from 'https://esm.sh/react@18.2.0';
import { useSelector, useDispatch } from 'https://esm.sh/react-redux@9.1.1';
import Button from 'https://esm.sh/react-bootstrap@2.10.2/Button';
import { PencilIcon, TrashIcon } from 'https://esm.sh/@primer/octicons-react@15';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import { editTransaction, intendToRemoveTransaction, setUserSettingsOpen } from '../../slices/app.js';
import { getRecurringTransactions } from '../../selectors/meta.js';
import { getValueFromOptions } from '../../util/slug.js';
function displayMonthDay(day) {
  if (day == 1) {
    return '1st';
  } else if (day == 2) {
    return '2nd';
  } else if (day == 3) {
    return '3rd';
  } else if (day == 21) {
    return '21st';
  } else if (day == 22) {
    return '22nd';
  } else if (day == 23) {
    return '23rd';
  } else if (day == 31) {
    return '31st';
  } else {
    return `${day}th`;
  }
}
function displayPlural(str, num) {
  if (num == 1) {
    return str;
  } else {
    return `${str}s`;
  }
}
function displayFrequency(str, num) {
  if (num == 1) {
    return `every ${str}`;
  } else {
    return `every ${num} ${displayPlural(str, num)}`;
  }
}
export function RecurringTransaction({
  merchant,
  amount,
  category,
  recurrencePeriod,
  recurrenceFrequency,
  recurrenceDay,
  recurrenceEndDate
}) {
  const categories = useSelector(state => state.meta.expenseCategories);
  return /*#__PURE__*/React.createElement("span", null, merchant, " ", usd(amount), " [", getValueFromOptions(categories, category), "]:", ' ', displayFrequency(recurrencePeriod, recurrenceFrequency), " on", ' ', recurrencePeriod == 'month' ? `the ${displayMonthDay(recurrenceDay)}` : recurrenceDay, recurrenceEndDate != '' ? ` until ${recurrenceEndDate}` : '');
}

/*
 * [merchant] [amount] ([category]) : every [frequency] [period] on [day]
 */

/**
 * @returns {JSX.Element}
 */
function Recurring() {
  const {
    recurring
  } = useSelector(state => state.meta);
  const {
    active,
    expired
  } = getRecurringTransactions({
    recurring
  });
  const dispatch = useDispatch();
  const categories = useSelector(state => state.meta.expenseCategories);
  return /*#__PURE__*/React.createElement("div", {
    className: "recurring"
  }, /*#__PURE__*/React.createElement("h4", null, "Recurring Transactions"), active.map(txn => /*#__PURE__*/React.createElement("div", {
    className: "item",
    key: txn.id
  }, /*#__PURE__*/React.createElement(RecurringTransaction, txn), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline-info",
    title: "Edit",
    onClick: () => {
      dispatch(editTransaction({
        ...txn,
        syntheticType: 'recurring'
      }));
      dispatch(setUserSettingsOpen(false));
    }
  }, /*#__PURE__*/React.createElement(PencilIcon, null)), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline-danger",
    title: "Remove",
    onClick: () => {
      dispatch(intendToRemoveTransaction({
        ...txn,
        syntheticType: 'recurring'
      }));
      dispatch(setUserSettingsOpen(false));
    }
  }, /*#__PURE__*/React.createElement(TrashIcon, null)))), /*#__PURE__*/React.createElement("h4", null, "Expired Recurring Transactions"), expired.map(txn => /*#__PURE__*/React.createElement("div", {
    className: "item",
    key: txn.id
  }, /*#__PURE__*/React.createElement(RecurringTransaction, txn), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline-danger",
    title: "Remove",
    onClick: () => {
      dispatch(intendToRemoveTransaction({
        ...txn,
        syntheticType: 'recurring'
      }));
      dispatch(setUserSettingsOpen(false));
    }
  }, /*#__PURE__*/React.createElement(TrashIcon, null)))));
}
export default Recurring;