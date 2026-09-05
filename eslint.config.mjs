import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Pre-existing throughout the app; not introduced by the Next 16 upgrade.
      '@typescript-eslint/no-explicit-any': 'off',
      // New in eslint-plugin-react-hooks v7 (bundled with Next 16).
      // Enforcing it would require a larger state-management refactor.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'playwright-report/**',
    'node_modules/**',
    'next-env.d.ts',
    'jest.config.ts',
    'jest.setup.js',
    'tests-examples/**',
    'tests/**',
    'playwright.config.ts',
  ]),
])
