/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest", // Ensures Jest uses ts-jest preset for TypeScript support
  testEnvironment: "node", // Defines the test environment as Node.js
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}], // Correct regex for `.ts` and `.tsx` files
  },
  testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"], // Matches all test files
  moduleFileExtensions: ["ts", "js", "json"], // File extensions Jest will handle
  coverageDirectory: "coverage", // Directory for storing coverage reports
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}", // Collects coverage from TypeScript files in `src`
    "!src/**/*.d.ts", // Excludes TypeScript declaration files
  ],
  clearMocks: true, // Clears mocks between tests to avoid test interference
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Setup file for environment variables or global mocks
};
