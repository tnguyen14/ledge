function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from 'https://esm.sh/react@18';
import { useSelector, useDispatch } from 'https://esm.sh/react-redux@9';
import { format } from 'https://esm.sh/date-fns@2';
import { utcToZonedTime } from 'https://esm.sh/date-fns-tz@1/esm';
import Badge from 'https://esm.sh/react-bootstrap@2/Badge';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import { KebabHorizontalIcon, ClockIcon, NoteIcon } from 'https://esm.sh/@primer/octicons-react@15';
import Popover from 'https://esm.sh/@mui/material@5.15.7/Popover';
import { usePopupState, bindPopover, bindTrigger } from 'https://esm.sh/material-ui-popup-state@5/hooks';
import { TIMEZONE, DISPLAY_DATE_TIME_FORMAT, DATE_FIELD_FORMAT } from '../../util/constants.js';
import { getValueFromOptions } from '../../util/slug.js';
import { SYNTHETIC_TYPES } from '../../util/transaction.js';
import { editTransaction, intendToRemoveTransaction } from '../../slices/app.js';
function Transaction({
  transaction,
  dateFormat
}) {
  const dispatch = useDispatch();
  const {
    id,
    date,
    amount,
    merchant,
    category,
    syntheticType,
    memo,
    budgetStart,
    budgetEnd,
    budgetSpan,
    debitAccount,
    creditAccount
  } = transaction;
  const categories = useSelector(state => state.meta.expenseCategories);
  const accounts = useSelector(state => state.meta.accounts);
  const creditAccountPopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-credit-account`
  });
  const debitAccountPopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-debit-account`
  });
  const notesPopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-notes`
  });
  const datePopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-date`
  });
  const amountPopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-amount`
  });
  const spanPopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-span`
  });
  const actionsPopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-actions`
  });

  // show day as in origin timezone, while date in local timezone
  const displayDay = format(utcToZonedTime(date, TIMEZONE), dateFormat || 'EEE');
  const displayDate = format(new Date(date), DISPLAY_DATE_TIME_FORMAT);
  if (!transaction) {
    return null;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("tr", {
    id: id,
    className: "transaction",
    "data-day": displayDay,
    "data-date": date
  }, /*#__PURE__*/React.createElement("td", _extends({
    "data-field": "credit-account",
    "data-account-name": creditAccount
  }, bindTrigger(creditAccountPopupState))), /*#__PURE__*/React.createElement("td", {
    "data-field": "day"
  }, /*#__PURE__*/React.createElement("span", bindTrigger(datePopupState), displayDay)), /*#__PURE__*/React.createElement("td", {
    "data-field": "merchant"
  }, merchant ? merchant : getValueFromOptions(accounts, debitAccount), memo && /*#__PURE__*/React.createElement("button", _extends({
    className: "icon-button"
  }, bindTrigger(notesPopupState)), /*#__PURE__*/React.createElement(NoteIcon, null))), /*#__PURE__*/React.createElement("td", {
    "data-field": "amount",
    "data-cat": category
  }, /*#__PURE__*/React.createElement(Badge, _extends({
    pill: true,
    bg: null
  }, bindTrigger(amountPopupState)), usd(amount)), budgetSpan > 1 ? /*#__PURE__*/React.createElement("span", _extends({
    className: "span-hint"
  }, bindTrigger(spanPopupState)), /*#__PURE__*/React.createElement(ClockIcon, null)) : null), /*#__PURE__*/React.createElement("td", {
    "data-field": "action"
  }, /*#__PURE__*/React.createElement("button", _extends({
    className: "icon-button"
  }, bindTrigger(actionsPopupState)), /*#__PURE__*/React.createElement(KebabHorizontalIcon, null))), /*#__PURE__*/React.createElement("td", _extends({
    "data-field": "debit-account",
    "data-account-name": debitAccount
  }, bindTrigger(debitAccountPopupState)))), /*#__PURE__*/React.createElement(Popover, _extends({}, bindPopover(creditAccountPopupState), {
    anchorOrigin: {
      vertical: 'top',
      horizonal: 'center'
    },
    transformOrigin: {
      vertical: 'bottom',
      horizontal: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-popover credit-account-popover"
  }, /*#__PURE__*/React.createElement("h4", null, getValueFromOptions(accounts, creditAccount)))), /*#__PURE__*/React.createElement(Popover, _extends({}, bindPopover(debitAccountPopupState), {
    anchorOrigin: {
      vertical: 'top',
      horizonal: 'center'
    },
    transformOrigin: {
      vertical: 'bottom',
      horizontal: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-popover debit-account-popover"
  }, /*#__PURE__*/React.createElement("h4", null, getValueFromOptions(accounts, debitAccount)))), /*#__PURE__*/React.createElement(Popover, _extends({}, bindPopover(datePopupState), {
    anchorOrigin: {
      vertical: 'top',
      horizonal: 'center'
    },
    transformOrigin: {
      vertical: 'bottom',
      horizontal: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-popover"
  }, displayDate)), /*#__PURE__*/React.createElement(Popover, _extends({}, bindPopover(amountPopupState), {
    anchorOrigin: {
      vertical: 'top',
      horizonal: 'center'
    },
    transformOrigin: {
      vertical: 'bottom',
      horizontal: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-popover amount-popover"
  }, category ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h4", null, "Category"), /*#__PURE__*/React.createElement("div", null, getValueFromOptions(categories, category))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h4", null, "Synthetic Type"), /*#__PURE__*/React.createElement("div", null, getValueFromOptions(SYNTHETIC_TYPES, syntheticType))))), /*#__PURE__*/React.createElement(Popover, _extends({}, bindPopover(spanPopupState), {
    anchorOrigin: {
      vertical: 'top',
      horizonal: 'center'
    },
    transformOrigin: {
      vertical: 'bottom',
      horizontal: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-popover"
  }, "Effective from ", format(new Date(budgetStart), DATE_FIELD_FORMAT), " to", ' ', format(new Date(budgetEnd), DATE_FIELD_FORMAT), " (", budgetSpan, " weeks)")), /*#__PURE__*/React.createElement(Popover, _extends({}, bindPopover(notesPopupState), {
    anchorOrigin: {
      vertical: 'top',
      horizonal: 'center'
    },
    transformOrigin: {
      vertical: 'bottom',
      horizontal: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-popover"
  }, memo)), /*#__PURE__*/React.createElement(Popover, _extends({}, bindPopover(actionsPopupState), {
    anchorOrigin: {
      vertical: 'top',
      horizonal: 'center'
    },
    transformOrigin: {
      vertical: 'bottom',
      horizontal: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-popover actions-popover"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      actionsPopupState.close();
      dispatch(editTransaction(transaction));
      document.querySelector('.new-transaction').scrollIntoView();
    }
  }, "Edit"), /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      actionsPopupState.close();
      dispatch(intendToRemoveTransaction(transaction));
    }
  }, "Delete"))));
}
export default Transaction;