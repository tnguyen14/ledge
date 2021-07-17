import React, { useState } from 'https://cdn.skypack.dev/react@17';
import { useSelector, useDispatch } from 'https://cdn.skypack.dev/react-redux@7';
import Button from 'https://cdn.skypack.dev/react-bootstrap@1/Button';
import { ChevronLeftIcon, ChevronRightIcon } from 'https://cdn.skypack.dev/@primer/octicons-react@11';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import ChartBar from './ChartBar.js';
import { getCategoriesTotalsStats } from '../../selectors/stats.js';
import { getWeekId, getWeekStartFromWeekId } from '../../selectors/week.js';
import { getVisibleWeeks } from '../../selectors/weeks.js';
import { getWeekById } from '../../selectors/transactions.js';
import { TIMEZONE } from '../../util/constants.js';
import { setDisplayFrom } from '../../actions/app.js';

function CategoriesChart() {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.account.categories);
  const transactions = useSelector(state => state.transactions);
  const MAX_WEEK_AMOUNT = 2000; // assumption

  const INTERVAL_AMOUNT = 400;
  const HEIGHT_FACTOR = 500 / MAX_WEEK_AMOUNT; // 500px is height of a bar

  const visibleWeeksIds = useSelector(state => getVisibleWeeks(state.app.weeksMeta));
  const weeks = visibleWeeksIds.map(weekId => {
    return getWeekById({
      transactions,
      weekId
    });
  }).map(week => {
    if (!week || !week.start) {
      return {};
    }

    const stats = getCategoriesTotalsStats({
      transactions: week.transactions,
      categories
    }); // add a space after / to allow label to "break" to new line
    // on small screen

    const label = format(utcToZonedTime(week.start, TIMEZONE), 'M/ d');
    const categoryTotals = stats.reduce((totals, stat) => {
      totals[stat.slug] = { ...stat
      };
      return totals;
    }, {});
    return { ...week,
      categoryTotals,
      label
    };
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "categories-chart"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "light",
    onClick: () => {
      dispatch(setDisplayFrom(getWeekId({
        date: getWeekStartFromWeekId({
          weekId: visibleWeeksIds[0]
        }),
        offset: -1
      })));
    }
  }, /*#__PURE__*/React.createElement(ChevronLeftIcon, null)), /*#__PURE__*/React.createElement(Button, {
    variant: "light",
    onClick: () => dispatch(setDisplayFrom(getWeekId({
      date: getWeekStartFromWeekId({
        weekId: visibleWeeksIds[0]
      }),
      offset: 1
    })))
  }, /*#__PURE__*/React.createElement(ChevronRightIcon, null))), /*#__PURE__*/React.createElement("div", {
    className: "y-axis"
  }, [...Array(MAX_WEEK_AMOUNT / INTERVAL_AMOUNT).keys()].map(index => {
    return /*#__PURE__*/React.createElement("div", {
      className: "interval",
      style: {
        height: `${INTERVAL_AMOUNT * HEIGHT_FACTOR}px`
      }
    }, INTERVAL_AMOUNT * (index + 1));
  })), /*#__PURE__*/React.createElement("div", {
    className: "chart"
  }, weeks.map(week => {
    return /*#__PURE__*/React.createElement(ChartBar, {
      categories: categories,
      week: week,
      heightFactor: HEIGHT_FACTOR
    });
  })), /*#__PURE__*/React.createElement("div", {
    className: "spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "x-axis"
  }, weeks.map(week => {
    return /*#__PURE__*/React.createElement("div", {
      class: "week-label"
    }, week.label);
  })));
}

export default CategoriesChart;