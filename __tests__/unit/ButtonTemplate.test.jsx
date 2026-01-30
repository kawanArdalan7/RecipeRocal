import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ButtonTemplate from '../../src/components/ButtonTemplate';

const mockNav = {
  navigate: jest.fn(),
};

describe('ButtonTemplate', () => {
  it('should render the button and navigate when pressed', () => {
    const { getByText } = render(<ButtonTemplate pos="top" nav={mockNav} route="SomeRoute" name="ButtonName" />);

    const button = getByText('ButtonName');
    expect(button).toBeTruthy();

    fireEvent.press(button);
  });
});