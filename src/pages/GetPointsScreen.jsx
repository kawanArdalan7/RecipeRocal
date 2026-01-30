import { Pressable, Text, View, ScrollView } from 'react-native';
import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import PointsSwitch from '../components/PointsSwitchComponent';
import Counter from '../components/CounterComponent';
import { pointStyle } from '../styles/GetPointsStyle';
import { useTranslation } from "react-i18next";
import "../translation";

const calorieCounterInfo = {
  max: 2000,
  min: 0,
  curr: 1
};

const proteinCounterInfo = {
  max: 100,
  min: 0,
  curr: 1
};

const fatCounterInfo = {
  max: 100,
  min: 0,
  curr: 1
};

const carbCounterInfo = {
  max: 200,
  min: 0,
  curr: 1
};

/**
 * @constructor
 * @description GetpointsPage component that renders the nutritional counters and a confirm button.
 * @param {object} navigation - Contains methods for navigating between screens.
 * @returns {GetPointsPage} Returns page for manually entering and processing macro nutrient input from users.
 */
export default function GetPointsPage({ navigation }) {
  const { t } = useTranslation();

  const currentUser = auth().currentUser;
  const userRef = database().ref(`Users/${currentUser.uid}`);

  const currDate = new Date();
  // formate date() output to YYYY-MM-DD
  let formattedDate = `${currDate.getFullYear()}-${String(currDate.getMonth() + 1).padStart(2, '0')}-${String(currDate.getDate()).padStart(2, '0')}`;
  
  const userDailyRef = database().ref(`Users/${currentUser.uid}/history/${formattedDate}`);
  const userSavedRef = database().ref(`Users/${currentUser.uid}/saved`);

  const [cookMealBoolean, setCookMealBoolean] = useState(false);
  /**
   * @function handleCookedMealSwitch - Handles switch for user cooking the meal.
   * @param {boolean} value - Status indicating cooked or not.
   */
  const handleCookedMealSwitch = (value) => {
    setCookMealBoolean(value);
  };

  const [saveMealBoolean, setSaveMealBoolean] = useState(false);
  /**
   * @function handleSaveMealSwitch - Handles switch for user saving the meal.
   * @param {boolean} value - Status indicating saved or not.
   */
  const handleSaveMealSwitch = (value) => {
    setSaveMealBoolean(value);
  };

  const [mealName, setMealName] = useState('');
  /**
   * @function handleMealName - Sets the name of the meal made by the user.
   * @param {string} value - Name of the meal.
   */
  const handleMealName = (value) => {
    setMealName(value);
  }

  /**
   * @function calculateNewMacro - Read in current macro and add with parameter new macro amount to return sum.
   * @param {*} macroName - Name of the macro.
   * @param {*} newMacroAmount - Updated amount.
   * @returns {int} Returns the sum of the new amount for the macro.
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
      } else if (macroName === "Carbs(g)") {
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
   * @function onConfirmPress - Updates the macro value for the current user for the current date.
   */
  async function onConfirmPress() {
    // FIXME testing formula for exp points calculation only based on new macro values
    // let expCalculation = calorieCounterInfo.curr + proteinCounterInfo.curr + fatCounterInfo.curr + carbCounterInfo.curr;
    
    let updatedCal = await calculateNewMacro('Calories', calorieCounterInfo.curr);
    let updatedPro = await calculateNewMacro('Protein(g)', proteinCounterInfo.curr);
    let updatedFat = await calculateNewMacro('Fat(g)', fatCounterInfo.curr);
    let updatedCar = await calculateNewMacro('Carbs(g)', carbCounterInfo.curr);
    
    // update user with experience points (for testing, structure will change FIXME)
    // userRef.update({
    //   experience: expCalculation,
    // })
    // update database with macros (add to existing daily macros)
    userDailyRef.update({
      cal: updatedCal,
      pro: updatedPro,
      fat: updatedFat,
      car: updatedCar,
    })
    .then(()=> {
      // console.log('User experience updated successfully: ', expCalculation);
      console.log(' >>> input calories: ', calorieCounterInfo.curr);
      console.log(' >>>  input protein: ', proteinCounterInfo.curr);
      console.log(' >>>      input fat: ', fatCounterInfo.curr);
      console.log(' >>>    input carb: ', carbCounterInfo.curr);
      console.log(' >>>  cooked meal?: ', cookMealBoolean);
      console.log(' >>>   saved meal?: ', saveMealBoolean);
      console.log(' >>>     meal name: ', mealName);
    })
    .catch((error) => {
      console.error('Error updating data: ', error);
    })

    // Juliana, if user wants to save the current meal, 
    // update "saved" section in database with new meal/macro combination and name
    if (saveMealBoolean) {
      const newMealRef = userSavedRef.push();
      newMealRef.set({
        name: mealName, 
        cal: calorieCounterInfo.curr,
        pro: proteinCounterInfo.curr,
        fat: fatCounterInfo.curr,
        car: carbCounterInfo.curr, 
        date: formattedDate,
      })
      .then(()=> {
        console.log('New meal added successfully!, name:', mealName, '| date:', formattedDate);
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
        if (!snapshot.val()){
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

    // reset curr values after updating the database
    calorieCounterInfo.curr = 1;
    proteinCounterInfo.curr = 1;
    fatCounterInfo.curr = 1;
    carbCounterInfo.curr = 1;
    setMealName("");

    // after updating database, send the user back to home
    navigation.navigate('Home');
  };

  return (
    <>
      <View style={pointStyle.body}>
        <ScrollView>
          <Counter labelName={t('calories')} counterInfo={calorieCounterInfo} />
          <Counter labelName={t('proteing')} counterInfo={proteinCounterInfo} />
          <Counter labelName={t('fatg')} counterInfo={fatCounterInfo} />
          <Counter labelName={t('carbg')} counterInfo={carbCounterInfo} />
          
          <PointsSwitch 
            cookMealChange={handleCookedMealSwitch} 
            saveMealChange={handleSaveMealSwitch} 
            mealNameChange={handleMealName}
          />

          <Pressable style={pointStyle.getPointsButton} onPressOut={onConfirmPress}>
            <Text style={pointStyle.buttonText}>{t('confirm')}</Text>
          </Pressable>
        </ScrollView>
      </View>
    </>
  );
};
