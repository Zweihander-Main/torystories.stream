# ToryStories.stream

[![Netlify Status](https://img.shields.io/netlify/7c436fa4-a898-4aed-a5cb-5a4a768cae4e?logo=netlify&style=flat-square)](https://app.netlify.com/sites/torystories/deploys)
[![Build-badge](https://img.shields.io/github/workflow/status/Zweihander-Main/torystories.stream/Run%20E2E%20tests%20on%20new%20code%20in%20master?logo=github&style=flat-square)](https://github.com/Zweihander-Main/torystories.stream/actions?query=workflow%3A%22Run+E2E+tests+on+new+code+in+master%22)

> Podcast website with a historical bent

![Screenshot of ToryStores.stream](./docs/torystories.png)

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

-   Netlify builds from `netlify`
    -   `netlify` branch is protected from push/merge without E2E test passing
    -   NetlifyCMS and netlify preview deploys working from `master` branch

### Workflow for development:

1. Pre-commit hooks run on code: all jest tests and lint runners
2. Push to `master` branch
3. E2E tests run on new code
4. If passed, branch pushed into `netlify`

### Workflow for NetlifyCMS:

1. PR created in `master`
2. Preview deploys run on PR
3. PR manually merged or merged through UI
4. E2E tests run on new code
5. If passed, branch pushed into `netlify`

## Scripts

-   `npm run build`: Build to production using Gatsby (outputs to `public` folder)
-   `npm run dev`: Build and serve development version using Gatsby
-   `npm run serve`: Build and serve production
-   `npm run test`: Run jest and runners
-   `npm run test:coverage`: Generate coverage reports
-   `npm run test:watch`: Run jest and runners in watch mode
-   `npm run test:debug`: Run jest and allow node-based debugging
-   `npm run test:e2e`: Run cypress E2E tests
-   `npm run test:e2e:run`: Run cypress on production build
-   `npm run test:e2e:dev`: Open cypress dashboard on development build
-   `npm run test:e2e:dev:prod`: Open cypress dashboard on production build
-   `npm run cy:run`: Run cypress
-   `npm run cy:open`: Open cypress dashboard
-   `npm run lint`: Run all jest runners
-   `npm run lint:md`: Run remark markdown linter
-   `npm run prepare`: Prepare husky
-   `npm run netlify`: Script to run as netlify that builds and generates public coverage reports
-   `npm run format`: Auto-format using prettier

## Possible improvements

-   When navigating directly to an episode page, the player is set to play the most recent episode rather than the episode navigated to.

## Available for Hire

I'm available for freelance, contracts, and consulting both remotely and in the Hudson Valley, NY (USA) area. [Some more about me](https://www.zweisolutions.com/about.html) and [what I can do for you](https://www.zweisolutions.com/services.html).

Feel free to drop me a message at:

```
hi [a+] zweisolutions {●} com
```

## License

Code (outside the `/content` and `/static/docs` folders) is licensed under [MIT](./LICENSE)
Content underneath the `/content` and `/static/docs` folders is Copyright 2021 of the author Martin Hutchinson unless otherwise stated, All Rights Reserved.
