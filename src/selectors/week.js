import { createSelector } from 'https://cdn.skypack.dev/reselect@4';
import { setISODay, format } from 'https://cdn.skypack.dev/date-fns@2';
import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import { DateTime } from 'https://cdn.skypack.dev/luxon@2';
import { TIMEZONE, DATE_FIELD_FORMAT } from '../util/constants.js';

export const getOffset = (state) => state.offset || 0;
export const getDate = (state) => {
  if (!state.date) {
    throw new Error('date is missing');
  }
  return new Date(state.date);

  return format(utcToZonedTime(date, TIMEZONE), DATE_FIELD_FORMAT);
};

// exporting for testing purpose
export const getDayStart = createSelector(getDate, (date) =>
  DateTime.fromISO(`${format(date, DATE_FIELD_FORMAT)}T00:00`, {
    zone: TIMEZONE
  }).toJSDate()
);

export const getWeekStart = createSelector(
  getOffset,
  getDayStart,
  (offset, dayStart) => setISODay(dayStart, 1 + offset * 7)
);

// exporting for testing purpose
export const getDayEnd = createSelector(getDate, (date) =>
  DateTime.fromISO(`${format(date, DATE_FIELD_FORMAT)}T23:59:59.999`, {
    zone: TIMEZONE
  }).toJSDate()
);

export const getWeekEnd = createSelector(
  getOffset,
  getWeekStart,
  (offset, weekStart) =>
    getDayEnd({
      date: setISODay(weekStart, 7 + offset * 7)
    })
);

export const getWeekId = createSelector(getWeekStart, (weekStart) =>
  format(weekStart, DATE_FIELD_FORMAT)
);

export const getWeekStartFromWeekId = (state) => {
  if (!state.weekId) {
    return;
  }
  return DateTime.fromISO(`${state.weekId}T00:00`, {
    zone: TIMEZONE
  }).toJSDate();
};

const getNumWeeks = (state) => state.numWeeks;

export const getPastWeeksIds = createSelector(
  getWeekStartFromWeekId,
  getNumWeeks,
  (weekStart, numWeeks) => {
    if (!weekStart) {
      return [];
    }
    return [...Array(numWeeks).keys()].map((offset) =>
      getWeekId({ date: weekStart, offset: -offset })
    );
  }
);
