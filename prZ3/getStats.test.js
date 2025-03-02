// getStats.test.js
import { jest } from '@jest/globals';
import getStats from './getStats';
import getDataFromAPI from './getDataFromAPI';

jest.mock('./getDataFromAPI', () => jest.fn());

// Мок-данные
const mockRecipes = [
  {
    id: 1,
    name: 'Pasta Carbonara',
    ingredients: ['pasta', 'eggs', 'bacon', 'cheese'],
  },
  {
    id: 2,
    name: 'Chicken Curry',
    ingredients: ['chicken', 'curry powder', 'coconut milk', 'rice', 'pasta'],
  },
];

// Ожидаемый результат
const expectedStats = {
  pasta: 2,
  eggs: 1,
  bacon: 1,
  cheese: 1,
  chicken: 1,
  'curry powder': 1,
  'coconut milk': 1,
  rice: 1,
};

describe('getStats', () => {
  beforeAll(() => {
    getDataFromAPI.mockResolvedValue(mockRecipes);
  });

  it('correctly calculates stats from mock data', async () => {
    const result = await getStats(getDataFromAPI);
    expect(result).toEqual(expectedStats);
    expect(getDataFromAPI).toHaveBeenCalledTimes(1);
  });
});
