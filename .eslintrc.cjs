module.exports = {
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'import', 'jsx-a11y'],
  'extends': [
    'eslint:recommended',
    // 'plugin:react/recommended',
    // 'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'prettier',
    'next/core-web-vitals',
  ],
  'rules': {
    'import/no-anonymous-default-export': 'off',
    'no-mixed-operators': 'off',
    'no-restricted-globals': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        'varsIgnorePattern': '^_',
        'argsIgnorePattern': '^_',
      },
    ],
  },
}
