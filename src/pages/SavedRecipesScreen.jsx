import { Text, View, ScrollView, TouchableOpacity, Alert  } from 'react-native';
import { useEffect, useState } from 'react';
import colors from "../assets/colors"; 
import { savedRecipesStyle } from '../styles/SavedRecipesStyle';
import { useTranslation } from "react-i18next";
import "../translation";
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

/**
 * @constructor
 * @description The screen that shows all the saved recipes a user has.
 * @param {Object} navigation - Navigation object used to navigate between screens.
 * @returns {JSX.Element} - Returns screen displaying all the saved recipes for a user.
 */
export default function SavedRecipes({ navigation }) {
  const { t } = useTranslation();
  const currentUser = auth().currentUser;
  const userRef = database().ref(`Users/${currentUser.uid}`);
  const userSavedRef = database().ref(`Users/${currentUser.uid}/saved`);

  const [mealArray, setMealArray] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      userSavedRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
          const dataFromFirebase = snapshot.val();
          setMealArray(dataFromFirebase);
        }
      });
    }

    fetchData();

    return () => userSavedRef.off('value');
  }, []);

  /**
   * @function deleteEntryFromFirebase - Deletes an entry from Firebase based on the provided key.
   * @param {string} currKey - The key of the entry to be deleted.
   */
  const deleteEntryFromFirebase = (currKey) => () => {
    const toDeleteSavedRef = database().ref(`Users/${currentUser.uid}/saved/${currKey}`);
    // show confirm dialog/alert
    Alert.alert(
      t('confirmDelete'),
      t('questionDelete'),
      [
        {
          text: t('cancel'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          onPress: () => {
            // Perform delete action here
            toDeleteSavedRef.remove()
            .then(() => {
              console.log('Entry deleted successfully');
            })
            .catch((error) => {
              console.error('Error deleting entry:', error);
            });
          },
        },
      ],
      { cancelable: false }
    )
  };

  return (
    <>
      <View style={savedRecipesStyle.container}>
        <ScrollView>
          <Text style={savedRecipesStyle.title}>{t('listSavedMeals')}:</Text>
          {
            Object.keys(mealArray).map((key) => (
              <View style={savedRecipesStyle.entryContainer} key={key}>
                <Text style={savedRecipesStyle.entryTitle}>{mealArray[key].name}</Text>
                <Text style={savedRecipesStyle.dateText}>{mealArray[key].date}</Text>
                <Text style={savedRecipesStyle.text}>{t('calories')}: {Math.round(mealArray[key].cal)}</Text>
                <Text style={savedRecipesStyle.text}>{t('fat')}: {Math.round(mealArray[key].fat)}</Text>
                <Text style={savedRecipesStyle.text}>{t('protein')}: {Math.round(mealArray[key].pro)}</Text>
                <Text style={savedRecipesStyle.text}>{t('carbs')}: {Math.round(mealArray[key].car)}</Text>
                <View style={savedRecipesStyle.container}>
                  <TouchableOpacity 
                    style={[savedRecipesStyle.button, {backgroundColor: colors.darkGreen}]}
                    onPress={() => navigation.navigate('Logging', {currMealName: mealArray[key].name, 
                                                                    currCal: mealArray[key].cal, 
                                                                    currFat: mealArray[key].fat, 
                                                                    currPro: mealArray[key].pro, 
                                                                    currCar: mealArray[key].car,
                                                                    saveMealBool: false,
                                                                  })}
                    >
                    <Text style={savedRecipesStyle.buttonText}>{t('logMeal')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[savedRecipesStyle.button, {backgroundColor: colors.red}]}
                    onPress={deleteEntryFromFirebase(key)}
                  >
                    <Text style={savedRecipesStyle.buttonText}>{t('deleteMeal')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          }
        </ScrollView>
      </View>
    </>
  );
};
