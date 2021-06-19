const STATE_KEY_PREFIX = `@@ts_appstate|`;
const TS_APP_STATE = `___TS_APP_STATE`;
const CURRENT = `___TS_CURRENT`;
const PLAYER_STATE = `___TS_PLAYER_STATE`;

const unavailbleMessage = `[TS--AppState] Unable to access sessionStorage; sessionStorage is not available.`;

type PlayerState = {
	volume: number;
	muted: boolean;
	playbackRate: number;
};
export class SessionStorage {
	private static instance: SessionStorage;

	private constructor() {}

	static getInstance() {
		if (!SessionStorage.instance) {
			SessionStorage.instance = new SessionStorage();
		}
		return SessionStorage.instance;
	}

	readCurrent(): string | undefined {
		return this.read(CURRENT);
	}

	readPlayed(id: string): number | undefined {
		const storedValue = this.read(id);
		if (storedValue) {
			return parseFloat(storedValue);
		}
		return undefined;
	}

	readPlayerState(): PlayerState | undefined {
		const storedState = this.read(PLAYER_STATE);
		if (storedState) {
			const parsedState = JSON.parse(storedState);
			if (
				parsedState &&
				typeof parsedState === 'object' &&
				parsedState !== null &&
				parsedState.hasOwnProperty('volume') &&
				parsedState.hasOwnProperty('muted') &&
				parsedState.hasOwnProperty('playbackRate')
			) {
				return parsedState;
			} else {
				// stored value is mangled, delete it
				this.delete(PLAYER_STATE);
			}
		}
		return undefined;
	}

	saveCurrent(id: string): void {
		this.save(CURRENT, id);
	}

	savePlayed(id: string, played: number): void {
		this.save(id, played.toString(10));
	}

	savePlayerState(state: PlayerState) {
		this.save(PLAYER_STATE, JSON.stringify(state));
	}

	private getStateKey(key: string): string {
		return key === null || typeof key === `undefined`
			? STATE_KEY_PREFIX
			: `${STATE_KEY_PREFIX}|${key}`;
	}

	private read(key: string): string | undefined {
		const stateKey = this.getStateKey(key);

		try {
			const value = window.sessionStorage.getItem(stateKey);
			return value ? JSON.parse(value) : undefined;
		} catch (e) {
			if (process.env.NODE_ENV !== `production`) {
				console.warn(unavailbleMessage);
			}

			if (
				window &&
				window[TS_APP_STATE] &&
				window[TS_APP_STATE][stateKey]
			) {
				return window[TS_APP_STATE][stateKey];
			}

			return undefined;
		}
	}

	private save(key: string, state: string): void {
		const stateKey = this.getStateKey(key);
		const storedValue = JSON.stringify(state);

		try {
			window.sessionStorage.setItem(stateKey, storedValue);
		} catch (e) {
			if (window && window[TS_APP_STATE]) {
				window[TS_APP_STATE][stateKey] = JSON.parse(storedValue);
			} else {
				window[TS_APP_STATE] = {};
				window[TS_APP_STATE][stateKey] = JSON.parse(storedValue);
			}

			if (process.env.NODE_ENV !== `production`) {
				console.warn(unavailbleMessage);
			}
		}
	}

	private delete(key: string): void {
		const stateKey = this.getStateKey(key);

		try {
			window.sessionStorage.removeItem(stateKey);
		} catch (e) {
			if (
				window &&
				window[TS_APP_STATE] &&
				window[TS_APP_STATE][stateKey]
			) {
				delete window[TS_APP_STATE][stateKey];
			}

			if (process.env.NODE_ENV !== `production`) {
				console.warn(unavailbleMessage);
			}
		}
	}
}

export default SessionStorage;
