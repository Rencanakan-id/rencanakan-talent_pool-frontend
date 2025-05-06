import type { Config } from 'jest';

const config: Config = {
  // Core settings
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',

  // Module resolution
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/config/env$': '<rootDir>/src/config/env.test.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', 'src'],

  // 👇 Tambahkan ini
  setupFiles: ['<rootDir>/jest.env.ts'],

  // Sudah ada, biarkan
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // TypeScript configuration
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },

  // Coverage settings
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};

export default config;
