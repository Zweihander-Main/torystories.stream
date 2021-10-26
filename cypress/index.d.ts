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
		 * Custom command to wait for session storage to haven non-null key value
		 * @example cy.waitForSessionStorage('id')
		 */
		waitForSessionStorage(key: string): Chainable<boolean>;
	}

	interface Cypress {
		session: {
			clearAllSavedSessions(): void;
		};
	}
}
