module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['plugin:vue/vue3-recommended', 'airbnb-base'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  globals: {
    YT: true
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src/']],
        extensions: ['.js', '.ts', '.vue']
      }
    }
  },
  rules: {
    'object-curly-newline': [
      'error',
      {
        ImportDeclaration: 'never'
      }
    ],
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
        allowNamedExports: false
      }
    ],
    'max-len': [
      'error',
      {
        code: 256,
        ignorePattern: 'class="'
      }
    ],
    'no-console': 'off',
    'comma-dangle': ['error', 'never'],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ],
    'no-unused-vars': 'off',
    'prefer-destructuring': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'vue/multi-word-component-names': 'off',
    'vue/attributes-order': ['error', { alphabetical: true }],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off',
    'no-restricted-syntax': 'off',
    'lines-between-class-members': 'off'
  }
};
