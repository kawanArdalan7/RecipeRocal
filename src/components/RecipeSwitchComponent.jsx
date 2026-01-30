import { Text, View, Switch } from 'react-native';
import { useState } from 'react';
import { switchStyle } from '../styles/SwitchStyle';
import colors from "../assets/colors"; 
import { useTranslation } from "react-i18next";
import "../translation";

/**
 * @component
 * @description A component for toggling options related to logging recipe points specifically for the recipe card screen.
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.cookMealChange - Function to handle changes in the "cooked meal" option.
 * @param {Function} props.saveMealChange - Function to handle changes in the "save meal" option.
 * @param {Function} props.mealNameChange - Function to handle changes in the meal name input.
 * @param {string} props.currMealName - The name of the current meal.
 * @param {boolean} props.needSaveSwitch - Boolean indicating whether the save meal switch should be rendered.
 * @returns {JSX.Element} - JSX element representing the RecipePointsSwitch component.
 */
function RecipePointsSwitch({ cookMealChange, saveMealChange, mealNameChange, currMealName, needSaveSwitch }) {
  const { t } = useTranslation();

  // State variables for cooked meal and saved meal
  const [compCookMealEnabled, setCompCookMealEnabled] = useState(false);
  const [compSaveMealEnabled, setCompSaveMealEnabled] = useState(false);

  /**
   * @function compCookMealSwitch - Handles the change event of the "cooked meal" switch.
   */
  const compCookMealSwitch = () => {
    const newSwitchValue = !compCookMealEnabled;
    setCompCookMealEnabled(newSwitchValue);
    cookMealChange(newSwitchValue);
    console.log('COMP-COOK-MEAL-SWITCH (COMP PAGE): ', newSwitchValue);
  };

  /**
   * @function compSaveMealSwitch - Handles the change event of the "save meal" switch.
   */
  const compSaveMealSwitch = () => {
    const newSwitchValue = !compSaveMealEnabled;
    setCompSaveMealEnabled(newSwitchValue);
    saveMealChange(newSwitchValue);
    mealNameChange(currMealName);
    console.log('----COMP-SAVE-MEAL-SWITCH (COMP PAGE): ', newSwitchValue);
  };

  // Render the counter with increment and decrement buttons and a slider for visual representation
  return (
    <>
      <View>
        <View style={[
          switchStyle.switchContainer, {
            backgroundColor: colors.white,
            padding: 5,
            paddingLeft: 15,
            paddingRight: 15,
            marginTop: 10,
            borderRadius: 15
          }
        ]}>
          <Text style={{color: colors.black}}>{t('didYouCook')}</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={compCookMealEnabled ? '#f5dd4b' : '#f4f3f4'}
            onValueChange={compCookMealSwitch}
            value={compCookMealEnabled}
          />
          <Text style={{color: colors.grey}}>{compCookMealEnabled ? t('yesCook') : t('noCook')}</Text>
        </View>        
        {needSaveSwitch ? (
          <View style={[
            switchStyle.switchContainer, {
              backgroundColor: colors.white,
              padding: 5,
              paddingLeft: 15,
              paddingRight: 15,
              marginTop: 10,
              borderRadius: 15
            }
          ]}>
            <Text style={{color: colors.black}}>{t('saveThisMeal')}</Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={compSaveMealEnabled ? '#f5dd4b' : '#f4f3f4'}
              onValueChange={compSaveMealSwitch}
              value={compSaveMealEnabled}
            />
          </View>
        ) : ( null )}
      </View>
    </>
  );
};

export default RecipePointsSwitch;
