import { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // Gunakan ts-jest untuk TypeScript
  testEnvironment: 'jsdom', // Simulasi DOM untuk testing React
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Biar Jest bisa handle import CSS
    '^@/components(.*)$': '<rootDir>/src/components$1', // Tambahkan alias untuk @/components
    '^@/modules(.*)$': '<rootDir>/src/modules$1', // Tambahkan alias untuk @/modules
    '^@/lib(.*)$': '<rootDir>/src/lib$1', // Tambahkan alias untuk @/lib
    '^@/data(.*)$': '<rootDir>/src/data$1', // Tambahkan alias untuk @/data
  },
  collectCoverage: true, // Mengaktifkan coverage
  coverageDirectory: 'coverage', // Direktori hasil laporan
  collectCoverageFrom: ['src/**/*.{ts,tsx}'], // File yang ingin diukur coverage-nya
  coverageReporters: ['json', 'lcov', 'text', 'clover'], // Format laporan coverage
};

export default config;
