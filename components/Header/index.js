import React from 'https://cdn.skypack.dev/react@17';
import UserMenu from './UserMenu.js';

function Header() {
  return /*#__PURE__*/React.createElement("div", {
    className: "header"
  }, /*#__PURE__*/React.createElement("h1", null, "Ledge"), /*#__PURE__*/React.createElement(UserMenu, null));
}

export default Header;