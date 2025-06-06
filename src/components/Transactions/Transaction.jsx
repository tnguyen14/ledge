import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import format from 'date-fns/format';
import { toZonedTime } from 'date-fns-tz/toZonedTime';
import Badge from 'react-bootstrap/Badge';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import {
  KebabHorizontalIcon,
  ClockIcon,
  NoteIcon
} from '@primer/octicons-react';
import Popover from '@mui/material/Popover';
import {
  usePopupState,
  bindPopover,
  bindTrigger
} from 'material-ui-popup-state/hooks';
import {
  TIMEZONE,
  DISPLAY_DATE_TIME_FORMAT,
  DATE_FIELD_FORMAT
} from '../../util/constants.js';
import { getValueFromOptions } from '../../util/slug.js';
import { SYNTHETIC_TYPES } from '../../util/transaction.js';
import {
  editTransaction,
  intendToRemoveTransaction
} from '../../slices/app.js';

function Transaction({ transaction, dateFormat }) {
  const dispatch = useDispatch();
  const {
    id,
    date,
    amount,
    merchant,
    category,
    syntheticType,
    memo,
    budgetStart,
    budgetEnd,
    budgetSpan,
    debitAccount,
    creditAccount
  } = transaction;

  const categories = useSelector((state) => state.meta.expenseCategories);
  const accounts = useSelector((state) => state.meta.accounts);

  const creditAccountPopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-credit-account`
  });
  const debitAccountPopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-debit-account`
  });
  const notesPopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-notes`
  });
  const datePopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-date`
  });
  const amountPopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-amount`
  });
  const spanPopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-span`
  });
  const actionsPopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}-actions`
  });

  // show day as in origin timezone, while date in local timezone
  const displayDay = format(toZonedTime(date, TIMEZONE), dateFormat || 'EEE');
  const displayDate = format(new Date(date), DISPLAY_DATE_TIME_FORMAT);
  if (!transaction) {
    return null;
  }
  return (
    <>
      <tr
        id={id}
        className="transaction"
        data-day={displayDay}
        data-date={date}
      >
        <td
          data-field="credit-account"
          data-account-name={creditAccount}
          {...bindTrigger(creditAccountPopupState)}
        ></td>
        <td data-field="day">
          <span {...bindTrigger(datePopupState)}>{displayDay}</span>
        </td>
        <td data-field="merchant">
          {merchant ? merchant : getValueFromOptions(accounts, debitAccount)}
          {memo && (
            <button className="icon-button" {...bindTrigger(notesPopupState)}>
              <NoteIcon />
            </button>
          )}
        </td>
        <td data-field="amount" data-cat={category}>
          <Badge pill bg={null} {...bindTrigger(amountPopupState)}>
            {usd(amount)}
          </Badge>
          {budgetSpan > 1 ? (
            <span className="span-hint" {...bindTrigger(spanPopupState)}>
              <ClockIcon />
            </span>
          ) : null}
        </td>
        <td data-field="action">
          <button className="icon-button" {...bindTrigger(actionsPopupState)}>
            <KebabHorizontalIcon />
          </button>
        </td>
        <td
          data-field="debit-account"
          data-account-name={debitAccount}
          {...bindTrigger(debitAccountPopupState)}
        ></td>
      </tr>
      <Popover
        {...bindPopover(creditAccountPopupState)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <div className="text-popover credit-account-popover">
          <h4>{getValueFromOptions(accounts, creditAccount)}</h4>
        </div>
      </Popover>
      <Popover
        {...bindPopover(debitAccountPopupState)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <div className="text-popover debit-account-popover">
          <h4>{getValueFromOptions(accounts, debitAccount)}</h4>
        </div>
      </Popover>
      <Popover
        {...bindPopover(datePopupState)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <div className="text-popover">{displayDate}</div>
      </Popover>
      <Popover
        {...bindPopover(amountPopupState)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <div className="text-popover amount-popover">
          {category ? (
            <>
              <h4>Category</h4>
              <div>{getValueFromOptions(categories, category)}</div>
            </>
          ) : (
            <>
              <h4>Synthetic Type</h4>
              <div>{getValueFromOptions(SYNTHETIC_TYPES, syntheticType)}</div>
            </>
          )}
        </div>
      </Popover>
      <Popover
        {...bindPopover(spanPopupState)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <div className="text-popover">
          Effective from {format(new Date(budgetStart), DATE_FIELD_FORMAT)} to{' '}
          {format(new Date(budgetEnd), DATE_FIELD_FORMAT)} ({budgetSpan} weeks)
        </div>
      </Popover>
      <Popover
        {...bindPopover(notesPopupState)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <div className="text-popover">{memo}</div>
      </Popover>
      <Popover
        {...bindPopover(actionsPopupState)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <div className="text-popover actions-popover">
          <div
            onClick={() => {
              actionsPopupState.close();
              dispatch(editTransaction(transaction));
              document.querySelector('.new-transaction').scrollIntoView();
            }}
          >
            Edit
          </div>
          <div
            onClick={() => {
              actionsPopupState.close();
              dispatch(intendToRemoveTransaction(transaction));
            }}
          >
            Delete
          </div>
        </div>
      </Popover>
    </>
  );
}

export default Transaction;
