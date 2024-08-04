import React from 'https://esm.sh/react@18.2.0';
import { useAuth0 } from 'https://esm.sh/@auth0/auth0-react@2';
import Button from 'https://esm.sh/react-bootstrap@2.10.2/Button';
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