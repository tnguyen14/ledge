import React, { useEffect, useState, useContext, useCallback } from 'https://esm.sh/react@18.2.0';
import { useDispatch, useSelector } from 'https://esm.sh/react-redux@9.1.1';
import { useAuth0 } from 'https://esm.sh/@auth0/auth0-react@2';
import { usePageVisibility } from 'https://esm.sh/react-page-visibility@7';
import { DateTime } from 'https://esm.sh/luxon@3';
import { format } from 'https://esm.sh/date-fns@2';
import { Octokit } from 'https://esm.sh/octokit@2.0.14';
import Button from 'https://esm.sh/react-bootstrap@2.10.2/Button';
import Notification from '../Notification/index.js';
import Header from '../Header/index.js';
import Login from '../Login/index.js';
import Cashflow from '../Cashflow/index.js';
import Form from '../Form/index.js';
import GlobalStats from '../GlobalStats/index.js';
import Transactions from '../Transactions/index.js';
import UserSettings from '../UserSettings/index.js';
import { refreshApp, setAppError, setDisplayFrom, setListName, setToken } from '../../slices/app.js';
import { loadMetaSuccess } from '../../slices/meta.js';
import { loadTransactions } from '../../slices/transactions.js';
import { DATE_FIELD_FORMAT, TIMEZONE, API_AUDIENCE, LISTS_SCOPE } from '../../util/constants.js';
import { getMeta, getUserMeta } from '../../util/api.js';
import OctokitContext from '../../contexts/octokit.js';
import BudgetContext from '../../contexts/budget.js';
function App() {
  const {
    isLoading,
    isAuthenticated,
    user,
    getAccessTokenSilently,
    logout
  } = useAuth0();
  const dispatch = useDispatch();
  const [octokit, setOctokit] = useState();
  const lastRefreshed = useSelector(state => state.app.lastRefreshed);
  const showCashflow = useSelector(state => state.app.showCashflow);
  const appError = useSelector(state => state.app.error);
  const isVisible = usePageVisibility();
  const budget = useContext(BudgetContext);
  const [budgetVersions, setBudgetVersions] = useState(budget.versions);
  const updateToken = useCallback(async () => {
    const accessToken = await getAccessTokenSilently({
      authorizationParams: {
        audience: API_AUDIENCE,
        scope: LISTS_SCOPE
      }
    });
    dispatch(setToken(accessToken));
  }, [dispatch]);
  const loadPastYears = useCallback(async yearsToLoad => {
    const now = DateTime.now().setZone(TIMEZONE);
    const start = now.minus({
      years: yearsToLoad
    });
    const startMonday = start.startOf('week');
    const endMonday = now.startOf('week').plus({
      weeks: 1
    });
    await dispatch(loadTransactions({
      start: startMonday,
      end: endMonday
    }));
  }, [dispatch]);
  useEffect(() => {
    if (!octokit) {
      return;
    }
    (async () => {
      const commits = await octokit.rest.repos.listCommits(budget.repo);
      setBudgetVersions(commits.data.map(commit => ({
        sha: commit.sha,
        message: commit.commit.message,
        // DO I NEED TO WORRY ABOUT TIMEZONE HERE??
        date: new Date(commit.commit.author.date)
      })).reverse());
    })();
  }, [octokit]);
  useEffect(() => {
    if (!isAuthenticated || !isVisible) {
      return;
    }
    const now = new Date();
    // reload if haven't been refreshed in an hour
    const shouldReload = now.valueOf() - lastRefreshed > 3600000;
    (async () => {
      if (shouldReload) {
        try {
          await updateToken();
          const {
            ledge: {
              listName,
              githubAccessToken
            }
          } = await getUserMeta(user.sub);
          dispatch(setListName(listName));
          setOctokit(new Octokit({
            auth: githubAccessToken
          }));
          const meta = await getMeta();
          dispatch(loadMetaSuccess(meta));
          dispatch(refreshApp());
          if (window.requestIdleCallback) {
            requestIdleCallback(() => {
              dispatch(loadPastYears.bind(null, 1));
            });
          } else {
            dispatch(loadPastYears.bind(null, 1));
          }
        } catch (e) {
          console.error(e);
          dispatch(setAppError(e));
        }
        dispatch(setDisplayFrom(format(now, DATE_FIELD_FORMAT)));
      }
    })();
  }, [isAuthenticated, isVisible, user]);
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement(Header, null), !isAuthenticated && (isLoading ? /*#__PURE__*/React.createElement("h2", {
    className: "auth-loading"
  }, "Loading...") : /*#__PURE__*/React.createElement(Login, null)), appError && /*#__PURE__*/React.createElement("div", {
    className: "app-error"
  }, /*#__PURE__*/React.createElement("p", null, "Error loading app"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("pre", null, appError.message), /*#__PURE__*/React.createElement("pre", null, JSON.stringify(appError))), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(Button, {
    onClick: () => logout({
      logoutParams: {
        returnTo: window.location.href
      }
    })
  }, "Force Log Out"))), isAuthenticated && !appError && /*#__PURE__*/React.createElement(OctokitContext.Provider, {
    value: octokit
  }, /*#__PURE__*/React.createElement(BudgetContext.Provider, {
    value: {
      ...budget,
      versions: budgetVersions
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "app-top"
  }, /*#__PURE__*/React.createElement(Form, null), /*#__PURE__*/React.createElement(GlobalStats, null)), /*#__PURE__*/React.createElement("div", {
    className: "app-bottom"
  }, showCashflow ? /*#__PURE__*/React.createElement(Cashflow, null) : /*#__PURE__*/React.createElement(Transactions, null)), /*#__PURE__*/React.createElement(Notification, null), /*#__PURE__*/React.createElement(UserSettings, null))));
}
export default App;