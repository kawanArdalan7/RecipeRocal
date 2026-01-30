import React from 'react';
import renderer from 'react-test-renderer';
import RecipeCard from '../../src/components/RecipeCard';

describe('RecipeCard', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<RecipeCard />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});