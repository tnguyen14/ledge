export const SUBMIT_TRANSACTION = 'SUBMIT_TRANSACTION';
export const SUBMIT_TRANSACTION_FAILURE = 'SUBMIT_TRANSACTION_FAILURE';
export const INPUT_CHANGE = 'INPUT_CHANGE';
export const RESET_FORM = 'RESET_FORM';

export function resetForm() {
  return {
    type: RESET_FORM
  };
}
