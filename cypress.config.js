import { defineConfig } from 'cypress'

// module.exports = defineConfig({
//   e2e: {
//     baseUrl: 'http://localhost:1234',
//   },
// })
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
  },
})