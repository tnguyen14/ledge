import React from 'https://esm.sh/react@18';
import { useSelector, useDispatch } from 'https://esm.sh/react-redux@9';
import { useAuth0 } from 'https://esm.sh/@auth0/auth0-react@2';
import { setDisplayFrom } from '../../slices/app.js';
import UserMenu from './UserMenu.js';
import Field from '../Form/Field.js';
function Header() {
  const dispatch = useDispatch();
  const {
    isAuthenticated
  } = useAuth0();
  const displayFrom = useSelector(state => state.app.displayFrom);
  return /*#__PURE__*/React.createElement("div", {
    className: "header"
  }, /*#__PURE__*/React.createElement("h1", null, "Ledge"), isAuthenticated && /*#__PURE__*/React.createElement(Field, {
    className: "display-from",
    type: "date",
    value: displayFrom,
    handleChange: event => {
      dispatch(setDisplayFrom(event.target.value));
    }
  }), /*#__PURE__*/React.createElement(UserMenu, null));
}
export default Header;