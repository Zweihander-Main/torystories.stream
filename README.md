# ToryStories.stream

[![Netlify Status](https://api.netlify.com/api/v1/badges/7c436fa4-a898-4aed-a5cb-5a4a768cae4e/deploy-status)](https://app.netlify.com/sites/torystories/deploys)

> Podcast website with a historical bent

## Technologies used:

-   Gatsby (v4)
-   TypeScript
-   GraphQL + Typegen
-   TailwindCSS
-   Jest + Linting Runners
-   Cypress + Axe
-   Github Actions (E2E testing) + Husky pre-commit hooks
-   NetlifyCMS + Netlify

## Dev workflow

### Notes:

-   `master` branch is protected from merges without a PR and E2E passing
-   Netlify builds from `master`

### Workflow for development:

    1. Push to `dev` branch
    2. PR automatically created
    3. E2E tests run on PR
    4. If passed, branch merges into `master`

### Workflow for NetlifyCMS:

    1. PR created in `dev`
    2. Preview deploys and E2E tests run on PR
    3. PR manually merged or merged through UI

## Scripts

-   `npm run build`: Build to production using Gatsby (outputs to `public` folder)
-   `npm run dev`: Build and serve development version using Gatsby
-   `npm run serve`: Build and serve production
-   `npm run test`: Run jest and runners
-   `npm run test:coverage`: Generate coverage reports
-   `npm run test:watch`: Run jest and runners in watch mode
-   `npm run test:debug`: Run jest and allow node-based debugging
-   `npm run test:e2e`: Run cypress E2E tests
-   `npm run test:e2e:run`: Run cypress on production
-   `npm run test:e2e:dev`: Open cypress dashboard on development
-   `npm run cy:run`: Run cypress
-   `npm run cy:open`: Open cypress dashboard
-   `npm run lint`: Run all jest runners
-   `npm run lint:md`: Run remark markdown linter
-   `npm run prepare`: Prepare husky
-   `npm run netlify`: Script to run as netlify that builds and generates public coverage reports
-   `npm run format`: Auto-format using prettier

## Possible improvements

-   When navigating directly to an episode page, the player is set to play the most recent episode rather than the episode navigated to.

## License

Code (outside the `/content` and `/static/docs` folders) is licensed under [MIT](./LICENSE)
Content underneath the `/content` and `/static/docs` folders is Copyright 2021 of the author Martin Hutchinson unless otherwise stated, All Rights Reserved.
