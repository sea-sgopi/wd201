// import globals from "globals";
// import pluginJs from "@eslint/js";

// export default [
//   {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
//   {languageOptions: { globals: globals.browser }},
//   pluginJs.configs.recommended,
// ];

// overwrite

import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from "eslint-plugin-jest"; // Import the Jest plugin

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.browser, // Includes browser globals
        ...globals.node, // Includes Node.js globals
        ...globals.jest, // Includes Jest globals like `describe`, `test`, etc.
      },
    },
    plugins: {
      jest: pluginJest, // Add Jest plugin
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // Use recommended JS rules
      ...pluginJest.configs.recommended.rules, // Use recommended Jest rules
    },
  },
];
