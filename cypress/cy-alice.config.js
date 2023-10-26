import { defineConfig } from 'cypress'

export default defineConfig({
  fixturesFolder: false,
  viewportWidth: 800,
  viewportHeight: 400,
  defaultCommandTimeout: 15000,
  videosFolder: 'cypress/videos-pair/alice',
  screenshotsFolder: 'cypress/screenshots-pair/alice',
  e2e: {
    setupNodeEvents(on, config) {},
    supportFile: false,
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/pair/**/alice.js',
  },
})
