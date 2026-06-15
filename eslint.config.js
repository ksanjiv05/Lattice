import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Keep files and components small and debuggable.
      'max-lines': ['warn', { max: 200, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': [
        'warn',
        { max: 80, skipBlankLines: true, skipComments: true },
      ],
      'max-depth': ['warn', 3],
      complexity: ['warn', 12],
      'no-nested-ternary': 'warn',
    },
  },
  {
    // The formula tokenizer/parser is inherently branchy by nature; the
    // component-oriented complexity limits don't apply to a hand-written parser.
    files: ['src/lib/formula/**/*.ts'],
    rules: {
      complexity: 'off',
      'max-depth': 'off',
      'no-nested-ternary': 'off',
    },
  },
])
