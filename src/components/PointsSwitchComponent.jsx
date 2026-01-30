import { Text, View, Switch, TextInput } from 'react-native';
import { useState } from 'react';
import { switchStyle } from '../styles/SwitchStyle';
import { useTranslation } from "react-i18next";
import "../translation";

/**
 * @component
 * @description A component for toggling options related to logging meal points.
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.cookMealChange - Function to handle changes in the "cooked meal" option.
 * @param {Function} props.saveMealChange - Function to handle changes in the "save meal" option.
 * @param {Function} props.mealNameChange - Function to handle changes in the meal name input.
 * @returns {JSX.Element} - JSX element representing the PointsSwitch component.
 */
function PointsSwitch({ cookMealChange, saveMealChange, mealNameChange }) {
  const { t } = useTranslation();

  // State variables for cooked meal, saved meal, and meal name
  const [compCookMealEnabled, setCompCookMealEnabled] = useState(false);
  const [compSaveMealEnabled, setCompSaveMealEnabled] = useState(false);
  const [compMealName, setCompMealName] = useState('');

  /**
   * @function compCookMealSwitch - Handles the change event of the "cooked meal" switch.
   */
  const compCookMealSwitch = () => {
    const newSwitchValue = !compCookMealEnabled;
    setCompCookMealEnabled(newSwitchValue);
    cookMealChange(newSwitchValue);
  };

  /**
   * @function compSaveMealSwitch - Handles the change event of the "save meal" switch.
   */
  const compSaveMealSwitch = () => {
    const newSwitchValue = !compSaveMealEnabled;
    setCompSaveMealEnabled(newSwitchValue);
    saveMealChange(newSwitchValue);
  };

  /**
   * @function compMealNameChange - Handles the change event of the meal name input.
   * @param {string} value - The new value of the meal name.
   */
  const compMealNameChange = (value) => {
    setCompMealName(value);
    mealNameChange(value);
  };

  // Render the counter with increment and decrement buttons and a slider for visual representation
  return (
    <>
      <View>
        <View style={switchStyle.switchContainer}>
          <Text style={{color: 'black'}}>{t('didYouCook')}</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={compCookMealEnabled ? '#f5dd4b' : '#f4f3f4'}
            onValueChange={compCookMealSwitch}
            value={compCookMealEnabled}
          />
          <Text style={{color: 'black'}}>{compCookMealEnabled ? t('yesCook') : t('noCook')}</Text>
        </View>

        <View style={switchStyle.switchContainer}>
          <Text style={{color: 'black'}}>{t('saveThisMeal')}</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={compSaveMealEnabled ? '#f5dd4b' : '#f4f3f4'}
            onValueChange={compSaveMealSwitch}
            value={compSaveMealEnabled}
          />
        </View>

        {compSaveMealEnabled &&
          <View style={switchStyle.switchContainer}>
            <Text style={{color: 'black'}}>   {t('typeMealName')}:</Text>
            <TextInput
              style={switchStyle.input}
              onChangeText={compMealNameChange}
              value={compMealName}
              placeholder={t('mealName')}
            />
          </View>
        }       
      </View>
    </>
  );
};

export default PointsSwitch;
