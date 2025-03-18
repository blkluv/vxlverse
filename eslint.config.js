import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";

// Create a clean copy of browser globals to fix the whitespace issue
const browserGlobals = { ...globals.browser };
// Fix the AudioWorkletGlobalScope whitespace issue
if ("AudioWorkletGlobalScope " in browserGlobals) {
  const value = browserGlobals["AudioWorkletGlobalScope "];
  delete browserGlobals["AudioWorkletGlobalScope "];
  browserGlobals["AudioWorkletGlobalScope"] = value;
}

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: browserGlobals,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "unused-imports": unusedImports,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // Add rules to handle unused imports
      "@typescript-eslint/no-unused-vars": "off", // Turn off the base rule
      "unused-imports/no-unused-imports": "error", // Error on unused imports
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  }
);
