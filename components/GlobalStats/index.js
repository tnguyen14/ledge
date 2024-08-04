function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React, { useState } from 'https://esm.sh/react@18.2.0';
import { useDispatch } from 'https://esm.sh/react-redux@9.1.1';
import Tabs from 'https://esm.sh/@mui/material@5.15.7/Tabs';
import Tab from 'https://esm.sh/@mui/material@5.15.7/Tab';
import Box from 'https://esm.sh/@mui/material@5.15.7/Box';
import WeeklyAverages from './WeeklyAverages.js';
import CategoriesChart from './CategoriesChart.js';
import CashflowChart from './CashflowChart.js';
import Budget from './Budget.js';
import { showCashflow, setSearchMode } from '../../slices/app.js';
function TabPanel(props) {
  const {
    children,
    value,
    index,
    ...other
  } = props;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tabpanel",
    hidden: value !== index,
    id: `simple-tabpanel-${index}`,
    "aria-labelledby": `simple-tab-${index}`
  }, other), value === index && /*#__PURE__*/React.createElement(Box, {
    className: "tab-content"
  }, children));
}
function GlobalStats() {
  const dispatch = useDispatch();
  const [tab, setTab] = useState(1);
  return /*#__PURE__*/React.createElement("div", {
    className: "stats global-stats"
  }, /*#__PURE__*/React.createElement(Tabs, {
    className: "tabs-selector",
    variant: "scrollable",
    value: tab,
    onChange: (e, newValue) => {
      setTab(newValue);
      // search
      if (newValue == 0) {
        dispatch(setSearchMode(true));
      } else {
        dispatch(setSearchMode(false));
      }
      // cashflow
      if (newValue == 3) {
        dispatch(showCashflow(true));
      } else {
        dispatch(showCashflow(false));
      }
    }
  }, /*#__PURE__*/React.createElement(Tab, {
    label: "Search"
  }), /*#__PURE__*/React.createElement(Tab, {
    label: "Chart"
  }), /*#__PURE__*/React.createElement(Tab, {
    label: "Averages"
  }), /*#__PURE__*/React.createElement(Tab, {
    label: "Cash Flow"
  }), /*#__PURE__*/React.createElement(Tab, {
    label: "Budget"
  })), /*#__PURE__*/React.createElement(TabPanel, {
    value: tab,
    index: 0
  }), /*#__PURE__*/React.createElement(TabPanel, {
    value: tab,
    index: 1
  }, /*#__PURE__*/React.createElement(CategoriesChart, null)), /*#__PURE__*/React.createElement(TabPanel, {
    className: "weekly-averages",
    value: tab,
    index: 2
  }, /*#__PURE__*/React.createElement(WeeklyAverages, null)), /*#__PURE__*/React.createElement(TabPanel, {
    value: tab,
    index: 3
  }, /*#__PURE__*/React.createElement(CashflowChart, null)), /*#__PURE__*/React.createElement(TabPanel, {
    value: tab,
    index: 4
  }, /*#__PURE__*/React.createElement(Budget, null)));
}
export default GlobalStats;