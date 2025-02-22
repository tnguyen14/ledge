import React, { useContext, useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Pagination from 'react-bootstrap/Pagination';
import toml from 'https://esm.sh/@ltd/j-toml@1';
import { usd } from 'https://esm.sh/@tridnguyen/money@1';
import format from 'date-fns/format';
import BudgetItem from './BudgetItem.jsx';
import OctokitContext from '../../contexts/octokit.js';
import BudgetContext from '../../contexts/budget.js';
import { DISPLAY_DATE_FORMAT } from '../../util/constants.js';

function Budget() {
  const octokit = useContext(OctokitContext);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  /*
   * budget example
   * {
   *   "Residence": {
   *     "amount": 750,
   *     "H06 Insurance": {
   *       "amount": 250,
   *       "memo": "test"
   *     }
   *   }
   * }
   */
  const [budget, setBudget] = useState({});
  const { versions, repo } = useContext(BudgetContext);
  const [selectedVersion, setSelectedVersion] = useState();
  const [displayVersions, setDisplayVersions] = useState([]);
  const [hasOlder, setHasOlder] = useState(false);
  const [hasNewer, setHasNewer] = useState(false);
  const [tally, setTally] = useState({
    budget: 0,
    year: 0,
    month: 0,
    paycheck: 0
  });

  const NUM_DISPLAY_VERSIONS = 3;

  useEffect(() => {
    if (!versions.length) {
      return;
    }
    // set latest version by default
    setSelectedVersion(versions.slice(-1)[0].sha);
  }, [versions]);

  useEffect(() => {
    if (!versions.length || !selectedVersion) {
      return;
    }
    const selectedIndex = versions.findIndex(
      (version) => version.sha == selectedVersion
    );
    if (selectedIndex < 0) {
      setError(new Error(`Unable to find version ${selectedVersion}`));
      return;
    }

    if (versions.length <= NUM_DISPLAY_VERSIONS) {
      setDisplayVersions(versions.slice());
    } else {
      const rightIndex = Math.min(selectedIndex + 1, versions.length);
      const leftIndex = Math.min(
        selectedIndex - 1,
        versions.length - NUM_DISPLAY_VERSIONS
      );
      setDisplayVersions(
        versions.slice(
          Math.max(leftIndex, 0),
          Math.max(selectedIndex + 2, rightIndex + 1)
        )
      );
      setHasNewer(rightIndex < versions.length - 1);
      setHasOlder(leftIndex > 0);
    }
  }, [selectedVersion, versions]);
  useEffect(() => {
    (async () => {
      setError();
      setBudget({});
      let content;
      try {
        setIsLoading(true);
        const weekly = await octokit.rest.repos.getContent({
          ...repo,
          path: 'Weekly.toml',
          ref: selectedVersion
        });
        content = atob(weekly.data.content);
        setIsLoading(false);
      } catch (e) {
        setError(e);
        setIsLoading(false);
      }
      try {
        setBudget(
          toml.parse(content, {
            bigint: false
          })
        );
      } catch (e) {
        setError(e);
      }
    })();
  }, [selectedVersion]);
  useEffect(() => {
    let totalBudgetAmount = 0;
    Object.values(budget).forEach((details) => {
      totalBudgetAmount = totalBudgetAmount + details.amount * 100;
    });
    setTally({
      budget: totalBudgetAmount,
      year: totalBudgetAmount * 52,
      month: (totalBudgetAmount * 52) / 12,
      paycheck: (totalBudgetAmount * 52) / 24
    });
  }, [budget]);
  return (
    <div>
      <div className="version-selector">
        {versions.length > 0 && (
          <Pagination size="sm">
            {hasOlder && <Pagination.Ellipsis />}
            {displayVersions.map((version) => (
              <Pagination.Item
                key={version.sha}
                active={version.sha == selectedVersion}
                data-sha={version.sha}
                onClick={(e) => {
                  setSelectedVersion(e.target.dataset.sha);
                }}
              >
                {format(version.date, DISPLAY_DATE_FORMAT)}
              </Pagination.Item>
            ))}
            {hasNewer && <Pagination.Ellipsis />}
          </Pagination>
        )}
      </div>
      {isLoading && <Spinner animation="border" />}
      {error && error.message}
      <table className="table table-borderless">
        <tbody>
          {budget &&
            Object.entries(budget).map(([category, details]) => {
              return (
                <BudgetItem
                  key={category}
                  category={category}
                  details={details}
                />
              );
            })}
          <tr className="stat budget-stat">
            <td>Total</td>
            <td>{usd(tally.budget)}</td>
          </tr>
          <tr className="stat budget-stat">
            <td>Year</td>
            <td>{usd(tally.year)}</td>
          </tr>
          <tr className="stat budget-stat">
            <td>Paycheck</td>
            <td>{usd(tally.paycheck)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Budget;
