import {Text, View, Pressable } from 'react-native';
import {useState} from 'react'
import { loggingStyle } from '../styles/LoggingStyle';
import RecipePointsSwitch from '../components/RecipeSwitchComponent';
import ServingButtons  from '../components/ServingButtonsComponent';
import { pointStyle } from '../styles/GetPointsStyle'; 
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { useTranslation } from "react-i18next";
import "../translation";

/**
 * @constructor
 * @description Functional component for logging meals that is given meal information through the parameters.
 * @param {Object} navigation - Navigation object for navigating between screens.
 * @param {Object} route - Route object containing parameters passed to this screen.
 * @returns {JSX.Element} - JSX element representing the Logging screen.
 */
export default function Logging({ navigation, route }) {
  const { t } = useTranslation();

  // Initialization of Firebase authentication and database references
  const currentUser = auth().currentUser;
  const userRef = database().ref(`Users/${currentUser.uid}`);
  const currDate = new Date();
  // formate date() output to YYYY-MM-DD
  let formattedDate = `${currDate.getFullYear()}-${String(currDate.getMonth() + 1).padStart(2, '0')}-${String(currDate.getDate()).padStart(2, '0')}`;
  
  const userDailyRef = database().ref(`Users/${currentUser.uid}/history/${formattedDate}`);
  const userSavedRef = database().ref(`Users/${currentUser.uid}/saved`);

  // Destructuring route params with default values
  const {
    currMealName = "No meal selected", 
    currCal = "0.0", 
    currFat = "0.0",  
    currPro = "0.0", 
    currCar = "0.0",
    saveMealBool = false,
  } = route.params;

  // State variables
  const [cookMealBoolean, setCookMealBoolean] = useState(false);
  const [saveMealBoolean, setSaveMealBoolean] = useState(false);
  const [mealName, setMealName] = useState('');
  const [servingRatio, setServingRatio] = useState('');

  /**
   * @function handleCookedMealSwitch - Handles the change event of the cooked meal switch.
   * @param {boolean} value - The new value of the cooked meal switch.
   */
  const handleCookedMealSwitch = (value) => {
    setCookMealBoolean(value);
  };

  /**
   * @function handleSaveMealSwitch - Handles the change event of the save meal switch.
   * @param {boolean} value - The new value of the save meal switch.
   */
  const handleSaveMealSwitch = (value) => {
    setSaveMealBoolean(value);
  };

  /**
   * @function handleMealName - Handles the change event of the meal name input.
   * @param {string} value - The new value of the meal name.
   */
  const handleMealName = (value) => {
    setMealName(value);
  };

  /**
   * @function handleServingChange - Handles the change event of the serving ratio input.
   * @param {string} value - The new value of the serving ratio.
   */
  const handleServingChange = (value) => {
    setServingRatio(value);
  };

  /**
   * @function calculateNewMacro - Calculates the updated value of a macro based on the new macro amount.
   * @param {string} macroName - The name of the macro.
   * @param {number} newMacroAmount - The new amount of the macro.
   * @returns {Promise<number>} - The updated value of the macro.
   */
  async function calculateNewMacro(macroName, newMacroAmount) {
    let currValue = 0;
    let updatedMacro = 0;
    let snapshot = await userDailyRef.once('value');

    try {
      // if the snapshot.val() returns null, create the values by setting to 0 and retake the snapshot
      if (!snapshot.val()) {
        // push new day with 0 values for macros to set up
        userDailyRef.set({
          cal: 0,
          pro: 0,
          fat: 0,
          car: 0,
        });
        // update snapshot with new setup date branch
        snapshot = await userDailyRef.once('value');
      }
    } catch (error) {
      console.error('Error reading snapshot:', error);
    }
    
    try {
      if (macroName === "Calories") {
        currValue = snapshot.val().cal;
      } else if (macroName === "Fat(g)") {
        currValue = snapshot.val().fat;
      } else if (macroName === "Protein(g)") {
        currValue = snapshot.val().pro;
      } else if (macroName === "Carbs") {
        currValue = snapshot.val().car;
      } else {
        console.error('Error finding macro type:');
      }

      if (currValue === null) {
        currValue = 0; // Provide a default value if currValue is null
      }

      updatedMacro = currValue + newMacroAmount;
      // console.log(' --- updated macro: ', updatedMacro);
    } catch (error) {
      console.error('Error calculating new macro:', error);
    }

    return updatedMacro;
  }

  /**
   * @function onConfirmPress - Updates the experience value for the current user using a temporary formula with all macro values.
   */
  async function onConfirmPress() {
    let updatedCal = await calculateNewMacro('Calories', currCal*servingRatio);
    let updatedFat = await calculateNewMacro('Fat(g)', currFat*servingRatio);
    let updatedPro = await calculateNewMacro('Protein(g)', currPro*servingRatio);
    let updatedCar = await calculateNewMacro('Carbs', currCar*servingRatio);

    // update database with macros (add to existing daily macros)
    userDailyRef.update({
      cal: updatedCal,
      pro: updatedPro,
      fat: updatedFat,
      car: updatedCar,
    })
    .then(()=> {
      // console.log('User experience updated successfully: ', expCalculation);
      console.log(' >>> input calories: ', currCal*servingRatio);
      console.log(' >>>  input protein: ', currPro*servingRatio);
      console.log(' >>>      input fat: ', currFat*servingRatio);
      console.log(' >>>    input carbs: ', currCar*servingRatio);
      console.log(' >>>  cooked meal?: ', cookMealBoolean);
      console.log(' >>>   saved meal?: ', saveMealBoolean);
      console.log(' >>>     meal name: ', currMealName);
      console.log(' >>>  serving size: ', servingRatio);
    })
    .catch((error) => {
      console.error('Error updating data: ', error);
    })

    // if user wants to save the current meal, 
    // update "saved" section in database with new meal/macro combination and name
    if (saveMealBoolean) {
      const newMealRef = userSavedRef.push();
      newMealRef.set({
        name: currMealName, 
        cal: currCal,
        pro: currPro,
        fat: currFat,
        car: currCar, 
        date: formattedDate,
      })
      .then(()=> {
        console.log('New meal added successfully!, name:',mealName, '| date:', formattedDate);
      })
      .catch((error) => {
        console.error('Error adding new meal:', error);
      });
    }

    if (cookMealBoolean) {
      // get current exp value from the database
      let snapshot = await userRef.once('value');

      try {
        // if the snapshot.val() returns null, create the values by setting to 0 and retake the snapshot
        if (!snapshot.val()) {
          // push new day with 0 values for macros to set up
          // userRef.update({
          //   experience: 0,
          // });
          // // update snapshot with new setup date branch
          // snapshot = await userRef.once('value');
        }
      } catch (error) {
        console.error('Error reading snapshot:', error);
      }

      // add new amount (10 points)
      let updateEXP = snapshot.val().experience + 10;

      // push to database
      userRef.update({
        experience: updateEXP,
      })
      
      .then(()=> {
        console.log('Cooked meal experience added correctly');
      })
      .catch((error) => {
        console.error('Error adding cooked experience:', error);
      });
    };

    // after updating database, send the user back to home
    navigation.navigate('Home');
  };

  return (
    <>
      <View style={loggingStyle.container}>
        <View style={loggingStyle.entryContainer}>
          <Text style={loggingStyle.title}>{currMealName}</Text>
          <Text style={loggingStyle.entryTitle}>{t('totalTracked')}:</Text>
          <Text style={loggingStyle.text}>{t('calories')}: {Math.round(currCal)}</Text>
          <Text style={loggingStyle.text}>{t('protein')}: {Math.round(currPro)}</Text>
          <Text style={loggingStyle.text}>{t('fat')}: {Math.round(currFat)}</Text>
          <Text style={loggingStyle.text}>{t('carbs')}: {Math.round(currCar)}</Text>
          
          <ServingButtons servingChange={handleServingChange} />
          <Text style={loggingStyle.entryTitle}>{t('servingAmount')} ({t('serving')}: {servingRatio}):</Text>
          <Text style={loggingStyle.text}>{t('calories')}: {Math.round(currCal) * servingRatio}</Text>
          <Text style={loggingStyle.text}>{t('protein')}: {Math.round(currPro) * servingRatio}</Text>
          <Text style={loggingStyle.text}>{t('fat')}: {Math.round(currFat) * servingRatio}</Text>
          <Text style={loggingStyle.text}>{t('carbs')}: {Math.round(currCar) * servingRatio}</Text>
          
          <RecipePointsSwitch 
            saveMealChange={handleSaveMealSwitch}
            cookMealChange={handleCookedMealSwitch} 
            mealNameChange={handleMealName}
            needSaveSwitch = {saveMealBool}
          />

          <Pressable style={pointStyle.getPointsButton} onPressOut={onConfirmPress}>
            <Text style={pointStyle.buttonText}>{t('confirm')}</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};
