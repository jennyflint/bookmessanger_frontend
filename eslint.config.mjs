import withNuxt from './.nuxt/eslint.config.mjs'
import unusedImports from 'eslint-plugin-unused-imports'

export default withNuxt([
  {
    plugins: {
      'unused-imports': unusedImports
    },
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
      'no-var': 'error',
      'no-multiple-empty-lines': ['error', { 
        max: 1,
        maxEOF: 0,
        maxBOF: 0
      }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',

      'vue/multi-word-component-names': 'error',
      'vue/no-deprecated-slot-attribute': 'error',
      'vue/block-lang': ['error', {
        script: { lang: 'ts' }
      }],
      'vue/no-v-html': 'warn',
      'vue/no-unused-components': 'error',
      'vue/no-unused-vars': 'error',
      'vue/html-indent': ['error', 2],
      'vue/padding-line-between-blocks': ['error', 'always'],
      'vue/max-attributes-per-line': ['error', {
        singleline: { max: 2 },
        multiline: { max: 1 }
      }],
      'vue/prop-name-casing': ['error', 'camelCase'],
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }
      ]
    }
  },

  {
    files: ['**/pages/**/*.vue', '**/layouts/**/*.vue', '**/error.vue', 'app.vue'],
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  }
])