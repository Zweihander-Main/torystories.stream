import {
	STATE_KEY_PREFIX,
	TS_APP_STATE,
	CURRENT,
	PLAYER_STATE,
	DELIM,
} from 'utils/constants';

declare global {
	interface Window {
		[TS_APP_STATE]: Record<string, unknown>;
	}
}

export type PlayerState = {
	volume: number;
	muted: boolean;
	playbackRate: number;
};

const isStoredState = (parsedState: unknown): parsedState is PlayerState => {
	if (
		parsedState &&
		typeof parsedState === 'object' &&
		parsedState !== null &&
		Object.prototype.hasOwnProperty.call(parsedState, 'volume') &&
		Object.prototype.hasOwnProperty.call(parsedState, 'muted') &&
		Object.prototype.hasOwnProperty.call(parsedState, 'playbackRate')
	) {
		return true;
	}
	return false;
};

const appStateInWindow = (): Record<string, unknown> | undefined => {
	if (window && window[TS_APP_STATE]) {
		const appStateObj: unknown = window[TS_APP_STATE];
		if (typeof appStateObj === 'object' && appStateObj !== null) {
			return appStateObj as Record<string, unknown>;
		}
	}
	return undefined;
};
export class SessionStorage {
	private static instance: SessionStorage;

	static getInstance(): SessionStorage {
		if (!SessionStorage.instance) {
			SessionStorage.instance = new SessionStorage();
		}
		return SessionStorage.instance;
	}

	readCurrent(): string | undefined {
		const current = this.read(CURRENT);
		if (current && typeof current === 'string') {
			return current;
		}
		return undefined;
	}

	readPlayed(id: string): number | undefined {
		const storedValue = this.read(id);
		if (storedValue) {
			if (typeof storedValue === 'string') {
				return parseFloat(storedValue);
			} else if (typeof storedValue === 'number') {
				return storedValue;
			}
		}
		return undefined;
	}

	readPlayerState(): PlayerState | undefined {
		const storedState = this.read(PLAYER_STATE);

		if (storedState && typeof storedState === 'string') {
			const parsedState: unknown = JSON.parse(storedState);

			if (isStoredState(parsedState)) {
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

	savePlayerState(state: PlayerState): void {
		this.save(PLAYER_STATE, JSON.stringify(state));
	}

	private getStateKey(key: string): string {
		return key === null || typeof key === 'undefined'
			? STATE_KEY_PREFIX
			: `${STATE_KEY_PREFIX}${DELIM}${key}`;
	}

	private read(key: string): unknown {
		const stateKey = this.getStateKey(key);

		try {
			const value = window.sessionStorage.getItem(stateKey);
			return value ? JSON.parse(value) : undefined;
		} catch (e) {
			const appState = appStateInWindow();
			if (appState && appState[stateKey]) {
				return appState[stateKey];
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
			const appState = appStateInWindow();
			const parsedValue: unknown = JSON.parse(storedValue);
			if (appState) {
				appState[stateKey] = parsedValue;
			} else {
				window[TS_APP_STATE] = {};
				const newAppState = appStateInWindow();
				if (newAppState) {
					newAppState[stateKey] = parsedValue;
				}
			}
		}
	}

	private delete(key: string): void {
		const stateKey = this.getStateKey(key);

		try {
			window.sessionStorage.removeItem(stateKey);
		} catch (e) {
			const appState = appStateInWindow();
			if (appState && appState[stateKey]) {
				delete appState[stateKey];
			}
		}
	}
}

export default SessionStorage;
