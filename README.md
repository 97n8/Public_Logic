
  # Branding Strategy Development

  This is a code bundle for Branding Strategy Development. The original project is available at https://www.figma.com/design/Q4tO7Y8QN1nelP5b0rg3AJ/Branding-Strategy-Development.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## HMLP (PublicLogic App)

  The app served at `/hmlp/` is built during deploy via `scripts/publish-hmlp.mjs`, which pulls the latest frontend from the `97n8/AGNOSTIC` repo and publishes the built assets into `hmlp/`.

  Runtime config lives at `hmlp/config.js` (MSAL + SharePoint site + vault list names).
  
