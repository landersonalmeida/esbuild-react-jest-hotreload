module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/index.tsx'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  testRegex: "((\\.|/*.)(spec))\\.tsx?$",
  transform: {
    '\\.[jt]sx?$': [
      'esbuild-jest',
      {
        sourcemap: true,
        target: 'ESNext',
      }
    ],
  },
  moduleNameMapper: {
    '.+\\.(css|style|less|sass|scss|png|jpg|ttf|woff|woff2)$': '<rootDir>/jest-files-stub.js'
  },
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect'
  ],
}
