function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React, { useMemo, useCallback } from 'https://esm.sh/react@18';
import { useSelector, useDispatch } from 'https://esm.sh/react-redux@9';
import produce from 'https://esm.sh/immer@9';
import Popover from 'https://esm.sh/@mui/material@5.15.7/Popover';
import { usePopupState, bindPopover, bindTrigger } from 'https://esm.sh/material-ui-popup-state@5/hooks';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import { patchMeta, getTransactions } from '../../util/api.js';
import { getWeekStart, getWeekEnd, getWeekId, getYearStart, getYearEnd } from '../../selectors/week.js';
import { getWeekById, calculateWeeklyAverage, getCurrentYearWeeklyAverage } from '../../selectors/transactions.js';
import { updateYearStats, updateYearStatsSuccess } from '../../slices/meta.js';
function AverageWithCategories({
  numWeeks,
  startWeekEnd,
  endWeekStart,
  weeks
}) {
  const transactions = Array.prototype.concat(...weeks.map(week => week.transactions));
  const categories = useSelector(state => [...state.meta.expenseCategories].reverse());
  const popupState = usePopupState({
    variant: 'popover',
    popupId: `${endWeekStart}-average-popup`
  });
  const categoriesTotals = categories.map(({
    slug,
    value: label
  }) => ({
    slug,
    label,
    amount: calculateWeeklyAverage({
      numWeeks,
      transactions: transactions.filter(t => t.category == slug)
    })
  })).filter(stat => stat.amount > 0).sort((a, b) => b.amount - a.amount);
  return /*#__PURE__*/React.createElement("tr", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", bindTrigger(popupState), "Prev. ", numWeeks, " weeks (", `${startWeekEnd.toFormat('LLL d')} - ${endWeekStart.toFormat('LLL d')}`, ")")), /*#__PURE__*/React.createElement("td", null, usd(calculateWeeklyAverage({
    numWeeks,
    transactions
  }))), /*#__PURE__*/React.createElement(Popover, _extends({}, bindPopover(popupState), {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "stat-popover"
  }, /*#__PURE__*/React.createElement("h5", null, "Prev. ", numWeeks, " weeks"), /*#__PURE__*/React.createElement("div", {
    className: "explanation"
  }, categoriesTotals.map(({
    slug,
    label,
    amount
  }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    "data-cat": slug
  }, /*#__PURE__*/React.createElement("span", {
    className: "legend"
  }, "\xA0"), label), /*#__PURE__*/React.createElement("span", null, usd(amount))))))));
}
function WeeklyAverages() {
  const dispatch = useDispatch();
  const transactions = useSelector(state => state.transactions);
  const yearStats = useSelector(state => state.meta.stats);
  const currentYearAverage = getCurrentYearWeeklyAverage({
    transactions
  });
  const timespans = useMemo(() => {
    return [{
      start: -1,
      end: -4
    }, {
      start: -1,
      end: -12
    }, {
      start: -1,
      end: -24
    }, {
      start: -1,
      end: -48
    }].map(span => {
      const weeks = [];
      for (let offset = span.start; offset >= span.end; offset--) {
        const weekId = getWeekId({
          date: new Date(),
          offset
        });
        weeks.push(getWeekById({
          transactions,
          weekId
        }));
      }
      return {
        ...span,
        numWeeks: span.start - span.end + 1,
        startWeekEnd: getWeekEnd({
          date: new Date(),
          offset: span.start
        }),
        endWeekStart: getWeekStart({
          date: new Date(),
          offset: span.end
        }),
        weeks
      };
    });
  }, [transactions]);
  const recalculateYearStats = useCallback(async year => {
    dispatch(updateYearStats(year));
    const transactions = await getTransactions(getYearStart(year), getYearEnd(year));
    const weeklyAverage = calculateWeeklyAverage({
      transactions,
      numWeeks: 52
    });
    const stats = produce(yearStats, draft => {
      if (!draft[year]) {
        draft[year] = {
          weeklyAverage
        };
      } else {
        draft[year].weeklyAverage = weeklyAverage;
      }
    });
    await patchMeta({
      stats
    });
    dispatch(updateYearStatsSuccess({
      year,
      stat: stats[year]
    }));
  }, [dispatch, yearStats]);
  return /*#__PURE__*/React.createElement("div", {
    className: "averages"
  }, /*#__PURE__*/React.createElement("table", {
    className: "table table-borderless"
  }, /*#__PURE__*/React.createElement("tbody", null, timespans.map(span => /*#__PURE__*/React.createElement(AverageWithCategories, _extends({
    key: span.endWeekStart
  }, span))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "\xA0")), /*#__PURE__*/React.createElement("tr", {
    className: "stat",
    key: currentYearAverage.year
  }, /*#__PURE__*/React.createElement("td", null, currentYearAverage.year, " (", currentYearAverage.numWeeks, " weeks)"), /*#__PURE__*/React.createElement("td", null, usd(currentYearAverage.value))), Object.keys(yearStats).sort((a, b) => Number(b) - Number(a)).map(year => /*#__PURE__*/React.createElement("tr", {
    className: "stat",
    key: year
  }, /*#__PURE__*/React.createElement("td", null, year), /*#__PURE__*/React.createElement("td", {
    style: {
      cursor: 'pointer'
    },
    title: "Double click to re-calculate",
    onDoubleClick: () => {
      dispatch(recalculateYearStats.bind(null, year));
    }
  }, yearStats[year].updating ? 'Updating...' : usd(yearStats[year].weeklyAverage)))))));
}
export default WeeklyAverages;