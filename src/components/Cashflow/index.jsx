import React, { useMemo, useCallback } from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
import Table from 'https://cdn.skypack.dev/react-bootstrap@1/Table';
import classNames from 'https://cdn.skypack.dev/classnames@2';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import { getPastMonthsIds } from '../../selectors/month.js';
import { getMonths } from '../../selectors/transactions.js';
import { useTable, useRowState } from 'https://cdn.skypack.dev/react-table@7';
import { sum } from '../../util/calculate.js';

function getTypeTotal(type) {}
function Cashflow() {
  const displayFrom = useSelector((state) => state.app.displayFrom);
  const transactions = useSelector((state) => state.transactions);
  const types = useSelector((state) => state.account.types);
  const months = getMonths({ transactions });
  const monthsIds = getPastMonthsIds({
    date: displayFrom,
    numMonths: 24
  });

  const years = monthsIds.reduce((aggregate, monthId) => {
    const year = monthId.substr(0, 4);
    if (!aggregate[year]) {
      aggregate[year] = [monthId];
    } else {
      aggregate[year].push(monthId);
    }
    return aggregate;
  }, {});

  const columns = useMemo(
    () =>
      [
        {
          accessor: 'type'
        }
      ].concat(
        Object.entries(years)
          .reverse()
          .map(([year, months]) => ({
            Header: year,
            columns: months.map((month) => ({
              Header: month,
              accessor: month,
              Cell: ({ value }) => usd(value)
            }))
          }))
      ),
    [monthsIds]
  );

  const flows = ['in', 'out'];

  const getTypeTotal = useCallback(
    (type, transactions) =>
      sum(transactions.filter((t) => t.type == type).map((t) => t.amount)),
    []
  );

  // shape of monthsData
  // {
  //   "2021-08": {
  //     "Regular Income": 123456,
  //     ...
  //     "IN": 123456,
  //     "Regular Expense": 123456,
  //     ...
  //     "OUT": 123456
  //   },
  //   ...
  // }
  const monthsData = useMemo(
    () =>
      monthsIds.reduce((allMonths, monthId) => {
        const monthData = {};
        flows.forEach((flow) => {
          types[flow].forEach((type) => {
            monthData[type.value] = getTypeTotal(type.slug, months[monthId]);
          });
          monthData[flow.toUpperCase()] = sum(Object.values(monthData));
        });
        monthData.Balance = monthData.IN - monthData.OUT;
        allMonths[monthId] = monthData;
        return allMonths;
      }, {}),
    [types, monthsIds, months]
  );

  // shape of data - array - each item is a row
  // [
  //   {
  //     "type": "Regular Income",
  //     "2021-08": 123456,
  //     "2021-07": 78912,
  //     ...
  //   },
  //   {
  //     "type": "IN",
  //     "2021-08": 123456,
  //     ...
  //   },
  //   ...
  // ]
  const data = useMemo(() => {
    // shape of categories
    // {
    //   "Regular Income": {
    //     "2021-08": 123456,
    //     "2021-07": 78912,
    //   },
    //   "Regular Expense": {
    //   }
    // }
    const categories = {};
    Object.entries(monthsData).forEach(([monthId, monthData]) => {
      Object.entries(monthData).forEach(([category, total]) => {
        if (!categories[category]) {
          categories[category] = {};
        }
        categories[category][monthId] = total;
      });
    });
    return Object.entries(categories).map(([category, row]) => {
      row.type = category;
      return row;
    });
  }, [monthsData]);

  const rowStateData = useMemo(
    () =>
      data.map((rowData) => {
        const rowState = {};
        const highlightRows = ['IN', 'OUT', 'Balance'];
        if (highlightRows.includes(rowData.type)) {
          rowState.highlight = true;
        }
        return rowState;
      }),
    [data]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      initialState: { rowState: rowStateData }
    },
    useRowState
  );
  return (
    <div className="cashflow">
      <Table responsive {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                className={classNames({
                  highlight: row.state.highlight
                })}
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default Cashflow;
