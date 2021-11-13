describe('Subtitles ', () => {
	beforeEach(() => {
		cy.visitAndSpyStorage('/', 'getItem');
		cy.findByTitle(/Episode Info and Subtitles/).click();
	});
	it('change as player is playing', () => {
		cy.findByLabelText('Start playback').click();
		cy.findByLabelText('Seek and progress slider').as('slider');
		cy.get('@slider')
			.invoke('val', 0.5)
			.trigger('input')
			.trigger('pointerup');
		cy.get('@slider', { timeout: 10000 })
			.invoke('val')
			.should((val) => {
				let valNum;
				if (typeof val === 'string') {
					valNum = parseFloat(val);
					expect(valNum).to.be.gte(0.5);
				} else {
					valNum = val;
					expect(valNum).to.be.gte(0.5);
				}
			});
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
