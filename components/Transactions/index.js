import React from 'https://esm.sh/react@18.2.0';
import { useSelector } from 'https://esm.sh/react-redux@9.1.1';
import Spinner from 'https://esm.sh/react-bootstrap@2.10.2/Spinner';
import Week from './Week.js';
import SearchResult from './SearchResult.js';
import DeleteDialog from '../DeleteDialog/index.js';
import { getPastWeeksIds } from '../../selectors/week.js';
function Weeks() {
  const isLoading = useSelector(state => state.app.isLoading);
  const isSearch = useSelector(state => state.app.isSearch);
  const displayFrom = useSelector(state => state.app.displayFrom);
  const visibleWeeksIds = getPastWeeksIds({
    weekId: displayFrom,
    numWeeks: 4
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "transactions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "transactions-loading"
  }, isLoading && /*#__PURE__*/React.createElement(Spinner, {
    animation: "border",
    variant: "success"
  })), isSearch ? /*#__PURE__*/React.createElement(SearchResult, null) : /*#__PURE__*/React.createElement("div", {
    className: "weeks"
  }, visibleWeeksIds.map(weekId => {
    return /*#__PURE__*/React.createElement(Week, {
      key: weekId,
      weekId: weekId
    });
  })), /*#__PURE__*/React.createElement(DeleteDialog, null));
}
export default Weeks;