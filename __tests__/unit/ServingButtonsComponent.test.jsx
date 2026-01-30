import React from 'react';
import renderer from 'react-test-renderer';
import ServingButtons from '../../src/components/ServingButtonsComponent';

describe('ServingButtons', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <ServingButtons 
        servingChange={() => {}}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});