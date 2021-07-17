function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { useRef, useEffect } from 'https://cdn.skypack.dev/react@17';
import { InfoIcon } from 'https://cdn.skypack.dev/@primer/octicons-react@11';
import Button from 'https://cdn.skypack.dev/react-bootstrap@1/Button';
import Tooltip from 'https://cdn.skypack.dev/@material-ui/core@4/Tooltip';
const inputTypes = ['text', 'date', 'time', 'number', 'hidden'];

function Field(props) {
  const {
    type,
    label,
    name,
    hint,
    attributes,
    value,
    options,
    placeholder,
    handleChange,
    datalist,
    inputRef,
    afterButton,
    afterButtonAction,
    tabindex = 0
  } = props;
  let inputEl;

  if (inputTypes.includes(type)) {
    inputEl = /*#__PURE__*/React.createElement("input", _extends({
      className: "form-control",
      type: type,
      name: name,
      value: value,
      onChange: handleChange,
      ref: inputRef,
      placeholder: placeholder,
      tabIndex: tabindex
    }, attributes));
  } else if (type === 'select') {
    inputEl = /*#__PURE__*/React.createElement("select", {
      className: "form-control",
      name: name,
      value: value,
      onChange: handleChange,
      ref: inputRef,
      tabIndex: tabindex
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, placeholder || `Select ${label}`), options.map(option => {
      return /*#__PURE__*/React.createElement("option", {
        key: option.slug,
        value: option.slug
      }, option.value);
    }));
  } else if (type === 'textarea') {
    inputEl = /*#__PURE__*/React.createElement("textarea", {
      className: "form-control",
      name: name,
      value: value,
      placeholder: placeholder,
      onChange: handleChange,
      ref: inputRef,
      tabIndex: tabindex
    });
  } // no wrapper for hidden element


  if (type === 'hidden') {
    return inputEl;
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    "data-form-name": name
  }, /*#__PURE__*/React.createElement("label", {
    className: "control-label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "input-group"
  }, hint && /*#__PURE__*/React.createElement(Tooltip, {
    title: hint
  }, /*#__PURE__*/React.createElement("div", {
    className: "input-group-text hint"
  }, /*#__PURE__*/React.createElement(InfoIcon, null))), inputEl, afterButton && /*#__PURE__*/React.createElement("div", {
    className: "input-group-append"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline-secondary",
    tabIndex: tabindex,
    onClick: () => {
      if (afterButtonAction) {
        afterButtonAction();
      }
    }
  }, afterButton)), datalist && /*#__PURE__*/React.createElement("datalist", {
    id: attributes.list
  }, datalist.map(option => /*#__PURE__*/React.createElement("option", {
    key: option
  }, option)))));
}

export default Field;