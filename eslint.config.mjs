import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  // Next.js recommended rules (core-web-vitals + typescript)
  ...coreWebVitals,
  ...nextTypescript,

  // Custom rules on top
  {
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "import/extensions": ["off"],
      "import/first": ["error"],
      "import/no-duplicates": ["error"],
      "import/no-extraneous-dependencies": ["off"],
      "import/no-relative-packages": ["off"],
      "import/no-self-import": ["error"],
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling"],
          pathGroups: [
            {
              pattern: "@*/**",
              group: "external",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: [],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          "newlines-between": "never",
        },
      ],
      "unused-imports/no-unused-imports": ["error"],
      "react-hooks/exhaustive-deps": ["off"],
      "@typescript-eslint/naming-convention": ["off"],
    },
  },
];

export default config;
