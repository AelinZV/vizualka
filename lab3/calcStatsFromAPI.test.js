// calcStatsFromAPI.test.js
import { jest } from '@jest/globals';

// Мок-данные
const mockData = [
    { breed: "Abyssinian", country: "Ethiopia" },
    { breed: "Persian", country: "Iran" },
    { breed: "Balinese", country: "Ethiopia" },
];

// Ожидаемый результат
const expectedStats = {
    Ethiopia: 2,
    Iran: 1,
};

describe('calcStatsFromAPI', () => {
    let calcStatsFromAPI;

    beforeAll(async () => {
        // Очищаем кэш модулей
        jest.resetModules();

        // Мокируем loadData
        jest.unstable_mockModule('./loadData', () => ({
            default: jest.fn().mockResolvedValue(mockData),
        }));

        // Загружаем calcStatsFromAPI после мокирования
        const module = await import('./calcStatsFromAPI');
        calcStatsFromAPI = module.default;
    });

    it('correctly calculates stats from mock data', async () => {
        const result = await calcStatsFromAPI();
        expect(result).toEqual(expectedStats);
    });
});