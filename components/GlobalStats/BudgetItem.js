function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from 'https://esm.sh/react@18';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import { NoteIcon } from 'https://esm.sh/@primer/octicons-react@15';
import Popover from 'https://esm.sh/@mui/material@5.15.7/Popover';
import { usePopupState, bindPopover, bindTrigger } from 'https://esm.sh/material-ui-popup-state@5/hooks';

// const { usePopupState, bindPopover, bindTrigger } = PopupState;

function BudgetSubCategoryItem({
  category,
  details
}) {
  const memoPopupState = usePopupState({
    variant: 'popover',
    popupId: `${category}-memo`
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, category, details.memo && /*#__PURE__*/React.createElement("button", _extends({
    className: "icon-button"
  }, bindTrigger(memoPopupState)), /*#__PURE__*/React.createElement(NoteIcon, null))), /*#__PURE__*/React.createElement("td", null, usd(details.amount * 100))), /*#__PURE__*/React.createElement(Popover, bindPopover(memoPopupState), details.memo && /*#__PURE__*/React.createElement("div", {
    className: "text-popover"
  }, details.memo)));
}
function BudgetItem({
  category,
  details
}) {
  const memoPopupState = usePopupState({
    variant: 'popover',
    popupId: `${category}-memo`
  });
  let subBudgetTally = 0;
  const subBudget = Object.entries(details).reduce((budget, [subCategory, subDetails]) => {
    if (subCategory == 'amount' || subCategory == 'memo') {
      return budget;
    }
    budget[subCategory] = subDetails;
    subBudgetTally += subDetails.amount;
    return budget;
  }, {});
  let subBudgetTallyStatus = 'match';
  if (Object.keys(subBudget).length) {
    if (details.amount < subBudgetTally) {
      subBudgetTallyStatus = 'exceed';
    } else if (details.amount > subBudgetTally) {
      subBudgetTallyStatus = 'short';
    }
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("tr", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("td", null, Object.keys(subBudget).length ? /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, category, details.memo && /*#__PURE__*/React.createElement("button", _extends({
    className: "icon-button"
  }, bindTrigger(memoPopupState)), /*#__PURE__*/React.createElement(NoteIcon, null))), /*#__PURE__*/React.createElement("table", {
    className: "table table-borderless"
  }, /*#__PURE__*/React.createElement("tbody", null, details && Object.entries(subBudget).map(([subCategory, subDetails]) => {
    return /*#__PURE__*/React.createElement(BudgetSubCategoryItem, {
      key: subCategory,
      category: subCategory,
      details: subDetails
    });
  })))) : /*#__PURE__*/React.createElement("div", null, category, details.memo && /*#__PURE__*/React.createElement("button", _extends({
    className: "icon-button"
  }, bindTrigger(memoPopupState)), /*#__PURE__*/React.createElement(NoteIcon, null)))), /*#__PURE__*/React.createElement("td", {
    className: `sub-budget-tally-${subBudgetTallyStatus}`
  }, usd(details.amount * 100))), /*#__PURE__*/React.createElement(Popover, bindPopover(memoPopupState), details.memo && /*#__PURE__*/React.createElement("div", {
    className: "text-popover"
  }, details.memo)));
}
export default BudgetItem;