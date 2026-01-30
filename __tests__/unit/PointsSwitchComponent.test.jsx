import React from 'react';
import renderer from 'react-test-renderer';
import PointsSwitch from '../../src/components/PointsSwitchComponent';

describe('PointsSwitch', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <PointsSwitch 
        cookMealChange={jest.fn()} 
        saveMealChange={jest.fn()} 
        mealNameChange={jest.fn()} 
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});