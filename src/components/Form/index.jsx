import React, {
  useEffect,
  useRef,
  useCallback
} from 'https://cdn.skypack.dev/react@17';
import {
  useSelector,
  useDispatch
} from 'https://cdn.skypack.dev/react-redux@7';
import Button from 'https://cdn.skypack.dev/react-bootstrap@1/Button';
import Field from './Field.js';
import {
  INPUT_CHANGE,
  SUBMIT_TRANSACTION_FAILURE,
  SUBMIT_TRANSACTION,
  resetForm
} from '../../actions/form.js';
import {
  addTransaction,
  updateTransaction
} from '../../actions/transaction.js';

function submit() {
  return {
    type: SUBMIT_TRANSACTION
  };
}

function submitFailure(err) {
  return {
    type: SUBMIT_TRANSACTION_FAILURE,
    data: err
  };
}

function inputChange(name, value) {
  return {
    type: INPUT_CHANGE,
    data: {
      name,
      value
    }
  };
}

function calculateString(str) {
  return Function(`"use strict"; return(${str})`)();
}

function Form(props) {
  const dispatch = useDispatch();
  const datalists = useSelector((state) => ({
    'merchants-list': state.account.merchants
  }));
  const fieldOptions = useSelector((state) => ({
    category: state.account.categories,
    source: state.account.sources
  }));
  const { fields, action, values, pending } = useSelector(
    (state) => state.form
  );

  const prevMerchantRef = useRef();
  useEffect(() => {
    prevMerchantRef.current = values.merchant;
  }, [action]);

  let amountFieldRef = null;

  useEffect(() => {
    if (amountFieldRef) {
      amountFieldRef.focus();
    }
  }, [values.amount]);

  const buttonAttrs = {
    disabled: Boolean(pending)
  };

  const submitForm = useCallback(
    (event) => {
      event.preventDefault();
      dispatch(submit());
      try {
        if (action == 'update') {
          dispatch(updateTransaction(values, prevMerchantRef.current));
        } else {
          dispatch(addTransaction(values));
        }
      } catch (err) {
        dispatch(submitFailure(err));
      }
    },
    [action, values]
  );

  return (
    <form className="new-transaction" method="POST">
      <h2>Add a new transaction</h2>
      {fields.map((field) => {
        if (field.attributes && field.attributes.list) {
          field.datalist = datalists[field.attributes.list];
        }
        if (fieldOptions[field.name]) {
          field.options = fieldOptions[field.name];
        }
        return (
          <Field
            inputRef={(input) => {
              if (field.name == 'amount') {
                amountFieldRef = input;
              }
            }}
            key={field.name}
            handleChange={(event) => {
              dispatch(inputChange(field.name, event.target.value));
            }}
            afterButtonAction={() => {
              if (field.name == 'calculate') {
                if (!values.calculate) {
                  return;
                }
                const newAmount = calculateString(values.calculate).toFixed(2);

                dispatch(inputChange('amount', newAmount));
              }
            }}
            {...field}
          />
        );
      })}
      <div className="actions">
        <Button
          variant="primary"
          type="submit"
          onClick={submitForm}
          {...buttonAttrs}
        >
          {action}
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => dispatch(resetForm())}
          {...buttonAttrs}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}

export default Form;
