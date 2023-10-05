import {
	STATE_KEY_PREFIX,
	CURRENT,
	PLAYER_STATE,
	DELIM,
} from 'utils/constants';

describe('Session storage ', () => {
	it('should be null first time page is visited', () => {
		cy.visit('/', {
			onBeforeLoad: (win) => {
				expect(
					win.sessionStorage.getItem(
						`${STATE_KEY_PREFIX}${DELIM}${CURRENT}`
					)
				).to.be.eq(null);
			},
		});
	});

	it('should have a default value for played and state after reload', () => {
		cy.session('defaults', () => {
			cy.visitAndSpyStorage('/', 'setItem');
			cy.getSessionStorage(
				`${STATE_KEY_PREFIX}${DELIM}${CURRENT}`
			).should('not.eq', null);
			cy.visit('/');
			cy.getSessionStorage(`${STATE_KEY_PREFIX}${DELIM}${CURRENT}`)
				.should('not.eq', null)
				.then((currentID) => {
					cy.getSessionStorage(
						`${STATE_KEY_PREFIX}${DELIM}${JSON.parse(currentID)}`
					).should('eq', JSON.stringify('0'));
				});
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
		cy.session('saveSeconds', () => {
			cy.visit('/');
			cy.wait(4000); // TODO: structure loadable to avoid wait
			cy.findByLabelText('Start playback').click({
				waitForAnimations: true,
				force: true,
			});
			cy.getSessionStorage(`${STATE_KEY_PREFIX}${DELIM}${CURRENT}`).then(
				(currentID) => {
					cy.getSessionStorage(
						`${STATE_KEY_PREFIX}${DELIM}${JSON.parse(currentID)}`
					).then((initialSeconds) => {
						cy.wait(2000);
						cy.getSessionStorage(
							`${STATE_KEY_PREFIX}${DELIM}${JSON.parse(
								currentID
							)}`
						).should('not.eq', initialSeconds);
					});
				}
			);
		});
	});

	it('should change state after user changes it and preserve it on page load', () => {
		cy.session('changeOnLoad', () => {
			cy.visit('/');
			cy.wait(4000); // TODO: structure loadable to avoid wait
			cy.findByTitle('Volume Menu').as('vol-menu');
			cy.findByTitle('Volume Slider').as('vol-slider');
			cy.findByTitle('Mute Button').as('mute-button');
			cy.findByTitle('Playback Speed 1.5').as('playback-1.5');
			cy.get('@vol-slider').parent().invoke('show').trigger('mouseover');
			cy.get('@mute-button')
				.invoke('attr', 'aria-pressed')
				.should('eq', 'false');
			cy.get('@mute-button')
				.click({ waitForAnimations: true })
				.invoke('attr', 'aria-pressed')
				.should('eq', 'true');
			cy.get('@vol-slider').parent().invoke('show').trigger('mouseover');
			cy.get('@vol-slider')
				.should('have.attr', 'value', 1)
				.invoke('val', 0.25)
				.trigger('input')
				.should('have.attr', 'value', 0.25);
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
			cy.get('@vol-slider').parent().invoke('show').trigger('mouseover');
			cy.get('@mute-button')
				.invoke('attr', 'aria-pressed')
				.should('eq', 'true');
			cy.get('@vol-slider').should('have.attr', 'value', 0.25);
			cy.get('@playback-1.5')
				.invoke('attr', 'aria-pressed')
				.should('eq', 'true');
		});
	});

	it('never calls seekTo with 0 seconds', () => {
		cy.session('testPlayer', () => {
			cy.visitAndSpyStorage('/', 'setItem');
			cy.visitAndSpyStorage('/', 'getItem');
			cy.findByLabelText('Start playback').click();
			cy.findByLabelText('Seek and progress slider').should(
				($seekbar) => {
					expect($seekbar.val()).to.not.equal(0);
					expect($seekbar.val()).to.not.equal('0');
				}
			);
		});
	});
});

export {};
