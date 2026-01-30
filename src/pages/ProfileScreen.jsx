import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { useTranslation } from "react-i18next";
import "../translation";
import { Text, View, TextInput, Image, Button, Modal, ScrollView, Pressable, Alert} from 'react-native';
import { profileStyle } from '../styles/ProfileStyle';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import colors from '../assets/colors';
import globalStyles from '../assets/globalStyles';
import { useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

/** 
 * @function calculateIntake - Calculate recommended daily intake for calories, protein, carb, and fat based on height, weight, age, gender, and activity level.
 * @param {number} height - Height of the person in inches.
 * @param {number} weight - Weight of the person in pounds.
 * @param {number} age - Age of the person in years.
 * @param {string} gender - Gender of the person ('male' or 'female').
 * @param {string} activityLevel - Activity level of the person ('sedentary', 'lightlyActive', 'moderatelyActive', 'veryActive', 'extraActive').
 * @returns {Object} An object containing recommended daily intake.
 *                  - {number} cal: Recommended daily calorie intake.
 *                  - {number} pro: Recommended daily protein intake.
 *                  - {number} car: Recommended daily carb intake.
 *                  - {number} fat: Recommended daily fat intake.
 */
export function calculateIntake(height, weight, age, gender, activityLevel) {
  // Inputs will be translated from imperial to metric for ease
  height = height * 2.54; // inch to cm
  weight = weight / 2.205; // lbs to kilograms
  
  // Constants for calculation
  const ACTIVITY_FACTORS = {
    sedentary: 1.2,
    lightlyActive: 1.375,
    moderatelyActive: 1.55,
    veryActive: 1.725,
    extraActive: 1.9
  };

  // Calculate BMR based on gender
  let bmr;
  if (gender === 'male') {
      bmr = 88.362 + (13.7 * weight) + (4.799 * height) - (5.677 * age);
  } else if (gender === 'female') {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.33 * age);
  } else {
      throw new Error("Invalid gender. Please specify \"male\" or \"female\".");
  }

  // Adjust BMR based on activity level
  let cal = bmr * ACTIVITY_FACTORS[activityLevel];

  // Set cal to be the dietary minimum if it's below it
  if (cal < 1200) {cal = 1200};

  // Get Age-based factors for carb, protein, and fat intake
  let proFac = 0.1;
  let carFac = 0.65;
  let fatFac = 0.1;

  if (age <= 3){
    // why is a baby using this app? 
    proFac = 0.05;
    fatFac = 0.35;
  }
  else if (age <= 18){
    // more reasonable
    proFac = 0.1;
    fatFac = 0.25;
  }
  else {
    // adult
    proFac = 0.1;
    fatFac = 0.35;
  }

  // Calculate protein intake
  let pro = (cal * proFac) / 4; // 4 calories per gram of Protein.
  if (pro < 30) {pro = 30}; // enforce minimum

  // Calculate Carb intake
  let car = (cal * carFac) / 4; // 4 calories per gram of Carb, 65% of cal intake across groups

  // Calculate fat intake
  let fat = (cal * fatFac) / 9; // 9 calories per gram of fat

  return {
    cal: Math.floor(cal),
    pro: Math.floor(pro),
    car: Math.floor(car),
    fat: Math.floor(fat)
  };
};

/**
 * @constructor
 * @description Modal for intake input form, takes in user input and displays calculated goals on submit.
 * @param {function} onSubmit - Function to handle form submission.
 * @param {boolean} modalVisible - Flag indicating if modal is visible.
 * @param {function} setModalVisible - Function to set modal visibility, using React Hooks.
 * @param {object} savedDietGoals - Saved diet goals.
 * @param {function} saveGoals - Function to save goals.
 * @returns {IntakeInputForm} Intake input form React Native component.
 */
