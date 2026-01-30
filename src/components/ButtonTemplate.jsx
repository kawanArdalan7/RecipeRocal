import { Text, Pressable } from 'react-native';
import React from 'react';
import { settingStyle } from '../styles/SettingStyle';

/**
 * @template
 * @description A generic template for settings-related buttons.
 * @param {string} pos - Position the button is created (top, middle, bottom).
 * @param {object} nav - Contains methods for navigating between screens.
 * @param {string} route - Route the button navigates to.
 * @param {string} name - Title of the button.
 * @return {ButtonTemplate} Returns a formatted button as a React component.
 */
const ButtonTemplate = ({ pos, nav, route, name }) => {
  return (
    <>
      <Pressable
        style={pos === 'top' ? settingStyle.pressTopButton : pos === 'middle' ? settingStyle.pressButton : settingStyle.pressBottomButton}
        onPressOut={() => nav.navigate(route)}
      >
        <Text style={settingStyle.buttonText}>{name}</Text>
      </Pressable>
    </>
  );
};

export default ButtonTemplate;
