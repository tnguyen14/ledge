/* global process */
export const TIMEZONE = 'America/New_York';
export const LISTS_URL = import.meta.env.VITE_LISTS_URL;
export const LEDGE_URL = `${import.meta.env.VITE_LISTS_URL}/ledge`;
export const USERMETA_URL = `${import.meta.env.VITE_LISTS_URL}/meta/users`;
export const AUTH0_DOMAIN = 'tridnguyen.auth0.com';
export const API_AUDIENCE = 'https://lists.cloud.tridnguyen.com';
export const LISTS_SCOPE = 'read:list write:list';
export const PROFILE_SCOPE = 'openid profile email';

export const DATE_FIELD_FORMAT = 'yyyy-MM-dd';
export const TIME_FIELD_FORMAT = 'HH:mm';

export const DISPLAY_DATE_FORMAT = 'MM/dd/yy';
export const DISPLAY_DATE_WITH_DAY_FORMAT = `${DISPLAY_DATE_FORMAT} (EEE)`;
export const DISPLAY_DATE_TIME_FORMAT = `${DISPLAY_DATE_FORMAT} hh:mm a z`;
