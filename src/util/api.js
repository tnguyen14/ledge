import qs from 'https://esm.sh/qs@6';
import slugify from 'https://esm.sh/@tridnguyen/slugify@2';
import { getJson, postJson, patchJson, deleteJson } from './fetch.js';
import { LEDGE_URL, USERMETA_URL } from './constants.js';
import store from '../store.js';
import {
  getDate,
  getWeekStart,
  getWeekEnd,
  getWeeksDifference
} from '../selectors/week.js';

export async function getTransaction(id) {
  const {
    app: { listName }
  } = store.getState();
  if (!listName) {
    throw new Error('listName is required to get transaction');
  }
  return await getJson(`${LEDGE_URL}/${listName}/items/${id}`);
}

function mapTypeToSyntheticType(transaction) {
  // if transaction doesn't have the legacy type
  // don't add any more details
  if (!transaction.type) {
    return {};
  }
  switch (transaction.type) {
    case 'regular-expense':
    default:
      return {
        syntheticType: 'expense',
        debitAccount: 'expense',
        creditAccount: 'cash'
      };
    case 'passive-investment':
      return {
        syntheticType: 'transfer',
        debitAccount: 'schwab',
        creditAccount: 'cash'
      };
    case 'withdrawal':
      return {
        syntheticType: 'transfer',
        debitAccount: slugify(transaction.merchant),
        creditAccount: 'cash'
      };
    case 'regular-income':
      return {
        syntheticType: 'income',
        debitAccount: 'cash',
        creditAccount: 'income'
      };
    case 'passive-income':
      return {
        syntheticType: 'transfer',
        debitAccount: 'cash',
        creditAccount: 'schwab'
      };
    case 'deposit':
      return {
        syntheticType: 'transfer',
        debitAccount: 'cash',
        creditAccount:
          transaction.category == 'side-job'
            ? 'side-job'
            : slugify(transaction.merchant)
      };
  }
}

// used to migrate/ decorate over old schema
function transformTransaction(transaction) {
  const budgetStartDate = transaction.budgetStart
    ? getDate({ date: transaction.budgetStart }).toJSDate()
    : getWeekStart({ date: transaction.date }).toJSDate();
  // use span as offset for budgetEnd
  const budgetEndDate = transaction.budgetEnd
    ? getDate({ date: transaction.budgetEnd }).toJSDate()
    : getWeekEnd({
        date: transaction.date,
        offset: transaction.span - 1
      }).toJSDate();
  return {
    ...{
      memo: transaction.description, // TODO remove when items are migrated
      // TODO remove budgetStart and budgetEnd when span is migrated
      budgetStart: budgetStartDate.toISOString(),
      budgetEnd: budgetEndDate.toISOString(),
      budgetSpan:
        getWeeksDifference({
          dateStart: budgetEndDate.toISOString(),
          dateEnd: budgetStartDate.toISOString()
        }) + 1,
      // allow both debit and credit account to be searched
      searchAccount: `${transaction.debitAccount}-${transaction.creditAccount}`
    },
    ...mapTypeToSyntheticType(transaction),
    ...transaction
  };
}
export async function getTransactions(startDate, endDate) {
  const {
    app: { listName }
  } = store.getState();
  if (!listName) {
    throw new Error('listName is required to get transactions');
  }
  // convert time to UTC first, because time is stored in UTC on the server
  // as UTC is the value returned by JavaScript Date's toISOString method
  const start = startDate.toUTC().toISO();
  const end = endDate.toUTC().toISO();
  const query = qs.stringify({
    where: [
      {
        field: 'date',
        op: '>=',
        value: start
      },
      {
        field: 'date',
        op: '<',
        value: end
      }
    ]
  });
  const transactions = await getJson(`${LEDGE_URL}/${listName}/items?${query}`);
  console.log(
    `Received ${transactions.length} transactions for ${start} to ${end}`
  );
  return transactions.map(transformTransaction);
}

export async function getTransactionsWithMerchantName(merchant) {
  const {
    app: { listName }
  } = store.getState();
  if (!listName) {
    throw new Error('listName is required to get transactions');
  }
  return await getJson(
    `${LEDGE_URL}/${listName}/items?${qs.stringify({
      where: [
        {
          field: 'merchant',
          op: '==',
          value: merchant
        }
      ]
    })}`
  );
}

export async function postTransaction(data) {
  const {
    app: { listName }
  } = store.getState();
  if (!listName) {
    throw new Error('listName is required to create transaction');
  }
  return await postJson(`${LEDGE_URL}/${listName}/items`, data);
}

export async function patchTransaction(data) {
  const {
    app: { listName }
  } = store.getState();
  if (!listName) {
    throw new Error('listName is required to update transaction');
  }
  return await patchJson(`${LEDGE_URL}/${listName}/items/${data.id}`, data);
}

export async function deleteTransaction(id) {
  const {
    app: { listName }
  } = store.getState();
  if (!listName) {
    throw new Error('listName is required to delete transaction');
  }
  return await deleteJson(`${LEDGE_URL}/${listName}/items/${id}`);
}

export async function getMeta() {
  const {
    app: { listName }
  } = store.getState();
  if (!listName) {
    throw new Error('listName is required to load meta');
  }
  return await getJson(`${LEDGE_URL}/${listName}/meta`);
}

export async function patchMeta(data) {
  const {
    app: { listName }
  } = store.getState();
  return await patchJson(`${LEDGE_URL}/${listName}/meta`, data);
}

export async function getUserMeta(userId) {
  return await getJson(`${USERMETA_URL}/items/${encodeURIComponent(userId)}`);
}
