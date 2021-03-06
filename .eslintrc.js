module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "react", "@typescript-eslint",
  ],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  env: {
    "browser": true,
    "es6": true,
  },
};
