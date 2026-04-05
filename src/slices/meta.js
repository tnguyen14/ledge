import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { DateTime } from 'https://esm.sh/luxon@3';
import { createSelector } from 'https://esm.sh/reselect@4';
import slugify from 'https://esm.sh/@tridnguyen/slugify@2';
import { patchMeta } from '../util/api.js';

/* consult https://materializecss.com/color.html */
export const COLOR_PALETTE = {
  red: '#f44336',
  'red-lighten-5': '#ffebee',
  'red-lighten-4': '#ffcdd2',
  'red-lighten-3': '#ef9a9a',
  'red-lighten-2': '#ef5350',
  'pink-lighten-2': '#f06292',
  'pink-accent-3': '#f50057',
  purple: '#9c27b0',
  'deep-purple': '#673ab7',
  indigo: '#3f51b5',
  blue: '#2196f3',
  'blue-lighten-4': '#bbdefb',
  'light-blue': '#03a9f4',
  'light-blue-darken-1': '#039be5',
  'light-blue-darken-2': '#0288d1',
  'light-blue-darken-3': '#0277bd',
  'light-blue-darken-4': '#01579b',
  cyan: '#00bcd4',
  teal: '#009688',
  green: '#4caf50',
  'green-lighten-2': '#81c784',
  'green-darken-2': '#388e3c',
  'green-darken-4': '#1b5e20',
  'green-accent-2': '#69f0ae',
  'green-accent-3': '#00e676',
  'light-green': '#8bc34a',
  'light-green-lighten-4': '#dcedc8',
  'light-green-accent-1': '#b9f6ca',
  'light-green-accent-2': '#b2ff59',
  'light-green-accent-3': '#76ff03',
  'light-green-accent-4': '#64dd17',
  lime: '#cddc39',
  'lime-lighten-4': '#f0f4c3',
  yellow: '#ffeb3b',
  amber: '#ffc107',
  orange: '#ff9800',
  'deep-orange-lighten-2': '#ff8a65',
  'deep-orange-lighten-4': '#ffccbc',
  'brown-lighten-3': '#bcaaa4',
  grey: '#9e9e9e',
  'grey-lighten-2': '#e0e0e0',
  'grey-lighten-4': '#f5f5f5',
  'blue-grey-lighten-4': '#cfd8dc',
  'blue-grey-darken-4': '#263238',
  black: '#000000'
};

const builtinAccounts = [
  {
    slug: 'cash',
    value: 'Cash'
  },
  {
    slug: 'expense',
    value: 'Expense'
  },
  {
    slug: 'income',
    value: 'Income'
  }
];

// generate an array of years since last year, going back to 2018
// for eg., if current year is 2023, pastYears is [2022, 2021, ..., 2018]
const currentYear = DateTime.now().get('year');
const pastYears = [...Array(currentYear - 2018).keys()].map(
  (index) => 2018 + index
);

const initialState = {
  merchants: [],
  expenseCategories: [],
  merchants_count: {},
  accounts: builtinAccounts,
  stats: pastYears.reduce((stats, year) => {
    stats[year] = {
      weeklyAverage: 0
    };
    return stats;
  }, {}),
  timezoneToStore: '',
  recurring: []
};

const getMerchantNamesFromMerchantCounts = createSelector(
  (state) => state,
  (counts) =>
    Object.keys(counts)
      .filter((merchant) => {
        // a merchant count might be set to null if
        // it's being removed completely
        return counts[merchant] != null;
      })
      .map((merchant) => {
        return {
          // pass along slug
          slug: merchant,
          ...counts[merchant]
        };
      })
      .sort((a, b) => {
        // sort by count
        return b.count - a.count;
      })
      .reduce((merchants, merchant) => merchants.concat(merchant.values), [])
);

export const updateMerchantCounts = createAsyncThunk(
  'meta/updateMerchantCounts',
  async (merchants_count) => {
    await patchMeta({
      merchants_count
    });
    return merchants_count;
  }
);

export const addRecurringTransaction = createAsyncThunk(
  'meta/addRecurringTransaction',
  async (transaction, { getState }) => {
    const { recurring } = getState().meta;
    const updatedRecurring = [...recurring, transaction];
    await patchMeta({
      recurring: updatedRecurring
    });
    return updatedRecurring;
  }
);

export const updateRecurringTransaction = createAsyncThunk(
  'meta/updateRecurringTransaction',
  async (transaction, { getState }) => {
    const { recurring } = getState().meta;
    const transactionIndex = recurring.findIndex(
      (t) => t.id === transaction.id
    );
    const updatedRecurring = [...recurring];
    updatedRecurring[transactionIndex] = {
      ...recurring[transactionIndex],
      ...transaction
    };
    await patchMeta({
      recurring: updatedRecurring
    });
    return updatedRecurring;
  }
);

