describe('Accessibility tests', () => {
	beforeEach(() => {
		cy.visit('/').get('main').injectAxe();
	});
	it('Has no detectable accessibility violations on load', () => {
		cy.checkA11y();
	});
	it('Navigates to the current episode and checks for accessibility violations', () => {
		cy.findByTitle(/Episode Info and Subtitles/)
			.click()
			.checkA11y();
	});
});
