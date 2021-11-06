export const STATE_KEY_PREFIX = '@@ts_appstate';
export const TS_APP_STATE = '___TS_APP_STATE';
export const CURRENT = '___TS_CURRENT';
export const PLAYER_STATE = '___TS_PLAYER_STATE';
export const DELIM = '||';

export const SCROLL_TIMEOUT_PERIOD = 8000;

// Will only work for very basic domain matching (xyz.com)
export const DOMAIN_REGEX =
	/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?=]+)/im;
