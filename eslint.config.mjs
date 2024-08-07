import jseslint from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';

export default tseslint.config(
  jseslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    ignores: ['node_modules/*', 'dist/*'],
    plugins: { '@stylistic': stylistic },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: {
          // Script parser for `<script>`
          js: '@typescript-eslint/parser',
          // Script parser for `<script lang="ts">`
          ts: '@typescript-eslint/parser',
          // Script parser for vue directives (e.g. `v-if=` or `:attribute=`)
          // and vue interpolations (e.g. `{{variable}}`).
          // If not specified, the parser determined by `<script lang ="...">` is used.
          '<template>': 'espree'
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
        YT: 'readable',
        google: 'readable'
      }
    },
    rules: {
      // Base rules
      'max-len': ['error', { code: 160, ignorePattern: 'class="' }],
      radix: ['error', 'always'],
      // Typescript rules (NOTE: some typescript rules extending base rules need them to be disabled)
      'no-shadow': 'off', // Disabled due to typescript rule
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
      // Vue rules
      'vue/attributes-order': ['error', { alphabetical: true }],
      'vue/html-self-closing': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      // Stylistic rules
      '@stylistic/array-bracket-newline': ['error', 'consistent'],
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/arrow-spacing': ['error', { before: true, after: true }],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/function-call-spacing': ['error', 'never'],
      '@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true, mode: 'strict' }],
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
      '@stylistic/no-trailing-spaces': ['error', { skipBlankLines: false, ignoreComments: false }],
      '@stylistic/object-curly-newline': [
        'error',
        {
          ObjectExpression: { multiline: true, minProperties: 5 },
          ObjectPattern: { multiline: true, minProperties: 5 },
          ImportDeclaration: 'never',
          ExportDeclaration: { multiline: true, minProperties: 5 }
        }
      ],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
      '@stylistic/operator-linebreak': ['error', 'before'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/semi-spacing': ['error', { before: false, after: true }],
      '@stylistic/space-before-function-paren': ['error', 'never'],
      '@stylistic/space-in-parens': ['error', 'never']
    }
  }
);
