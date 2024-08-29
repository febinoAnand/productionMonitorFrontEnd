module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!**/*index.js',
    '!src/serviceWorker.js',
    '!src/polyfill.js',
  ],
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
  },
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'node',
  ],
  // Add this if you're using modules like `axios` or `react`
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
