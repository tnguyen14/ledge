import React, { useState, useEffect } from 'https://esm.sh/react@18';
import { useSelector } from 'https://esm.sh/react-redux@9';
import Snackbar from 'https://esm.sh/@mui/material@5.15.7/Snackbar';
function Notification() {
  const {
    content,
    autohide
  } = useSelector(state => state.app.notification);
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(content != '');
  }, [content]);
  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setShow(false);
  }
  return /*#__PURE__*/React.createElement(Snackbar, {
    open: show,
    onClose: handleClose,
    autoHideDuration: autohide,
    message: content
  });
}
export default Notification;