function IntakeInputForm({ onSubmit, modalVisible, setModalVisible, savedDietGoals, saveGoals }) {
  const { t } = useTranslation();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [unsavedDietGoals, setUnsavedDietGoals] = useState({cal: 2000, pro: 10, car: 10, fat: 10});

  useEffect(() => {
    setUnsavedDietGoals(savedDietGoals);
  }, [savedDietGoals])

  /**
   * @function handleSubmit - Handles user click event on updating nutritional goals.
   */
  const handleSubmit = () => {
    // setModalVisible(false);
   
    // Check if all fields are filled
    if (height && weight && age && gender && activityLevel) {
      if ((height > 0) && (weight > 0) && (age > 0)) {
        onSubmit({
          height: parseFloat(height),
          weight: parseFloat(weight),
          age: parseInt(age),
          gender: gender,
          activityLevel: activityLevel
        });
      }
      else {
        Alert.alert(t('invalidInput'), t('invalidNumbers'));
      }
    } else {
      Alert.alert(t('invalidInput'), t('invalidFields'));
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View style={profileStyle.modalContainer}>
        <View style={profileStyle.modalContent}>
          <Pressable onPress={() => setModalVisible(false)}>
            <Icon name='close' size={30}  color={'black'}></Icon>
          </Pressable>
          <GoalsDisplay dietGoals={unsavedDietGoals}></GoalsDisplay>
          <Text style={globalStyles.normal_text}>{t('inputCalculation')} {t('estimatedValues')} {t('adjustment')}</Text>
          <Text style={globalStyles.normal_text}>{t('height')} ({t('inches')})</Text>
          <TextInput
            style={profileStyle.textInput}
            placeholder={t('height')}
            placeholderTextColor={'gray'}
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
          <Text style={globalStyles.normal_text}>{t('weight')} ({t('pounds')})</Text>
          <TextInput
            style={profileStyle.textInput}
            placeholder={t('weight')}
            placeholderTextColor={'gray'}
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
          <Text style={globalStyles.normal_text}>{t('age')}</Text>
          <TextInput
            style={profileStyle.textInput}
            placeholder={t('age')}
            placeholderTextColor={'gray'}
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
          <Picker
            style={profileStyle.pickerInput}
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
          >
            <Picker.Item label={t('selectGender')} value="" />
            <Picker.Item label={t('male')} value="male" />
            <Picker.Item label={t('female')} value="female" />
          </Picker>
          <Picker
            style={profileStyle.pickerInput}
            selectedValue={activityLevel}
            onValueChange={(itemValue) => setActivityLevel(itemValue)}
          >
            <Picker.Item label={t('activityLevel')} value="" />
            <Picker.Item label={t('sedentary')} value="sedentary" />
            <Picker.Item label={t('lightlyActive')} value="lightlyActive" />
            <Picker.Item label={t('moderatelyActive')} value="moderatelyActive" />
            <Picker.Item label={t('veryActive')} value="veryActive" />
            <Picker.Item label={t('extraActive')} value="extraActive" />
          </Picker>
          <Button title={t('calculate')} onPress={handleSubmit} color={colors.darkGreen} />
          <Button title={t('saveGoals')} onPress={saveGoals} color={colors.darkGreen} />
        </View>
      </View>
    </Modal>
  );
}

/**
 * @constructor
 * @description Modal for adjusting users' macronutrient goals.
 * @param {boolean} visible - Flag indicating if modal is visible.
 * @param {function} onClose - Function to close the modal.
 * @param {object} dietGoals - Diet goals.
 * @param {function} onSave - Function to save goals.
 * @param {function} setDietGoals - Function to set diet goals, using React Native Hooks.
 * @returns {AdjustmentModal} Adjustment modal React Native component.
 */
function AdjustmentModal({ visible, onClose, dietGoals, onSave, setDietGoals }) {
  const { t } = useTranslation();

  if (dietGoals === null) {
    dietGoals = {cal: 2000, pro: 10, car: 10, fat: 10};
  }

  const [cal, setCal] = useState(dietGoals.cal.toString());
  const [pro, setPro] = useState(dietGoals.pro.toString());
  const [car, setCar] = useState(dietGoals.car.toString());
  const [fat, setFat] = useState(dietGoals.fat.toString());

  /**
   * @function handleInputChange - Sets the new value.
   * @param {Function} setValue - A function that takes input text and sets the new value.
   */
  const handleInputChange = (setValue) => (text) => {
    // Regex to allow only numeric input
    if (/^\d*\.?\d*$/.test(text)) {
      setValue(text);
    }
  };

  /**
   * @function handleSave - Handles saving the new goal.
   */
  const handleSave = () => {
    // check if diet goals are healthy/realistic
    if (! ((cal < 1200) || (car < 130) || (fat < 20) || (pro < 30))){
      onSave({
        cal: parseInt(cal),
        pro: parseInt(pro),
        car: parseInt(car),
        fat: parseInt(fat),
      });
    }
    else {
      Alert.alert("Diet goals insufficient", "Enter at least 1200kCal calories, 130g carbs, 20g Fat, and 30g Protein.");
    }
  };

  /**
   * @function handleClose - Handles closing the modal
   */
  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    // Update state when dietGoals prop changes
    setCal(dietGoals.cal.toString());
    setPro(dietGoals.pro.toString());
    setCar(dietGoals.car.toString());
    setFat(dietGoals.fat.toString());
  }, [dietGoals]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={profileStyle.modalContainer}>
        <View style={profileStyle.modalContent}>
          <Text style={profileStyle.modalHeaderText}>{t('adjustingGoals')}</Text>
          <Text style={globalStyles.normal_text_bold}>{t('caloriesGoal')}:</Text>
          <TextInput
            style={profileStyle.textInput}
            keyboardType="numeric"
            value={cal}
            onChangeText={handleInputChange(setCal)}
          />
          <Text style={globalStyles.normal_text_bold}>{t('proteinGoal')}:</Text>
          <TextInput
            style={profileStyle.textInput}
            keyboardType="numeric"
            value={pro}
            onChangeText={handleInputChange(setPro)}
          />
          <Text style={globalStyles.normal_text_bold}>{t('carbGoal')}:</Text>
          <TextInput
            style={profileStyle.textInput}
            keyboardType="numeric"
            value={car}
            onChangeText={handleInputChange(setCar)}
          />
          <Text style={globalStyles.normal_text_bold}>{t('fatGoal')}:</Text>
          <TextInput
            style={profileStyle.textInput}
            keyboardType="numeric"
            value={fat}
            onChangeText={handleInputChange(setFat)}
          />
          <Button title={t('save')} onPress={handleSave} color={colors.darkGreen} />
          <Button title={t('close')} onPress={handleClose} color={colors.red} />
        </View>
      </View>
    </Modal>
  );
}

