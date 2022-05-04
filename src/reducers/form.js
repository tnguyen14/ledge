import React from 'https://cdn.skypack.dev/react@17';
import { createReducer } from 'https://cdn.skypack.dev/@reduxjs/toolkit';
import { DateTime } from 'https://cdn.skypack.dev/luxon@2.3.0';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { ZapIcon } from 'https://cdn.skypack.dev/@primer/octicons-react@15';
import { fromCents } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import {
  INPUT_CHANGE,
  SUBMIT_TRANSACTION,
  RESET_FORM
} from '../actions/form.js';
import {
  ADD_TRANSACTION_SUCCESS,
  UPDATE_TRANSACTION_SUCCESS,
  ADD_TRANSACTION_FAILURE,
  UPDATE_TRANSACTION_FAILURE
} from '../actions/transactions.js';
import { EDIT_TRANSACTION, SET_SEARCH_MODE } from '../actions/app.js';
import { DATE_FIELD_FORMAT, TIME_FIELD_FORMAT } from '../util/constants.js';
import { getWeeksDifference } from '../selectors/week.js';
import Span from '../components/Form/Span.js';

// abstract this into a function so it can be called again later
// resetting the date and time to the current value when it's called
function createInitialValues(isSearch) {
  const now = new Date();
  return {
    amount: '',
    calculate: '',
    merchant: '',
    category: '',
    date: isSearch ? '' : format(now, DATE_FIELD_FORMAT),
    time: isSearch ? '' : format(now, TIME_FIELD_FORMAT),
    budgetSpan: 1,
    budgetStart: isSearch ? '' : format(now, DATE_FIELD_FORMAT),
    budgetEnd: isSearch ? '' : format(now, DATE_FIELD_FORMAT),
    memo: '',
    id: '',
    debitAccount: '',
    creditAccount: ''
  };
}

const amountField = {
  type: 'number',
  label: 'Amount',
  name: 'amount',
  placeholder: 'Amount',
  attributes: {
    min: 0,
    step: 'any',
    required: true
  }
};

const calculateField = {
  type: 'text',
  label: 'Calculate',
  name: 'calculate',
  placeholder: 'Calculate amount',
  afterButton: <ZapIcon />,
  tabindex: -1
};

const merchantField = {
  type: 'text',
  label: 'Merchant',
  name: 'merchant',
  placeholder: 'Merchant',
  attributes: {
    required: true,
    list: 'merchants-list'
  }
};

const categoryField = {
  type: 'select',
  label: 'Category',
  name: 'category',
  placeholder: 'Select a category'
};

const debitAccountField = {
  type: 'select',
  label: 'To',
  name: 'debitAccount',
  placeholder: 'To'
};

const creditAccountField = {
  type: 'select',
  label: 'From',
  name: 'creditAccount',
  placeholder: 'From'
};

const dateField = {
  type: 'date',
  label: 'Date',
  name: 'date',
  attributes: {
    required: true
  }
};

const timeField = {
  type: 'time',
  label: 'Time',
  name: 'time',
  attributes: {
    required: true
  }
};

const budgetSpanField = {
  type: 'range',
  name: 'budgetSpan',
  label: 'Span',
  afterButton: <Span />,
  attributes: {
    min: 1,
    step: 1,
    max: 52,
    list: 'budget-span'
  }
};

const budgetStartField = {
  type: 'date',
  label: 'From',
  name: 'budgetStart',
  attributes: {
    required: true
  }
};

const budgetEndField = {
  type: 'date',
  label: 'Until',
  name: 'budgetEnd',
  attributes: {
    required: true
  }
};

const memoField = {
  type: 'textarea',
  name: 'memo',
  label: 'Memo',
  placeholder: 'Memo'
};

const idField = {
  type: 'hidden',
  name: 'id'
};

