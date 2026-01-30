import React, { useTransition } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsPage from '../../src/pages/SettingsScreen';
import { AuthContext } from '../../src/providers/authentication';

jest.mock('@react-native-firebase/auth', () => () => ({
  currentUser: {
    uid: 'testUid',
  },
}));

jest.mock('@react-native-firebase/database', () => () => ({
  ref: jest.fn().mockReturnThis(),
  once: jest.fn(() => Promise.resolve({
    val: () => ({ language: 'en', contrast: true }),
  })),
}));

jest.mock('@react-native-firebase/messaging', () => () => ({
  hasPermission: jest.fn(() => Promise.resolve(true)),
  requestPermission: jest.fn(() => Promise.resolve(true)),
  getToken: jest.fn(() => Promise.resolve('myMockToken')),
}));

jest.mock('react-i18next', () => ({
  useTransition: () => ({ t: key => key }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

describe('SettingsPage', () => {
  test('renders correctly', () => {
    const logout = jest.fn();
    const { getByText } = render(
      <AuthContext.Provider value={{ logout }}>
        <SettingsPage />
      </AuthContext.Provider>
    );

    expect(getByText('profile')).toBeTruthy();
    expect(getByText('language')).toBeTruthy();
    expect(getByText('logout')).toBeTruthy();
  });

  test('calls logout function when logout button is pressed', () => {
    const logout = jest.fn();
    const { getByText } = render(
      <AuthContext.Provider value={{ logout }}>
        <SettingsPage />
      </AuthContext.Provider>
    );

    fireEvent.press(getByText('logout'));
    expect(logout).toHaveBeenCalled();
  });
});
