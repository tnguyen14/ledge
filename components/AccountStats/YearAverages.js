import React, { useEffect } from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import { getYearAverages } from '../../selectors/transactions.js';

function YearAverages(props) {
  const yearsToLoad = useSelector(state => state.app.yearsToLoad);
  const averages = useSelector(getYearAverages);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("table", {
    className: "table table-borderless"
  }, /*#__PURE__*/React.createElement("tbody", null, averages.map(average => /*#__PURE__*/React.createElement("tr", {
    className: "stat",
    key: average.year
  }, /*#__PURE__*/React.createElement("td", null, average.year, " (", average.numWeeks, " weeks)"), /*#__PURE__*/React.createElement("td", null, usd(average.weeklyAverage)))))));
}

export default YearAverages;