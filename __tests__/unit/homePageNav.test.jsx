import React from 'react';
import renderer from 'react-test-renderer';
import HomePageNav from '../../src/components/homePageNav';

describe('HomePageNav', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<HomePageNav />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});