import { defineConfig } from 'cypress'

export default defineConfig({
  fixturesFolder: false,
  viewportWidth: 800,
  viewportHeight: 400,
  defaultCommandTimeout: 15000,
  videosFolder: 'cypress/videos-pair/bob',
  screenshotsFolder: 'cypress/screenshots-pair/bob',
  e2e: {
    setupNodeEvents(on, config) {},
    supportFile: false,
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/pair/**/bob.js',
  },
})
