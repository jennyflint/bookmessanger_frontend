import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt([
  {
    settings: {
      polyfills: ['fetch', 'promises'],
      browsers: ['ios_saf >= 14', 'and_chr >= 96']
    },

    rules: {
      'indent': ['error', 2],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'eqeqeq': ['error', 'always'],
      'prefer-const': 'error',
      'vue/multi-word-component-names': 'error',
      'vue/no-deprecated-slot-attribute': 'error',
      'vue/html-indent': ['error', 2, {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: false,
        ignores: []
      }],
      'vue/max-attributes-per-line': ['error', {
        singleline: { max: 3 },
        multiline: { max: 1 }
      }],
      'vue/prop-name-casing': ['error', 'camelCase'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-non-null-assertion': 'error'
    }
  },
  {
    files: ['**/pages/**/*.vue', '**/layouts/**/*.vue', '**/error.vue', 'app.vue'],
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  }
])