export const removeRecurringTransaction = createAsyncThunk(
  'meta/removeRecurringTransaction',
  async (transactionId, { getState }) => {
    const { recurring } = getState().meta;
    const transactionIndex = recurring.findIndex(
      (transaction) => transaction.id === transactionId
    );
    const updatedRecurring = [
      ...recurring.slice(0, transactionIndex),
      ...recurring.slice(transactionIndex + 1)
    ];
    await patchMeta({
      recurring: updatedRecurring
    });
    return updatedRecurring;
  }
);

const meta = createSlice({
  name: 'meta',
  initialState,
  reducers: {
    loadMetaSuccess: (state, action) => {
      state.merchants = getMerchantNamesFromMerchantCounts(
        action.payload.merchants_count
      );
      state.expenseCategories = action.payload.expenseCategories;
      state.merchants_count = action.payload.merchants_count;
      state.accounts = [
        ...builtinAccounts.map((acct) => ({ ...acct, builtIn: true })),
        ...(action.payload.accounts || [])
      ];
      Object.keys(action.payload.stats).forEach(
        (year) => (state.stats[year] = action.payload.stats[year])
      );
      state.timezoneToStore = action.payload.timezoneToStore;
      state.recurring = action.payload.recurring || initialState.recurring;
    },
    updateMerchantCountsSuccess: (state, action) => {
      state.merchants_count = action.payload;
      state.merchants = getMerchantNamesFromMerchantCounts(action.payload);
    },
    updateYearStats: (state, action) => {
      state.stats[action.payload].updating = true;
    },
    updateYearStatsSuccess: (state, action) => {
      state.stats[action.payload.year] = action.payload.stat;
    },
    updateUserSettings: () => {},
    updateUserSettingsSuccess: (state, action) => {
      state.expenseCategories = action.payload.expenseCategories;
      state.accounts = [
        ...builtinAccounts.map((acct) => ({ ...acct, builtIn: true })),
        ...(action.payload.accounts || [])
      ];
    },
    updateUserSettingsFailure: () => {},
    addAccount: (state, action) => {
      state.accounts.push({
        value: action.payload,
        slug: slugify(action.payload),
        toBeAdded: true
      });
    },
    removeAccount: (state, action) => {
      state.accounts = state.accounts
        .filter((acct) => {
          if (acct.value === action.payload && acct.toBeAdded) {
            return false;
          }
          return true;
        })
        .map((acct) => {
          if (acct.value === action.payload) {
            return {
              ...acct,
              toBeRemoved: true
            };
          }
          return acct;
        });
    },
    cancelRemoveAccount: (state, action) => {
      state.accounts = state.accounts.map((acct) => {
        if (acct.value === action.payload) {
          return {
            ...acct,
            toBeRemoved: false
          };
        }
        return acct;
      });
    },
    addCategory: (state, action) => {
      state.expenseCategories.push({
        value: action.payload,
        slug: slugify(action.payload),
        toBeAdded: true
      });
    },
    removeCategory: (state, action) => {
      state.expenseCategories = state.expenseCategories
        .filter((cat) => {
          if (cat.value === action.payload && cat.toBeAdded) {
            return false;
          }
          return true;
        })
        .map((cat) => {
          if (cat.value === action.payload) {
            return {
              ...cat,
              toBeRemoved: true
            };
          }
          return cat;
        });
    },
    cancelRemoveCategory: (state, action) => {
      state.expenseCategories = state.expenseCategories.map((cat) => {
        if (cat.value === action.payload) {
          return {
            ...cat,
            toBeRemoved: false
          };
        }
        return cat;
      });
    },
    setCategoryColor: (state, action) => {
      const cat = state.expenseCategories.find(
        (c) => c.slug === action.payload.slug
      );
      if (cat) {
        cat.color = action.payload.color;
      }
    },
    moveCategoryToIndex: (state, action) => {
      const newCategories = [...state.expenseCategories];
      const categoryToBeMoved = newCategories.splice(action.payload.from, 1)[0];
      newCategories.splice(action.payload.to, 0, categoryToBeMoved);
      state.expenseCategories = newCategories;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateMerchantCounts.fulfilled, (state, action) => {
        state.merchants_count = action.payload;
        state.merchants = getMerchantNamesFromMerchantCounts(action.payload);
      })
      .addMatcher(
        isAnyOf(
          addRecurringTransaction.fulfilled,
          updateRecurringTransaction.fulfilled,
          removeRecurringTransaction.fulfilled
        ),
        (state, action) => {
          state.recurring = action.payload;
        }
      );
  }
});

export const {
  loadMetaSuccess,
  updateUserSettings,
  updateUserSettingsSuccess,
  updateUserSettingsFailure,
  updateYearStats,
  updateYearStatsSuccess,
  addAccount,
  removeAccount,
  cancelRemoveAccount,
  addCategory,
  removeCategory,
  cancelRemoveCategory,
  setCategoryColor,
  moveCategoryToIndex
} = meta.actions;
export default meta.reducer;
