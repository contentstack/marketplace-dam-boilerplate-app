module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:react/recommended",
    "plugin:import/typescript",
    "airbnb",
    "airbnb-typescript",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
    project: "./tsconfig.json",
    createDefaultProgram: true,
  },
  plugins: ["import", "react", "react-hooks", "@typescript-eslint"],
  rules: {
    "operator-linebreak": [
      "error",
      "after",
      {
        overrides: {
          ":": "before",
          "?": "before",
        },
      },
    ],
    "react/destructuring-assignment": ["warn"],
    "func-names": [0],
    "no-console": ["error", { allow: ["warn", "error", "info"] }],
    "no-unsafe-optional-chaining": 0,
    "no-param-reassign": 0,
    "react/jsx-props-no-spreading": 0,
  },
};
