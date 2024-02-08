import React, { useState } from 'https://esm.sh/react@18';
import { useSelector, useDispatch } from 'https://esm.sh/react-redux@9';
import classnames from 'https://esm.sh/classnames@2';
import { useAuth0 } from 'https://esm.sh/@auth0/auth0-react@2';
import { setUserSettingsOpen } from '../../slices/app.js';
function UserMenu() {
  const [profileActive, setProfileActive] = useState(false);
  const {
    isAuthenticated,
    user,
    logout
  } = useAuth0();
  const dispatch = useDispatch();
  const token = useSelector(state => state.app.token);
  if (!isAuthenticated) {
    return null;
  }
  if (!user) {
    console.error('User object is not available');
    return null;
  }
  if (!user.picture) {
    console.error('user.picture is not defined');
  }
  return /*#__PURE__*/React.createElement("div", {
    className: classnames('user', {
      'profile-active': profileActive
    })
  }, /*#__PURE__*/React.createElement("img", {
    src: user.picture,
    onClick: () => {
      setProfileActive(!profileActive);
    }
  }), /*#__PURE__*/React.createElement("ul", {
    className: "profile"
  }, /*#__PURE__*/React.createElement("li", null, user.name), /*#__PURE__*/React.createElement("li", {
    className: "settings",
    onClick: () => dispatch(setUserSettingsOpen(true))
  }, "Settings"), /*#__PURE__*/React.createElement("li", {
    className: "jwt-token"
  }, /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, "JWT Token"), token)), /*#__PURE__*/React.createElement("li", {
    className: "logout",
    onClick: () => logout({
      logoutParams: {
        returnTo: window.location.href
      }
    })
  }, "Log Out")));
}
export default UserMenu;