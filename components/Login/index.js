import React from 'https://cdn.skypack.dev/react@17';
import { useAuth0 } from 'https://cdn.skypack.dev/@auth0/auth0-react@1';
import Button from 'https://cdn.skypack.dev/react-bootstrap@1/Button';

function Login() {
  const {
    loginWithRedirect
  } = useAuth0();
  return /*#__PURE__*/React.createElement("div", {
    className: "login"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: loginWithRedirect
  }, "Log In"));
}

export default Login;