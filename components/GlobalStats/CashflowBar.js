function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from 'https://esm.sh/react@18';
import { useSelector } from 'https://esm.sh/react-redux@9';
import Popover from 'https://esm.sh/@mui/material@5.15.7/Popover';
import { usePopupState, bindPopover, bindTrigger } from 'https://esm.sh/material-ui-popup-state@5/hooks';
import classnames from 'https://esm.sh/classnames@2';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import { getValueFromOptions } from '../../util/slug.js';

// const { usePopupState, bindPopover, bindTrigger } = PopupState;

function CashflowBar({
  data,
  monthId
}) {
  const accounts = useSelector(state => state.meta.accounts);
  const popupState = usePopupState({
    variant: 'popover',
    popupId: `${monthId}-cashflow-bar-popup`
  });
  if (!data) {
    return null;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", _extends({
    className: classnames('chart-column', 'cashflow-column', {
      'has-popup-open': popupState.isOpen
    })
  }, bindTrigger(popupState)), ['debit', 'credit'].map(flow => /*#__PURE__*/React.createElement("div", {
    key: flow,
    className: `${flow}-column`
  }, Object.entries(data[flow].accounts).map(([account, total], index) => /*#__PURE__*/React.createElement("div", {
    key: account,
    className: "bar-piece",
    "data-account": account,
    "data-account-index": index,
    style: {
      height: `calc(${total / 100} * var(--px-per-unit-height))`
    }
  }))))), /*#__PURE__*/React.createElement(Popover, _extends({}, bindPopover(popupState), {
    anchorOrigin: {
      vertical: 'center',
      horizontal: 'right'
    },
    transformOrigin: {
      vertical: 'center',
      horizontal: 'left'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "stat-popover"
  }, /*#__PURE__*/React.createElement("h4", null, monthId), ['debit', 'credit'].map(flow => /*#__PURE__*/React.createElement("div", {
    key: flow,
    className: "flow-details"
  }, /*#__PURE__*/React.createElement("h5", null, flow), /*#__PURE__*/React.createElement("div", {
    className: "explanation"
  }, Object.entries(data[flow].accounts).map(([account, accountTotal]) => {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      key: account
    }, getValueFromOptions(accounts, account)), /*#__PURE__*/React.createElement("span", null, usd(accountTotal)));
  }), /*#__PURE__*/React.createElement("span", {
    className: "total"
  }, "Total"), /*#__PURE__*/React.createElement("span", {
    className: "total"
  }, usd(data[flow].total))))))));
}
export default CashflowBar;