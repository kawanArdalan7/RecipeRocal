import React from 'react';
import renderer from 'react-test-renderer';
import LanguageButton from '../../src/components/LanguageButton';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: {} } },
    lng: 'en',
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },
  });

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

jest.mock('../../src/translation', () => ({
  changeLanguage: jest.fn(),
}));

describe('LanguageButton', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<LanguageButton />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});