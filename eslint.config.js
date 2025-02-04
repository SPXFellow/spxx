import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default [
  {
    ignores: [
      '**/node_modules/**/*',
      '**/dist/**/*',
      '**/gmConfig.d.ts',
      '**/.rollup.cache/**/*',
    ],
  },
  ...tseslint.config(eslint.configs.recommended, tseslint.configs.recommended, {
    rules: {
      'eol-last': 'error',
      'prefer-const': 'error',
      'quote-props': ['error', 'as-needed'],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.greasemonkey,
      },
    },
  }),
]