/**
 * @constructor
 * @description Component for displaying diet goals.
 * @param {object} dietGoals - The dietGoals information to be displayed.
 * @returns {GoalsDisplay} A React Native component containing a display for the user's diet goals.
 */
function GoalsDisplay({ dietGoals }){
  const { t } = useTranslation();

  if (dietGoals === null) {
    dietGoals = {cal: 2000, pro: 10, car: 10, fat: 10};
  }

  return(
    <>
      <View style={profileStyle.goalsDisplayContainer}>
        <Text style={globalStyles.normal_text_bold}>{t('myDietGoal')}</Text>
        <Text style={globalStyles.normal_text}>{t('calorieGoal')}: {dietGoals.cal} kCal</Text>
        <Text style={globalStyles.normal_text}>{t('proteinGoal')}: {dietGoals.pro} g</Text>
        <Text style={globalStyles.normal_text}>{t('carbGoal')}: {dietGoals.car} g</Text>
        <Text style={globalStyles.normal_text}>{t('fatGoal')}: {dietGoals.fat} g</Text>
      </View>
    </>
  );
}

/**
 * @function GetTitle - Determines the rank title of the user based on their experience level.
 * @param {int} level - The experience level of the user.
 * @returns The title based on their rank.
 */
function GetTitle(level) {
  const { t } = useTranslation();

  let rank = 1;

  if (level < 6) rank = 1;
  else if (level < 11) rank = 6;
  else if (level < 16) rank = 11;
  else if (level < 21) rank = 16;
  else if (level < 26) rank = 21;
  else if (level < 31) rank = 26;
  else if (level < 36) rank = 31;
  else if (level < 41) rank = 36;
  else if (level < 46) rank = 41;
  else if (level < 51) rank = 46;
  else if (level < 56) rank = 51;
  else if (level < 61) rank = 56;
  else if (level < 66) rank = 61;
  else if (level < 71) rank = 66;
  else if (level < 76) rank = 71;
  else if (level < 81) rank = 76;
  else if (level < 86) rank = 81;
  else if (level < 91) rank = 86;
  else if (level < 96) rank = 91;
  else if (level < 101) rank = 96;
  else rank = 101;

  const titles = {
    1: t('rank1'),
    6: t('rank2'),
    11: t('rank3'),
    16: t('rank4'),
    21: t('rank5'),
    26: t('rank6'),
    31: t('rank7'),
    36: t('rank8'),
    41: t('rank9'),
    46: t('rank10'),
    51: t('rank11'),
    56: t('rank12'),
    61: t('rank13'),
    66: t('rank14'),
    71: t('rank15'),
    76: t('rank16'),
    81: t('rank17'),
    86: t('rank18'),
    91: t('rank19'),
    96: t('rank20'),
    101: t('rankUltra')
  };

  return titles[rank];
}

/**
 * @constructor
 * @description Component for profile page.
 * @param {object} route - Navigation route for passing data between pages.
 * @param {object} navigation - Navigation object for navigation buttons between pages.
 * @returns {ProfilePage} Returns the Profile page React component.
 */
