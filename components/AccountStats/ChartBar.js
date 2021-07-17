function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'https://cdn.skypack.dev/react@17';
import Popover from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/Popover';
import PopupState from 'https://cdn.skypack.dev/material-ui-popup-state/hooks';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import classnames from 'https://cdn.skypack.dev/classnames@2';
const {
  usePopupState,
  bindPopover,
  bindTrigger
} = PopupState;

function ChartBar(props) {
  const {
    categories,
    heightFactor,
    week
  } = props;
  const popupState = usePopupState({
    variant: 'popover',
    popupId: `${week.label}-chart-popup`
  });

  if (!week.categoryTotals) {
    return null;
  } // make bar-piece a child of data-cat to use styles
  // defined in style.css


  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", _extends({
    class: classnames('week-column', {
      'has-popup-open': popupState.isOpen
    })
  }, bindTrigger(popupState)), categories.map(cat => {
    if (!week.categoryTotals[cat.slug]) {
      return null;
    }

    return /*#__PURE__*/React.createElement("div", {
      "data-cat": cat.slug
    }, /*#__PURE__*/React.createElement("div", {
      className: "bar-piece",
      style: {
        height: `${week.categoryTotals[cat.slug].amount / 100 * heightFactor}px`
      }
    }));
  })), /*#__PURE__*/React.createElement(Popover, _extends({}, bindPopover(popupState), {
    anchorOrigin: {
      vertical: 'center',
      horizontal: 'right'
    },
    transformOrigin: {
      vertical: 'center',
      horizontal: 'left'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "chart-bar-popover"
  }, /*#__PURE__*/React.createElement("h5", null, week.label), /*#__PURE__*/React.createElement("div", {
    className: "explanation"
  }, categories.map(cat => {
    if (!week.categoryTotals[cat.slug]) {
      return null;
    }

    const stat = week.categoryTotals[cat.slug];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      "data-cat": stat.slug
    }, /*#__PURE__*/React.createElement("span", {
      className: "legend"
    }, "\xA0"), stat.label), /*#__PURE__*/React.createElement("span", null, usd(stat.amount)));
  }).reverse()))));
}

export default ChartBar;