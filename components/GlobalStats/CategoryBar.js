function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from 'https://esm.sh/react@18.2.0';
import Popover from 'https://esm.sh/@mui/material@5.15.7/Popover';
import { usePopupState, bindPopover, bindTrigger } from 'https://esm.sh/material-ui-popup-state@5.1.0/hooks';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import classnames from 'https://esm.sh/classnames@2';
function CategoryBar(props) {
  const {
    categories,
    week: {
      label,
      categoriesTotals
    }
  } = props;
  const popupState = usePopupState({
    variant: 'popover',
    popupId: `${label}-chart-popup`
  });

  // make bar-piece a child of data-cat to use styles
  // defined in style.css
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", _extends({
    className: classnames('chart-column', 'week-column', {
      'has-popup-open': popupState.isOpen
    })
  }, bindTrigger(popupState)), categoriesTotals && categories.map(cat => {
    if (!categoriesTotals[cat.slug]) {
      return null;
    }
    return /*#__PURE__*/React.createElement("div", {
      key: cat.slug,
      "data-cat": cat.slug
    }, /*#__PURE__*/React.createElement("div", {
      className: "bar-piece",
      style: {
        height: `calc(${categoriesTotals[cat.slug].amount / 100} * var(--px-per-unit-height)
                  )`
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
    className: "stat-popover"
  }, /*#__PURE__*/React.createElement("h5", null, label), /*#__PURE__*/React.createElement("div", {
    className: "explanation"
  }, categoriesTotals && categories.map(({
    slug
  }) => {
    if (!categoriesTotals[slug]) {
      return null;
    }
    const {
      label,
      amount
    } = categoriesTotals[slug];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      "data-cat": slug
    }, /*#__PURE__*/React.createElement("span", {
      className: "legend"
    }, "\xA0"), label), /*#__PURE__*/React.createElement("span", null, usd(amount)));
  }).reverse()))));
}
export default CategoryBar;