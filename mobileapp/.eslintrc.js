module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.test.*', 'jest.setup.js'],
      env: {
        jest: true,
      },
    },
  ],
};
