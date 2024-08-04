import React from 'https://esm.sh/react@18.2.0';
function Chart(props) {
  const {
    chartTop,
    chartBody,
    xLabels,
    maxAmount,
    intervalAmount
  } = props;
  const MAX_BAR_HEIGHT = 500;
  const PX_PER_UNIT = MAX_BAR_HEIGHT / maxAmount;
  const NUM_INTERVALS = maxAmount / intervalAmount;
  const INTERVAL_HEIGHT = intervalAmount * PX_PER_UNIT;
  return /*#__PURE__*/React.createElement("div", {
    className: "chart",
    style: {
      '--px-per-unit-height': `${PX_PER_UNIT}px`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "chart-top"
  }, chartTop), /*#__PURE__*/React.createElement("div", {
    className: "y-axis"
  }, [...Array(NUM_INTERVALS).keys()].map(index => {
    return /*#__PURE__*/React.createElement("div", {
      key: index,
      className: "interval",
      style: {
        height: `${INTERVAL_HEIGHT}px`
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "label"
    }, intervalAmount * (index + 1)));
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid-lines"
  }, [...Array(NUM_INTERVALS).keys()].map(index => {
    return /*#__PURE__*/React.createElement("div", {
      key: index,
      className: "interval",
      style: {
        height: `${INTERVAL_HEIGHT}px`
      }
    });
  })), /*#__PURE__*/React.createElement("div", {
    className: "chart-body"
  }, chartBody), /*#__PURE__*/React.createElement("div", {
    className: "spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "x-axis"
  }, xLabels));
}
export default Chart;