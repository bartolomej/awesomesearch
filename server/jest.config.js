module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  moduleFileExtensions: [
    "ts",
    "js"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: [
    "**/test/**/*.test.(ts|js)",
    "**/*.test.(ts|js)"
  ],
  testEnvironment: "node",
  // ignore tests in build
  testPathIgnorePatterns: [
    "<rootDir>/build/",
    "<rootDir>/node_modules/"
  ]
};
