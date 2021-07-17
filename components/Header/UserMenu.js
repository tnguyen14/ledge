import React, { useState } from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import classNames from 'https://cdn.skypack.dev/classnames@2';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { useAuth0 } from 'https://cdn.skypack.dev/@auth0/auth0-react@1';

function UserMenu(props) {
  const [profileActive, setProfileActive] = useState(false);
  const {
    isAuthenticated,
    user,
    logout
  } = useAuth0();
  const token = useSelector(state => state.app.token);

  if (!isAuthenticated) {
    return null;
  }

  return /*#__PURE__*/React.createElement("div", {
    className: classNames('user', {
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
    className: "jwt-token"
  }, token), /*#__PURE__*/React.createElement("li", {
    className: "logout",
    onClick: () => logout({
      returnTo: window.location.href
    })
  }, "Log Out")));
}

export default UserMenu;