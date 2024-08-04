import React from 'https://esm.sh/react@18.2.0';
import { useSelector } from 'https://esm.sh/react-redux@9.1.1';
import { ClockIcon } from 'https://esm.sh/@primer/octicons-react@15';
import { format } from 'https://esm.sh/date-fns@2';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import { getValueFromOptions } from '../../util/slug.js';
import { DISPLAY_DATE_FORMAT } from '../../util/constants.js';
function CompactTransaction({
  transaction
}) {
  const accounts = useSelector(state => state.meta.accounts);
  if (!transaction) {
    return null;
  }
  const {
    date,
    merchant,
    amount,
    debitAccount,
    carriedOver
  } = transaction;
  return /*#__PURE__*/React.createElement("div", {
    className: "compact-transaction"
  }, /*#__PURE__*/React.createElement("div", null, format(new Date(date), DISPLAY_DATE_FORMAT)), /*#__PURE__*/React.createElement("div", null, merchant ? merchant : getValueFromOptions(accounts, debitAccount)), /*#__PURE__*/React.createElement("div", null, usd(amount)), /*#__PURE__*/React.createElement("div", {
    className: "status"
  }, carriedOver ? /*#__PURE__*/React.createElement(ClockIcon, null) : ''));
}
export default CompactTransaction;