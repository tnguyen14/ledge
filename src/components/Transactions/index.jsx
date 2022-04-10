import React from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import Spinner from 'https://cdn.skypack.dev/react-bootstrap@1/Spinner';
import Week from './Week.js';
import SearchResult from './SearchResult.js';
import DeleteDialog from '../DeleteDialog/index.js';
import { getPastWeeksIds } from '../../selectors/week.js';

function Weeks() {
  const isLoading = useSelector((state) => state.app.isLoading);
  const search = useSelector((state) => state.app.search);
  const displayFrom = useSelector((state) => state.app.displayFrom);
  const visibleWeeksIds = getPastWeeksIds({
    weekId: displayFrom,
    numWeeks: 4
  });

  return (
    <div className="transactions">
      <div className="transactions-loading">
        {isLoading && <Spinner animation="border" variant="success" />}
      </div>
      {search ? (
        <SearchResult />
      ) : (
        <div className="weeks">
          {visibleWeeksIds.map((weekId) => {
            return <Week key={weekId} weekId={weekId} />;
          })}
        </div>
      )}
      <DeleteDialog />
    </div>
  );
}

export default Weeks;
