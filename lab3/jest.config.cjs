// jest.config.cjs
module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'babel-jest', // Транспилировать все .js файлы через Babel
    },
};