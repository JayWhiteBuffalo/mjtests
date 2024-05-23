module.exports = {
  extends: [
    'eslint:recommended',
    // "plugin:react/recommended",
    // "plugin:react-hooks/recommended",
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'prettier',
    'next/core-web-vitals',
  ],
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'import', 'jsx-a11y'],
  rules: {
    '@next/next/no-html-link-for-pages': 'warn',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'import/no-anonymous-default-export': 'off',
    'jsx-a11y/label-has-associated-control': 'warn',
    'jsx-a11y/no-autofocus': 'warn',
    'no-empty': 'off',
    'no-extra-boolean-cast': 'warn',
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: 'useMemoWithDispose',
      },
    ],
  },

  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
