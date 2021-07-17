import React from 'https://cdn.skypack.dev/react@17';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import Badge from 'https://cdn.skypack.dev/react-bootstrap@1/Badge';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import classnames from 'https://cdn.skypack.dev/classnames@2';
import { PencilIcon, XIcon, ClockIcon } from 'https://cdn.skypack.dev/@primer/octicons-react@11';
import Tooltip from 'https://cdn.skypack.dev/@material-ui/core@4/Tooltip';
import useToggle from '../../hooks/useToggle.js';
import { TIMEZONE, DISPLAY_DATE_FORMAT, DISPLAY_DAY_FORMAT } from '../../util/constants.js';

function getValueFromOptions(options, slug) {
  let option = options.find(opt => opt.slug === slug);

  if (option) {
    return option.value;
  }
}

function Transaction(props) {
  const [active, toggleActive] = useToggle(false);
  const {
    id,
    date,
    amount,
    merchant,
    category,
    source,
    description,
    span,
    handleEdit,
    handleRemove,
    options
  } = props; // show day as in origin timezone, while date in local timezone

  const displayDay = format(utcToZonedTime(date, TIMEZONE), DISPLAY_DAY_FORMAT);
  const displayDate = format(new Date(date), DISPLAY_DATE_FORMAT);
  return /*#__PURE__*/React.createElement("tr", {
    id: id,
    className: classnames('transaction', {
      'table-active': active
    }),
    onClick: toggleActive,
    "data-day": displayDay,
    "data-date": date
  }, /*#__PURE__*/React.createElement("td", {
    "data-field": "day"
  }, /*#__PURE__*/React.createElement(Tooltip, {
    title: displayDate
  }, /*#__PURE__*/React.createElement("span", null, displayDay))), /*#__PURE__*/React.createElement("td", {
    "data-field": "merchant"
  }, merchant), /*#__PURE__*/React.createElement("td", {
    "data-field": "amount",
    "data-cat": category
  }, /*#__PURE__*/React.createElement(Badge, {
    pill: true
  }, usd(amount)), span > 1 ? /*#__PURE__*/React.createElement(Tooltip, {
    title: `Span ${span} weeks`
  }, /*#__PURE__*/React.createElement("span", {
    className: "span-hint"
  }, /*#__PURE__*/React.createElement(ClockIcon, null))) : null), /*#__PURE__*/React.createElement("td", {
    "data-field": "source"
  }, getValueFromOptions(options.sources, source)), /*#__PURE__*/React.createElement("td", {
    "data-field": "description"
  }, description), /*#__PURE__*/React.createElement("td", {
    "data-field": "category"
  }, getValueFromOptions(options.categories, category)), /*#__PURE__*/React.createElement("td", {
    "data-field": "action"
  }, /*#__PURE__*/React.createElement("a", {
    className: "edit",
    onClick: handleEdit
  }, /*#__PURE__*/React.createElement(PencilIcon, null)), /*#__PURE__*/React.createElement("a", {
    className: "remove",
    onClick: handleRemove
  }, /*#__PURE__*/React.createElement(XIcon, null))));
}

export default Transaction;