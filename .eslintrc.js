module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'backend/tsconfig.json'
  },
  rules: {
  }
}
