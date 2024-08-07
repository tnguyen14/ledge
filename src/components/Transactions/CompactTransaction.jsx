import React from 'https://esm.sh/react@18.2.0';
import { useSelector } from 'https://esm.sh/react-redux@9.1.1';
import { ClockIcon } from 'https://esm.sh/@primer/octicons-react@15';
import { format } from 'https://esm.sh/date-fns@2';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import { getValueFromOptions } from '../../util/slug.js';
import { DISPLAY_DATE_FORMAT } from '../../util/constants.js';

function CompactTransaction({ transaction }) {
  const accounts = useSelector((state) => state.meta.accounts);
  if (!transaction) {
    return null;
  }
  const { date, merchant, amount, debitAccount, carriedOver } = transaction;
  return (
    <div className="compact-transaction">
      <div>{format(new Date(date), DISPLAY_DATE_FORMAT)}</div>
      <div>
        {merchant ? merchant : getValueFromOptions(accounts, debitAccount)}
      </div>
      <div>{usd(amount)}</div>
      <div className="status">{carriedOver ? <ClockIcon /> : ''}</div>
    </div>
  );
}

export default CompactTransaction;
