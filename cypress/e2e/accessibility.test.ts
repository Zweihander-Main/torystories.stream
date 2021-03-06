describe('Accessibility tests', () => {
	beforeEach(() => {
		cy.visit('/').get('main').injectAxe();
	});
	it('Has no detectable accessibility violations on load', () => {
		cy.checkA11yWithLog();
	});
	it('Navigates to the current episode and checks for accessibility violations', () => {
		cy.findByTitle(/Episode Info and Subtitles/)
			.click()
			.window()
			.checkA11yWithLog();
	});
});

export {};
