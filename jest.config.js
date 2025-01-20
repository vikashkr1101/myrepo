module.exports = {
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.vue$': '@vue/vue3-jest',
      '^.+\\.js$': 'babel-jest'
    },
    moduleFileExtensions: ['vue', 'js', 'json', 'jsx'],
    testMatch: [
      "**/__tests__/**/*.[jt]s?(x)",
      "**/?(*.)+(spec|test).[jt]s?(x)"
    ],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'
    }
  };
  