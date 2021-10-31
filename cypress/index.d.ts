// type definitions for Cypress object "cy"
/// <reference types="cypress" />
declare namespace Cypress {
	interface Chainable {
		/**
		 * Custom command to get session storage value
		 * @example cy.getSessionStorage('id')
		 */
		getSessionStorage(value: string): Chainable<string>;
		/**
		 * Custom command to set session storage value
		 * @example cy.getSessionStorage('id', 'sample')
		 */
		setSessionStorage(key: string, value: string): Chainable<void>;
		/**
		 * Custom visit that also spies on session storage
		 * @example cy.waitForSessionStorage('/', 'setItem')
		 */
		visitAndSpyStorage(url: string, func?: string): Chainable<boolean>;
		/**
		 * Cypress-axe checkA11y with custom console logging
		 * @example cy.checkA11yWithLog()
		 */
		checkA11yWithLog(
			context?: string | Node | axe.ContextObject | undefined,
			options?: Options | undefined
		): Chainable<void>;
	}
	interface Cypress {
		session: {
			clearAllSavedSessions(): void;
		};
	}
}
