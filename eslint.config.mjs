import globals from "globals";


export default [
  {
    files: ["**/*.js"], languageOptions: {sourceType: "script"}
  },
  {
    languageOptions: { globals: globals.browser }
  },
  {
    rules: {
      semi: "error",
      "prefer-const": "error"
    }
  }

];
