describe('Subtitles ', () => {
	beforeEach(() => {
		cy.visit('/');
		cy.findByTitle(/Episode Info and Subtitles/).click();
	});
	it('change as player is playing', () => {
		cy.findByLabelText('Start playback').click();
		cy.findByLabelText('Seek and progress slider')
			.invoke('val', 0.5)
			.trigger('input')
			.trigger('pointerup')
			.invoke('val')
			.then(parseFloat)
			.should('be.gte', 0.5);
		cy.get(
			'[aria-label="Subtitle Scrolling Text"] > [aria-selected="true"]'
		).as('initial-sub');
		cy.get('@initial-sub', { timeout: 20000 }).should(
			'have.attr',
			'aria-selected',
			'false'
		);
	});
});

export {};