function getFormFields(syntheticType) {
  switch (syntheticType) {
    case 'expense':
      return [
        amountField,
        calculateField,
        merchantField,
        categoryField,
        dateField,
        timeField,
        budgetSpanField,
        budgetStartField,
        budgetEndField,
        memoField,
        idField
      ];
    case 'transfer':
      return [
        amountField,
        calculateField,
        debitAccountField,
        creditAccountField,
        dateField,
        timeField,
        memoField,
        idField
      ];
    case 'income':
    case 'deposit':
    case 'withdrawal':
    default:
      return [
        amountField,
        calculateField,
        merchantField,
        dateField,
        timeField,
        memoField,
        idField
      ];
  }
}

const initialState = {
  action: 'add',
  values: {
    ...createInitialValues(),
    syntheticType: 'expense'
  },
  fields: getFormFields('expense')
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(SUBMIT_TRANSACTION, (state) => {
      state.pending = true;
    })
    .addCase(INPUT_CHANGE, (state, action) => {
      state.values[action.payload.name] = action.payload.value;
      if (action.payload.name == 'date') {
        state.values.budgetStart = action.payload.value;
        state.values.budgetEnd = format(
          DateTime.fromJSDate(new Date(`${state.values.budgetStart} 00:00`))
            .plus({ weeks: state.values.budgetSpan - 1 })
            .toJSDate(),
          DATE_FIELD_FORMAT
        );
      }
      if (action.payload.name == 'budgetStart') {
        state.values.budgetEnd = format(
          DateTime.fromJSDate(new Date(`${action.payload.value} 00:00`))
            .plus({ weeks: state.values.budgetSpan - 1 })
            .toJSDate(),
          DATE_FIELD_FORMAT
        );
      }
      if (action.payload.name == 'budgetEnd') {
        state.values.budgetSpan =
          getWeeksDifference({
            dateStart: new Date(
              `${state.values.budgetEnd} 00:00`
            ).toISOString(),
            dateEnd: new Date(`${state.values.budgetStart} 00:00`).toISOString()
          }) + 1;
      }
      if (action.payload.name == 'budgetSpan') {
        state.values.budgetEnd = format(
          DateTime.fromJSDate(new Date(`${state.values.budgetStart} 00:00`))
            .plus({ weeks: action.payload.value - 1 })
            .toJSDate(),
          DATE_FIELD_FORMAT
        );
      }
      if (action.payload.name == 'syntheticType') {
        state.fields = getFormFields(action.payload.value);
      }
    })
    .addCase(EDIT_TRANSACTION, (state, action) => {
      state.action = 'update';
      state.values = {
        ...action.payload,
        amount: fromCents(action.payload.amount),
        date: format(new Date(action.payload.date), DATE_FIELD_FORMAT),
        time: format(new Date(action.payload.date), TIME_FIELD_FORMAT),
        budgetStart: format(
          new Date(action.payload.budgetStart),
          DATE_FIELD_FORMAT
        ),
        budgetEnd: format(
          new Date(action.payload.budgetEnd),
          DATE_FIELD_FORMAT
        ),
        calculate: ''
      };
      state.fields = getFormFields(state.values.syntheticType);
    })
    .addCase(SET_SEARCH_MODE, (state, action) => {
      state.action = action.payload ? 'search' : 'add';
      state.values = createInitialValues(action.payload == 'search');
    })
    .addMatcher(
      (action) =>
        [
          RESET_FORM,
          ADD_TRANSACTION_SUCCESS,
          UPDATE_TRANSACTION_SUCCESS
        ].includes(action.type),
      (state) => {
        state.pending = false;
        state.values = {
          syntheticType: state.values.syntheticType,
          ...createInitialValues(state.action == 'search')
        };
        state.action = 'add';
      }
    )
    .addMatcher(
      (action) =>
        [ADD_TRANSACTION_FAILURE, UPDATE_TRANSACTION_FAILURE].includes(
          action.type
        ),
      (state) => {
        state.pending = false;
      }
    );
});
