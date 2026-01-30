jest.mock('@react-native-firebase/auth', () => () => ({
    currentUser: {
      uid: 'testUid',
    },
  }));
  
  jest.mock('@react-native-firebase/database', () => () => ({
    ref: jest.fn().mockReturnThis(),
    once: jest.fn(() => Promise.resolve({
      val: () => ({ cal: 0, pro: 0, fat: 0, car: 0 }),
    })),
    set: jest.fn(),
  }));

import { macroPointCalculator_preview } from '../../src/components/PointCalculator';

describe('PointCalculator', () => {
  describe('macroPointCalculator_preview', () => {
    it('calculates total points correctly', () => {
      const data = {
        cal: 100,
        pro: 100,
        car: 100,
        fat: 100,
      };
      const goal = {
        cal: 100,
        pro: 100,
        car: 100,
        fat: 100,
      };

      const totalPoints = macroPointCalculator_preview(data, goal);

      expect(totalPoints).toBe(40);
    });
  });
});