import React from 'react';
import renderer from 'react-test-renderer';
import RecipePointsSwitch from '../../src/components/RecipeSwitchComponent';

describe('RecipePointsSwitch', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <RecipePointsSwitch 
        cookMealChange={() => {}}
        saveMealChange={() => {}}
        mealNameChange={() => {}}
        currMealName="Test Meal"
        needSaveSwitch={true}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});