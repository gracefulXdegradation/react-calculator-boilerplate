module.exports = {
    verbose: true,
    setupTestFrameworkScriptFile: './enzyme.config.js',
    moduleNameMapper: {
        '\\.(s?css)$': '<rootDir>/src/testutils/styleMock.js',
    },
    testPathIgnorePatterns: ['<rootDir>/src/testutils/'],
    testEnvironment: 'jest-environment-jsdom-global',
    snapshotSerializers: ['enzyme-to-json/serializer'],
    coveragePathIgnorePatterns: ['<rootDir>/src/testutils/'],
};
