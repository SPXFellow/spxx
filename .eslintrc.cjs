module.exports = {
	ignorePatterns: ['.eslintrc.js', 'out/**/*.js', '.yarn/**/*.js'],
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: ['./tsconfig.eslint.json', './packages/*/tsconfig.json'],
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	rules: {
		'eol-last': 'error',
		'prefer-const': 'error',
		'quote-props': ['error', 'as-needed'],
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
	],
}
