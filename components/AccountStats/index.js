function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { useState } from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import Tabs from 'https://cdn.skypack.dev/@material-ui/core@4/Tabs';
import Tab from 'https://cdn.skypack.dev/@material-ui/core@4/Tab';
import Box from 'https://cdn.skypack.dev/@material-ui/core@4/Box';
import WeeklyAverages from './WeeklyAverages.js';
import CategoriesChart from './CategoriesChart.js';
import YearAverages from './YearAverages.js';

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

function AccountStats(props) {
  const [tab, setTab] = useState(0);
  const yearsToLoad = useSelector(state => state.app.yearsToLoad);
  return /*#__PURE__*/React.createElement("div", {
    className: "stats account-stats"
  }, /*#__PURE__*/React.createElement(Tabs, {
    className: "tabs-selector",
    value: tab,
    onChange: (e, newValue) => {
      setTab(newValue);
    }
  }, /*#__PURE__*/React.createElement(Tab, {
    label: "Weekly Chart"
  }), /*#__PURE__*/React.createElement(Tab, {
    className: "weekly-averages",
    label: "Weekly Averages"
  }), /*#__PURE__*/React.createElement(Tab, {
    label: `Past ${yearsToLoad} Years`
  })), /*#__PURE__*/React.createElement(TabPanel, {
    value: tab,
    index: 0
  }, /*#__PURE__*/React.createElement(CategoriesChart, null)), /*#__PURE__*/React.createElement(TabPanel, {
    className: "weekly-averages",
    value: tab,
    index: 1
  }, /*#__PURE__*/React.createElement(WeeklyAverages, null)), /*#__PURE__*/React.createElement(TabPanel, {
    value: tab,
    index: 2
  }, /*#__PURE__*/React.createElement(YearAverages, null)));
}

export default AccountStats;