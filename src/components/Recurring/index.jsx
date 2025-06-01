import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { PencilIcon, TrashIcon } from '@primer/octicons-react';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {
  editTransaction,
  intendToRemoveTransaction,
  setRecurringOpen
} from '../../slices/app.js';
import { getRecurringTransactions } from '../../selectors/meta.js';
import { getValueFromOptions } from '../../util/slug.js';
import './index.css';

function displayMonthDay(day) {
  if (day == 1) {
    return '1st';
  } else if (day == 2) {
    return '2nd';
  } else if (day == 3) {
    return '3rd';
  } else if (day == 21) {
    return '21st';
  } else if (day == 22) {
    return '22nd';
  } else if (day == 23) {
    return '23rd';
  } else if (day == 31) {
    return '31st';
  } else {
    return `${day}th`;
  }
}

function displayPlural(str, num) {
  if (num == 1) {
    return str;
  } else {
    return `${str}s`;
  }
}

function displayFrequency(str, num) {
  if (num == 1) {
    return `every ${str}`;
  } else {
    return `every ${num} ${displayPlural(str, num)}`;
  }
}

export function RecurringTransaction({
  merchant,
  amount,
  category,
  recurrencePeriod,
  recurrenceFrequency,
  recurrenceDay,
  recurrenceEndDate
}) {
  const categories = useSelector((state) => state.meta.expenseCategories);
  return (
    <span>
      {merchant} {usd(amount)} [{getValueFromOptions(categories, category)}]:{' '}
      {displayFrequency(recurrencePeriod, recurrenceFrequency)} on{' '}
      {recurrencePeriod == 'month'
        ? `the ${displayMonthDay(recurrenceDay)}`
        : recurrenceDay}
      {recurrenceEndDate != '' ? ` until ${recurrenceEndDate}` : ''}
    </span>
  );
}

/*
 * [merchant] [amount] ([category]) : every [frequency] [period] on [day]
 */

/**
 * @returns {JSX.Element}
 */
function Recurring() {
  const { recurring } = useSelector((state) => state.meta);
  const { active, expired } = getRecurringTransactions({ recurring });
  const dispatch = useDispatch();
  const open = useSelector((state) => state.app.isRecurringOpen);

  // Function to close the dialog
  const closeDialog = () => {
    dispatch(setRecurringOpen(false));
  };

  // Render as a dialog
  return (
    <Dialog
      className="popup-dialog"
      open={open}
      onClose={() => dispatch(setRecurringOpen(false))}
    >
      <DialogTitle>Recurring Transactions</DialogTitle>
      <DialogContent>
        <div className="recurring">
          <h4>Active</h4>
          {active.map((txn) => (
            <div className="item" key={txn.id}>
              <RecurringTransaction {...txn} />
              <div className="buttons">
                <Button
                  size="sm"
                  variant="outline-info"
                  title="Edit"
                  onClick={() => {
                    dispatch(
                      editTransaction({
                        ...txn,
                        syntheticType: 'recurring'
                      })
                    );
                    closeDialog();
                  }}
                >
                  <PencilIcon />
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  title="Remove"
                  onClick={() => {
                    dispatch(
                      intendToRemoveTransaction({
                        ...txn,
                        syntheticType: 'recurring'
                      })
                    );
                    closeDialog();
                  }}
                >
                  <TrashIcon />
                </Button>
              </div>
            </div>
          ))}
          <h4>Expired</h4>
          {expired.map((txn) => (
            <div className="item" key={txn.id}>
              <RecurringTransaction {...txn} />
              <div className="buttons">
                <Button
                  size="sm"
                  variant="outline-danger"
                  title="Remove"
                  onClick={() => {
                    dispatch(
                      intendToRemoveTransaction({
                        ...txn,
                        syntheticType: 'recurring'
                      })
                    );
                    closeDialog();
                  }}
                >
                  <TrashIcon />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
          onClick={() => dispatch(setRecurringOpen(false))}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Recurring;
