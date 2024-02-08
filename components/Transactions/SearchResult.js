import React from 'https://esm.sh/react@18';
import { useSelector } from 'https://esm.sh/react-redux@9';
import { getSearchResult } from '../../selectors/transactions.js';
import { DISPLAY_DATE_WITH_DAY_FORMAT } from '../../util/constants.js';
import Transaction from './Transaction.js';
function SearchResult() {
  const transactions = useSelector(state => state.transactions);
  const searchParams = useSelector(state => state.app.searchParams);
  const results = getSearchResult({
    // convert transactions from an object with keys of transaction IDs,
    // to an array of transactions
    transactions: Object.keys(transactions).map(id => transactions[id]),
    searchParams
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "search-results transactions-container"
  }, /*#__PURE__*/React.createElement("table", {
    className: "transactions-list table table-striped"
  }, /*#__PURE__*/React.createElement("tbody", null, results.map(tx => /*#__PURE__*/React.createElement(Transaction, {
    key: tx.id,
    transaction: tx,
    dateFormat: DISPLAY_DATE_WITH_DAY_FORMAT
  })))));
}
export default SearchResult;