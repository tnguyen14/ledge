import React from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import Tooltip from 'https://cdn.skypack.dev/@material-ui/core@4/Tooltip';

import { average, weeklyTotal } from '../../util/calculate.js';
import { getWeekStart, getWeekEnd, getWeekId } from '../../selectors/week.js';
import { getWeekById, getYearAverages } from '../../selectors/transactions.js';
import { TIMEZONE } from '../../util/constants.js';

function WeeklyAverages(props) {
  const transactions = useSelector((state) => state.transactions);
  const yearAverages = getYearAverages({
    transactions
  });
  const timespans = [
    {
      start: -1,
      end: -5
    },
    {
      start: -1,
      end: -13
    },
    {
      start: -1,
      end: -25
    }
  ].map((span) => {
    const weeks = [];
    for (let offset = span.start; offset > span.end; offset--) {
      const weekId = getWeekId({ offset });
      weeks.push(getWeekById({ transactions, weekId }));
    }
    return {
      ...span,
      startWeekEnd: getWeekEnd({ date: new Date(), offset: span.start }),
      endWeekStart: getWeekStart({ date: new Date(), offset: span.end }),
      weeks
    };
  });

  return (
    <div className="averages">
      <table className="table table-borderless">
        <tbody>
          {timespans.map((span, index) => (
            <tr className="stat" key={index}>
              <td>
                <Tooltip
                  title={`${format(
                    utcToZonedTime(span.startWeekEnd, TIMEZONE),
                    'MMM d'
                  )} - ${format(
                    utcToZonedTime(span.endWeekStart, TIMEZONE),
                    'MMM d'
                  )}`}
                >
                  <span>Last {span.start - span.end} weeks</span>
                </Tooltip>
              </td>
              <td>{usd(average(span.weeks.map(weeklyTotal)))}</td>
            </tr>
          ))}
          <tr>
            <td>&nbsp;</td>
          </tr>
          {yearAverages.map((average) => (
            <tr className="stat" key={average.year}>
              <td>
                {average.year} ({average.numWeeks} weeks)
              </td>
              <td>{usd(average.weeklyAverage)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WeeklyAverages;
