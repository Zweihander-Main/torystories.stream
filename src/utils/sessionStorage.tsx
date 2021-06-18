const STATE_KEY_PREFIX = `@@ts_appstate|`;
const TS_APP_STATE = `___TS_APP_STATE`;
const CURRENT = `___TS_CURRENT`;

const unavailbleMessage = `[TS--AppState] Unable to access sessionStorage; sessionStorage is not available.`;

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
			return parseInt(storedValue, 10);
		}
		return undefined;
	}

	saveCurrent(id: string): void {
		this.save(CURRENT, id);
	}

	savePlayed(id: string, played: number): void {
		this.save(id, played.toString(10));
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
}

export default SessionStorage;
