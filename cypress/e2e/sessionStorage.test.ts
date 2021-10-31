import {
	STATE_KEY_PREFIX,
	CURRENT,
	PLAYER_STATE,
	DELIM,
} from 'utils/constants';

describe('Session storage ', () => {
	before(() => {
		Cypress.session.clearAllSavedSessions();
	});

	it('should be null first time page is visited', () => {
		cy.session('defaults', () => {
			cy.visit('/')
				.getSessionStorage(`${STATE_KEY_PREFIX}${DELIM}${CURRENT}`)
				.should('eq', null);
		});
	});

	it('should be set after page loads', () => {
		cy.session('defaults', () => {
			cy.visitAndSpyStorage('/');
			cy.getSessionStorage(
				`${STATE_KEY_PREFIX}${DELIM}${CURRENT}`
			).should('not.eq', null);
		});
	});

	it('should have a default value for played and state', () => {
		cy.session('defaults', () => {
			cy.visitAndSpyStorage('/', 'getItem');
			cy.getSessionStorage(`${STATE_KEY_PREFIX}${DELIM}${CURRENT}`).then(
				(currentID) => {
					cy.getSessionStorage(
						`${STATE_KEY_PREFIX}${DELIM}${JSON.parse(currentID)}`
					).should('eq', JSON.stringify('0'));
				}
			);
			cy.getSessionStorage(
				`${STATE_KEY_PREFIX}${DELIM}${PLAYER_STATE}`
			).should(
				'eq',
				JSON.stringify(
					JSON.stringify({ volume: 1, muted: false, playbackRate: 1 })
				)
			);
		});
	});

	it('should save seconds after playback starts', () => {
		cy.session('changeOnLoad', () => {
			cy.visitAndSpyStorage('/', 'getItem');
			cy.findByLabelText('Start playback').click();
			cy.window().then((win) => {
				cy.spy(win.sessionStorage, 'setItem').as('setItem');
				cy.getSessionStorage(
					`${STATE_KEY_PREFIX}${DELIM}${CURRENT}`
				).then((currentID) => {
					cy.get('@setItem').should('be.called');
					cy.getSessionStorage(
						`${STATE_KEY_PREFIX}${DELIM}${JSON.parse(currentID)}`
					).should('not.eq', JSON.stringify('0'));
				});
			});
		});
	});

	it('should change state after user changes it and preserve it on page load', () => {
		cy.session('changeOnLoad', () => {
			cy.visitAndSpyStorage('/');
			cy.findByTitle('Volume Button').as('vol-button');
			cy.get('@vol-button')
				.invoke('attr', 'aria-pressed')
				.should('eq', 'false');
			cy.get('@vol-button')
				.click()
				.invoke('attr', 'aria-pressed')
				.should('eq', 'true');
			cy.findByTitle('Volume Slider').as('vol-slider');
			cy.get('@vol-slider').parent().invoke('show').trigger('mouseover');
			cy.get('@vol-slider')
				.should('have.attr', 'value', 1)
				.invoke('val', 0.25)
				.trigger('input')
				.should('have.attr', 'value', 0.25);
			cy.findByTitle('Playback Speed 1.5').as('playback-1.5');
			cy.get('@playback-1.5')
				.parent()
				.invoke('show')
				.trigger('mouseover');
			cy.get('@playback-1.5')
				.invoke('attr', 'aria-pressed')
				.should('eq', 'false');
			cy.get('@playback-1.5')
				.click()
				.invoke('attr', 'aria-pressed')
				.should('eq', 'true');
			cy.getSessionStorage(
				`${STATE_KEY_PREFIX}${DELIM}${PLAYER_STATE}`
			).should(
				'eq',
				JSON.stringify(
					JSON.stringify({
						volume: 0.25,
						muted: true,
						playbackRate: 1.5,
					})
				)
			);

			cy.visitAndSpyStorage('/', 'getItem');
			cy.findByTitle('Volume Button')
				.invoke('attr', 'aria-pressed')
				.should('eq', 'true');
			cy.findByTitle('Volume Slider').should('have.attr', 'value', 0.25);
			cy.findByTitle('Playback Speed 1.5')
				.invoke('attr', 'aria-pressed')
				.should('eq', 'true');
		});
	});
});

export {};
