describe('PROD ONLY - checks if feed ', () => {
	it('is valid', () => {
		// Feed is only generated on prod
		if (Cypress.env('PROD_BUILD') === true) {
			cy.request('./rss.xml').then((res) => {
				cy.request({
					url: 'https://validator.w3.org/feed/check.cgi',
					method: 'POST',
					headers: {
						'Content-type': 'application/x-www-form-urlencoded',
					},
					body: [
						'manual=1&output=soap12&rawdata=' +
							encodeURIComponent(res.body),
					],
					failOnStatusCode: true,
				}).then((res) => {
					if (res.status !== 200) {
						cy.log(res.body);
					}
					expect(res.status).to.equal(200);
				});
			});
		} else {
			cy.log('Not a production build, no assertions.');
		}
	});
});
export {};
