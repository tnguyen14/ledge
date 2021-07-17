import React from 'https://cdn.skypack.dev/react@17';
import { useDispatch, useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import Dialog from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/Dialog';
import DialogTitle from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/DialogTitle';
import DialogContent from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/DialogContent';
import DialogContentText from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/DialogContentText';
import DialogActions from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/DialogActions';
import Button from 'https://cdn.skypack.dev/react-bootstrap@1/Button';
import { CANCEL_REMOVE_TRANSACTION } from '../../actions/account.js';
import { removeTransaction } from '../../actions/transaction.js';

function DeleteDialog(props) {
  const isRemovingTransaction = useSelector(state => state.account.isRemovingTransaction);
  const transactionToBeRemoved = useSelector(state => state.account.transactionToBeRemoved);
  const dispatch = useDispatch();

  function cancelRemoveTransaction() {
    dispatch({
      type: CANCEL_REMOVE_TRANSACTION
    });
  }

  return /*#__PURE__*/React.createElement(Dialog, {
    "data-cy": "delete-dialog",
    open: isRemovingTransaction,
    onClose: cancelRemoveTransaction
  }, /*#__PURE__*/React.createElement(DialogTitle, null, "Delete Transaction"), /*#__PURE__*/React.createElement(DialogContent, null, /*#__PURE__*/React.createElement(DialogContentText, null, "Are you sure you want to delete this transaction?")), /*#__PURE__*/React.createElement(DialogActions, null, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: cancelRemoveTransaction
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    onClick: () => dispatch(removeTransaction(transactionToBeRemoved))
  }, "Delete")));
}

export default DeleteDialog;