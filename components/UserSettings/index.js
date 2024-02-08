import React, { useState, useCallback } from 'https://esm.sh/react@18';
import { useSelector, useDispatch } from 'https://esm.sh/react-redux@9';
import Dialog from 'https://esm.sh/@mui/material@5.15.7/Dialog';
import DialogTitle from 'https://esm.sh/@mui/material@5.15.7/DialogTitle';
import DialogContent from 'https://esm.sh/@mui/material@5.15.7/DialogContent';
import DialogActions from 'https://esm.sh/@mui/material@5.15.7/DialogActions';
import Button from 'https://esm.sh/react-bootstrap@2/Button';
import classnames from 'https://esm.sh/classnames@2';
import { TrashIcon, XCircleIcon } from 'https://esm.sh/@primer/octicons-react@15';
import { addAccount, removeAccount, cancelRemoveAccount, addCategory, removeCategory, cancelRemoveCategory, updateUserSettings, updateUserSettingsSuccess, updateUserSettingsFailure } from '../../slices/meta.js';
import { setUserSettingsOpen } from '../../slices/app.js';
import { patchMeta } from '../../util/api.js';
import Field from '../Form/Field.js';
import Recurring from './Recurring.js';
function UserSettings() {
  const [newAccount, setNewAccount] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const dispatch = useDispatch();
  const open = useSelector(state => state.app.isUserSettingsOpen);
  const saving = useSelector(state => state.app.savingUserSettings);
  const {
    accounts,
    expenseCategories,
    timezoneToStore
  } = useSelector(state => state.meta);
  const saveUserSettings = useCallback(async () => {
    const newAccounts = accounts.filter(acct => !acct.toBeRemoved && !acct.builtIn).map(acct => ({
      slug: acct.slug,
      value: acct.value
    }));
    const newExpenseCategories = expenseCategories.filter(cat => !cat.toBeRemoved).map(cat => ({
      slug: cat.slug,
      value: cat.value
    }));
    dispatch(updateUserSettings());
    try {
      await patchMeta({
        accounts: newAccounts,
        expenseCategories: newExpenseCategories
      });
      dispatch(updateUserSettingsSuccess({
        accounts: newAccounts,
        expenseCategories: newExpenseCategories
      }));
    } catch (e) {
      dispatch(updateUserSettingsFailure(e));
    }
  }, [dispatch, accounts, expenseCategories]);
  return /*#__PURE__*/React.createElement(Dialog, {
    className: "user-settings",
    open: open,
    onClose: () => dispatch(setUserSettingsOpen(false))
  }, /*#__PURE__*/React.createElement(DialogTitle, null, "User Settings"), /*#__PURE__*/React.createElement(DialogContent, null, /*#__PURE__*/React.createElement("div", {
    className: "profile"
  }, /*#__PURE__*/React.createElement("h4", null, "Profile"), /*#__PURE__*/React.createElement("div", {
    className: "profile-fields"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-label"
  }, "Timezone to store transaction date"), /*#__PURE__*/React.createElement("div", {
    className: "field-value"
  }, timezoneToStore))), /*#__PURE__*/React.createElement("div", {
    className: "list accounts"
  }, /*#__PURE__*/React.createElement("h4", null, "Accounts"), /*#__PURE__*/React.createElement("div", {
    className: "items"
  }, accounts.map(account => /*#__PURE__*/React.createElement("div", {
    key: account.slug,
    className: classnames('item', {
      'to-be-added': account.toBeAdded,
      'to-be-removed': account.toBeRemoved
    })
  }, /*#__PURE__*/React.createElement("span", null, account.value), !account.builtIn && account.toBeRemoved ? /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline-secondary",
    title: "Put back",
    onClick: () => {
      dispatch(cancelRemoveAccount(account.value));
    }
  }, /*#__PURE__*/React.createElement(XCircleIcon, null)) : null, !account.builtIn && !account.toBeRemoved ? /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline-danger",
    title: "Remove",
    onClick: () => {
      dispatch(removeAccount(account.value));
    }
  }, /*#__PURE__*/React.createElement(TrashIcon, null)) : null)), /*#__PURE__*/React.createElement("div", {
    className: "item"
  }, /*#__PURE__*/React.createElement(Field, {
    type: "text",
    placeholder: "New account",
    value: newAccount,
    handleChange: e => setNewAccount(e.target.value)
  }), /*#__PURE__*/React.createElement(Button, {
    onClick: () => {
      dispatch(addAccount(newAccount));
      setNewAccount('');
    }
  }, "Add")))), /*#__PURE__*/React.createElement("div", {
    className: "list categories"
  }, /*#__PURE__*/React.createElement("h4", null, "Expense Categories"), /*#__PURE__*/React.createElement("div", {
    className: "items"
  }, expenseCategories.map(cat => /*#__PURE__*/React.createElement("div", {
    key: cat.slug,
    className: classnames('item', {
      'to-be-added': cat.toBeAdded,
      'to-be-removed': cat.toBeRemoved
    })
  }, /*#__PURE__*/React.createElement("span", null, cat.value), cat.toBeRemoved ? /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline-secondary",
    title: "Put back",
    onClick: () => {
      dispatch(cancelRemoveCategory(cat.value));
    }
  }, /*#__PURE__*/React.createElement(XCircleIcon, null)) : /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline-danger",
    title: "Remove",
    onClick: () => {
      dispatch(removeCategory(cat.value));
    }
  }, /*#__PURE__*/React.createElement(TrashIcon, null)))), /*#__PURE__*/React.createElement("div", {
    className: "item"
  }, /*#__PURE__*/React.createElement(Field, {
    type: "text",
    placeholder: "New expense category",
    value: newCategory,
    handleChange: e => setNewCategory(e.target.value)
  }), /*#__PURE__*/React.createElement(Button, {
    onClick: () => {
      dispatch(addCategory(newCategory));
      setNewCategory('');
    }
  }, "Add")))), /*#__PURE__*/React.createElement(Recurring, null)), /*#__PURE__*/React.createElement(DialogActions, null, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => dispatch(setUserSettingsOpen(false))
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: () => dispatch(saveUserSettings),
    disabled: saving
  }, "Save")));
}
export default UserSettings;