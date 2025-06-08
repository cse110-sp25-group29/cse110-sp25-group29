export default {
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.js$': 'babel-jest'
    },
    rootDir: '../', 
    testMatch: ['**/admin/tests/*.test.js']
  };
  