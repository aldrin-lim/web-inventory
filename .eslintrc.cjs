// eslint-disable-next-line no-undef
module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: [
    'react-refresh',
    '@typescript-eslint',
    'prettier',
    'simple-import-sort',
  ],
  ignorePatterns: [
    'node_modules',
    'dist',
    'build',
    'public',
    'tailwind.config.js',
  ],
  root: true,
  rules: {
    'react-refresh/only-export-components': 'warn',
    'prettier/prettier': 'error',
    'react/prop-types': 'off',
  },
}
