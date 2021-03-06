import { createSelector } from 'https://cdn.skypack.dev/reselect@4';
import {
  startOfDay,
  endOfDay,
  setISODay,
  format
} from 'https://cdn.skypack.dev/date-fns@2';
import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import getDateInTz from 'https://cdn.skypack.dev/@tridnguyen/date-tz@1';
import {
  WEEK_ID_FORMAT,
  TIMEZONE,
  DATE_FIELD_FORMAT
} from '../util/constants.js';

const getOffset = (state) => state.offset || 0;
const getDate = (state) => {
  let date = new Date();
  if (state && state.date) {
    date = new Date(state.date);
  }
  return format(utcToZonedTime(date, TIMEZONE), DATE_FIELD_FORMAT);
};

function setLocalDay(date, day) {
  return getDateInTz(setISODay(date, day), TIMEZONE);
}

export const getWeekStart = createSelector(getOffset, getDate, (offset, date) =>
  setLocalDay(new Date(`${date} 00:00`), 1 + offset * 7)
);

export const getWeekEnd = createSelector(getOffset, getDate, (offset, date) =>
  setLocalDay(new Date(`${date} 23:59:59.999`), 7 + offset * 7)
);

export const getWeekId = createSelector(getWeekStart, (weekStart) =>
  format(weekStart, WEEK_ID_FORMAT)
);

const getDateFromWeekId = (state) => new Date(`${state.weekId} 00:00`);

export const getWeekStartFromWeekId = createSelector(
  getDateFromWeekId,
  (date) => getDateInTz(date, TIMEZONE)
);

const getNumWeeks = (state) => state.numWeeks;

export const getPastWeeksIds = createSelector(
  getWeekStartFromWeekId,
  getNumWeeks,
  (weekStart, numWeeks) =>
    [...Array(numWeeks).keys()].map((offset) =>
      getWeekId({ date: weekStart, offset: -offset })
    )
);
