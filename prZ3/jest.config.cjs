// jest.config.cjs
module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    //extensionsToTreatAsEsm: ['.js'], // Явно указываем ESM
};