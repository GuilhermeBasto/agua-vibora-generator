/**
 * This is the ESLint configuration for React Router v7 app.
 * Updated to support framework mode with loaders, actions, and components in the same file.
 */
import js from '@eslint/js'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
    // Ignore build artifacts and generated files
    {
        ignores: [
            'build/**',
            'dist/**',
            '.react-router/**',
            'node_modules/**',
            '!**/.server',
            '!**/.client',
        ],
    },

    // Base config for all files
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.commonjs,
                ...globals.es6,
            },
        },
    },

    // TypeScript and React files
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'jsx-a11y': jsxA11y,
        },
        settings: {
            react: {
                version: 'detect',
            },
            formComponents: ['Form'],
            linkComponents: [
                { name: 'Link', linkAttribute: 'to' },
                { name: 'NavLink', linkAttribute: 'to' },
            ],
        },
        rules: {
            // React rules
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,
            ...jsxA11y.configs.recommended.rules,

            // React Router v7 framework mode - allow loaders, actions, etc.
            'react-refresh/only-export-components': [
                'warn',
                {
                    allowConstantExport: true,
                    allowExportNames: [
                        'meta',
                        'links',
                        'headers',
                        'loader',
                        'action',
                        'default',
                        'handle',
                        'shouldRevalidate',
                        'ErrorBoundary',
                        'HydrateFallback',
                    ],
                },
            ],

            // TypeScript rules
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    prefer: 'type-imports',
                    fixStyle: 'separate-type-imports',
                    disallowTypeAnnotations: true,
                },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],

            // React specific
            'react/prop-types': 'off', // Using TypeScript for prop validation
            'react-hooks/exhaustive-deps': 'error',

            // Accessibility - relax some rules for better DX
            'jsx-a11y/label-has-associated-control': [
                'warn',
                {
                    required: {
                        some: ['nesting', 'id'],
                    },
                },
            ],
            'jsx-a11y/anchor-has-content': 'warn',
            'jsx-a11y/click-events-have-key-events': 'warn',
            'jsx-a11y/no-static-element-interactions': 'warn',

            // Import rules - enforce using ~ alias for app directory imports
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['../../*'],
                            message:
                                'Please use the `~` alias for imports from the `app` directory.',
                        },
                    ],
                },
            ],

            // Code quality
            'prefer-const': 'error',
            'no-empty-pattern': 'warn',
        },
    },

    // Specific overrides for UI components and type-only files
    {
        files: ['**/ui/**/*.{ts,tsx}', '**/*.types.ts', '**/+types/**/*.ts'],
        rules: {
            'react-refresh/only-export-components': 'off',
        },
    },
]
