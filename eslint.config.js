import js from "@eslint/js";
import globals from "globals";

import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

import n from "eslint-plugin-n";
import importPlugin from "eslint-plugin-import";

import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  // Ignore build artifacts and deps everywhere
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.vite/**",
      "**/coverage/**",
    ],
  },

  // Base JS recommended rules
  js.configs.recommended,

  // ----------------------------
  // Frontend (React)
  // ----------------------------
  {
    files: ["frontend/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // React 17+ doesn’t require React in scope
      "react/react-in-jsx-scope": "off",

      // Hooks rules
      ...reactHooks.configs.recommended.rules,

      // Vite HMR friendly rule (optional but nice)
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // Helpful import rules (lightweight)
      "import/no-unresolved": "off", // Vite aliases can confuse ESLint unless you configure resolver
      "import/order": ["warn", { "newlines-between": "always" }],

      // Noise reducers
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // ----------------------------
  // Backend (Node)
  // ----------------------------
  {
    files: ["backend/**/*.{js,cjs,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs", // change to "module" if your backend uses ESM
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      n,
      import: importPlugin,
    },
    rules: {
      // Node best practices
      "n/no-missing-require": "off", // can false-positive with tooling
      "n/no-process-exit": "off",

      // General
      "no-console": "off",
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  prettierConfig,
];
