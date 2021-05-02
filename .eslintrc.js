module.exports = {
    env: {
        node: true,
        es2020: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.eslint.json'],
    },
    plugins: ['@typescript-eslint'],
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
};