export default function ProfilePage({ route, navigation }) {
  const { t } = useTranslation();
  const [profileName, setProfileName] = useState('');
  const [dietGoals, setDietGoals] = useState({cal: 2000, pro: 10, car: 10, fat: 10})
  const [modalVisible, setModalVisible] = useState(false);
  const [adjustModalVisible, setAdjustModalVisible] = useState(false);
  const [submitOnDietGoalsChange, setSubmitOnDietGoalsChange] = useState(false);
  const [level, setLevel] = useState(1);

  const middot = '\u00B7';

  const currentUser = auth().currentUser;
  const userNameRef = database().ref(`Users/${currentUser.uid}`);

  useEffect(() => {
    // Display User Profile data once

    // Profile Image and Name
    userNameRef.once('value').then(snapshot => {
      let name = snapshot.val().username;
  
      // Ensure name capitalization is properly set
      let parts = name.split(' ');
      for (let i = 0; i < parts.length; i++) {
        parts[i] = parts[i][0].toUpperCase() + parts[i].substring(1);
      }
      name = parts.join(' ');
  
      // Set data
      setProfileName(name);

      let lvl = snapshot.val().level;
      setLevel(lvl);
    }).catch(error => {
      console.error('Error fetching user data:', error);
      setProfileName('Default');
      setLevel(1);
    });

    // User-set diet goal preferences
    const prefsRef = database().ref(`Users/${currentUser.uid}/preferences`);
  
    prefsRef.once('value').then(snapshot => {
      let curDietGoals = {cal: 2000, pro: 10, car: 10, fat: 10};
      curDietGoals.cal = snapshot.val().cal;
      curDietGoals.pro = snapshot.val().pro;
      curDietGoals.car = snapshot.val().car;
      curDietGoals.fat = snapshot.val().fat;
      setDietGoals(curDietGoals);
    }).catch(error => {
      console.error('Error fetching diet goal preferences.', error);
      setDietGoals({cal: 2000, pro: 10, car: 10, fat: 10});
    });
  }, []);

  const userRankTitle = GetTitle(level);

  useEffect(() => {
    if (submitOnDietGoalsChange) {
      handleGoalsSubmit();
      setSubmitOnDietGoalsChange(false); // Reset the flag
    }
  }, [dietGoals]);

  /**
   * @function formSubmit - Sets diet goals upon form submission.
   * @param {Object} formData - An object containing form data, including height, weight, age, gender, and activity level.
   */
  function formSubmit({ height, weight, age, gender, activityLevel }) {
    setDietGoals(calculateIntake(height, weight, age, gender, activityLevel));
  }

  /**
   * @function handleAdjustmentSave - Handles saving the goal adjustments.
   * @param {Object} updatedDietGoals - The updated diet goals to be saved.
   */
  const handleAdjustmentSave = (updatedDietGoals) => {
    setSubmitOnDietGoalsChange(true);
    setDietGoals(updatedDietGoals);
    setAdjustModalVisible(false);
  };

  /**
   * @function handleGoalsSubmit - Handles form submission for goal adjustments.
   */
  const handleGoalsSubmit = () => {
    const prefsRef = database().ref(`Users/${currentUser.uid}/preferences`);

    // Writing preferences
    prefsRef.update({
      cal: dietGoals.cal, 
      pro: dietGoals.pro,  
      car: dietGoals.car,   
      fat: dietGoals.fat    
    })
    .then(() => {
      console.log('Preferences updated successfully!');
      console.log(dietGoals.cal, " ", dietGoals.pro, " ", dietGoals.car, " ", dietGoals.fat);
      Alert.alert(t('saved'), t('dietSave'));
    })
    .catch(error => {
      console.error('Error updating preferences:', error);
    });
  }

  return (
    <>
      <View style={profileStyle.body}>
        <View style={profileStyle.profileImage}>
          <Image
            style={profileStyle.buddy}
            source={require('../assets/defaultprofile.png')}
          />
        </View>
        <View style={profileStyle.headingTextAlign}>
          <Text style={profileStyle.profileHeadingText}>{`${profileName}`}</Text>
          <Text style={profileStyle.profileSubText}>{`Lvl${level} ${middot} ${userRankTitle}`}</Text>
        </View>
        <ScrollView style={profileStyle.screenContainer}>
          <IntakeInputForm onSubmit={formSubmit} modalVisible={modalVisible} setModalVisible={setModalVisible} savedDietGoals={dietGoals} saveGoals={() => handleGoalsSubmit()}></IntakeInputForm>
          <AdjustmentModal visible={adjustModalVisible} onClose={() => setAdjustModalVisible(false)} dietGoals={dietGoals} onSave={handleAdjustmentSave} setDietGoals={setDietGoals}></AdjustmentModal>
          <View style={profileStyle.goalsEditorContainer}>
            <Text style={globalStyles.normal_text_bold}>{t('editor')}</Text>
            <GoalsDisplay dietGoals={dietGoals}></GoalsDisplay>
            <Pressable style={[profileStyle.profileButton, {backgroundColor: colors.darkGreen}]} onPress={() => setModalVisible(true)}>
              <Text style={globalStyles.normal_text_light}>{t('calculateGoals')}</Text>
            </Pressable>
            <Pressable style={[profileStyle.profileButton, {backgroundColor: colors.red}]} onPress={() => setAdjustModalVisible(true)}>
              <Text style={globalStyles.normal_text_light}>{t('adjustGoals')}</Text>
            </Pressable>
          </View>
      </ScrollView>
      </View>
    </>
  );
};
