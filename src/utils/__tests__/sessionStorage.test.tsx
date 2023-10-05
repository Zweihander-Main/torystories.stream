import SessionStorage from '../sessionStorage';
import {
	STATE_KEY_PREFIX,
	CURRENT,
	PLAYER_STATE,
	DELIM,
} from '../../utils/constants';

const setItem = jest.spyOn(window.localStorage.__proto__, 'setItem');
const getItem = jest.spyOn(window.localStorage.__proto__, 'getItem');
const clear = jest.spyOn(window.localStorage.__proto__, 'clear');

afterEach(() => {
	setItem.mockClear();
	getItem.mockClear();
	clear.mockClear();
});

describe('Session storage utility', () => {
	const storage = SessionStorage.getInstance();

	const id = 'testID';
	const played = 42;
	const state = {
		volume: 42,
		muted: true,
		playbackRate: 0.75,
	};
	it('remains a singleton', () => {
		const storageSecondInstance = SessionStorage.getInstance();
		expect(storage).toEqual(storageSecondInstance);
	});

	it('saves current track to local settings', () => {
		storage.saveCurrent(id);
		expect(setItem).toHaveBeenCalledWith(
			`${STATE_KEY_PREFIX}${DELIM}${CURRENT}`,
			JSON.stringify(id)
		);
		expect(clear).not.toHaveBeenCalled();
	});

	it('saves played secs to local settings', () => {
		storage.savePlayed('testID', played);
		expect(setItem).toHaveBeenCalledWith(
			`${STATE_KEY_PREFIX}${DELIM}${id}`,
			JSON.stringify(played.toString(10))
		);
		expect(clear).not.toHaveBeenCalled();
	});

	it('saves player state to local settings', () => {
		storage.savePlayerState(state);
		expect(setItem).toHaveBeenCalledWith(
			`${STATE_KEY_PREFIX}${DELIM}${PLAYER_STATE}`,
			JSON.stringify(JSON.stringify(state))
		);
		expect(clear).not.toHaveBeenCalled();
	});

	it('reads current track from local settings', () => {
		storage.readCurrent();
		expect(getItem).toHaveBeenCalledWith(
			`${STATE_KEY_PREFIX}${DELIM}${CURRENT}`
		);
		expect(clear).not.toHaveBeenCalled();
	});

	it('reads played secs from local settings', () => {
		storage.readPlayed(id);
		expect(getItem).toHaveBeenCalledWith(
			`${STATE_KEY_PREFIX}${DELIM}${id}`
		);
		expect(clear).not.toHaveBeenCalled();
	});

	it('reads player state from local settings', () => {
		storage.readPlayerState();
		expect(getItem).toHaveBeenCalledWith(
			`${STATE_KEY_PREFIX}${DELIM}${PLAYER_STATE}`
		);
		expect(clear).not.toHaveBeenCalled();
	});
});
