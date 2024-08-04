import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import { useSelector, useDispatch } from 'https://esm.sh/react-redux@9.1.1';
import { format } from 'https://esm.sh/date-fns@2';
import Button from 'https://esm.sh/react-bootstrap@2.10.2/Button';
import { ChevronLeftIcon, ChevronRightIcon } from 'https://esm.sh/@primer/octicons-react@11';
import { setDisplayFrom } from '../../slices/app.js';
import { getPastMonthsIds, getMonthEnd, getWeekStartFromWeekId } from '../../selectors/week.js';
import { getMonthsCashflow } from '../../selectors/stats.js';
import { getMonths } from '../../selectors/transactions.js';
import Chart from '../Chart/index.js';
import CashflowBar from './CashflowBar.js';
function CashflowChart() {
  const dispatch = useDispatch();
  const displayFrom = useSelector(state => state.app.displayFrom);
  const transactions = useSelector(state => state.transactions);
  const accounts = useSelector(state => state.meta.accounts);
  const months = getMonths({
    transactions
  });
  const [monthsIds, setMonthsIds] = useState([]);
  useEffect(() => {
    setMonthsIds(getPastMonthsIds({
      date: getWeekStartFromWeekId({
        weekId: displayFrom
      }),
      numMonths: 12
    }));
  }, [displayFrom]);
  const [monthsCashflow, setMonthsCashflow] = useState({});
  useEffect(() => {
    setMonthsCashflow(getMonthsCashflow({
      transactions: months,
      monthsIds,
      accounts
    }));
  }, [monthsIds, accounts, months]);
  return /*#__PURE__*/React.createElement("div", {
    className: "cashflow-chart"
  }, /*#__PURE__*/React.createElement(Chart, {
    maxAmount: 18000,
    intervalAmount: 3000,
    chartTop: /*#__PURE__*/React.createElement("div", {
      className: "nav"
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "light",
      onClick: () => {
        dispatch(setDisplayFrom(getMonthEnd({
          date: getWeekStartFromWeekId({
            weekId: displayFrom
          }),
          offset: -1
        }).toISODate()));
      }
    }, /*#__PURE__*/React.createElement(ChevronLeftIcon, null)), /*#__PURE__*/React.createElement(Button, {
      variant: "light",
      onClick: () => dispatch(setDisplayFrom(getMonthEnd({
        date: getWeekStartFromWeekId({
          weekId: displayFrom
        }),
        offset: 1
      }).toISODate()))
    }, /*#__PURE__*/React.createElement(ChevronRightIcon, null))),
    chartBody: /*#__PURE__*/React.createElement("div", {
      className: "months-graph"
    }, monthsIds.map(id => /*#__PURE__*/React.createElement(CashflowBar, {
      key: id,
      monthId: id,
      data: monthsCashflow.months[id]
    }))),
    xLabels: /*#__PURE__*/React.createElement("div", {
      className: "months-labels"
    }, monthsIds.map(id => /*#__PURE__*/React.createElement("div", {
      key: id,
      className: "month-label"
    }, format(new Date(`${id}-01 00:00`), 'MMM yy'))))
  }));
}
export default CashflowChart;