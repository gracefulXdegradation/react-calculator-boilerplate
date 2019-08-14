module.exports = {
    verbose: true,
    setupTestFrameworkScriptFile: './enzyme.config.js',
    moduleNameMapper: {
        '\\.(s?css|less)$': '<rootDir>/__mocks__/testutils/styleMock.js',
    },
    testPathIgnorePatterns: ['<rootDir>/__mocks__/testutils/'],
    testEnvironment: 'jest-environment-jsdom-global',
    snapshotSerializers: ['enzyme-to-json/serializer'],
    coveragePathIgnorePatterns: ['<rootDir>/__mocks__/testutils/'],
};
