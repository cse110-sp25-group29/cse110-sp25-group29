// eslint.config.js

import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    rules: {
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "no-unused-vars": ["warn"]
    },
  },
  js.configs.recommended  
]);
