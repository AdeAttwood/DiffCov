module.exports = {
  env: { node: true, es6: true },
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended", "plugin:prettier/recommended", "plugin:@typescript-eslint/recommended"],
  settings: {
    jsdoc: { mode: "typescript" },
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-types": [
      "error",
      {
        extendDefaults: true,
        types: {
          "{}": false,
        },
      },
    ],
  },
};
