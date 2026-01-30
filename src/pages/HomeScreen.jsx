import { Text, View, Image } from 'react-native';
import * as Progress from 'react-native-progress';
import { homeStyle } from '../styles/HomeStyle';
import colors from '../assets/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import globalStyles from '../assets/globalStyles';
import { useTranslation } from "react-i18next";
import "../translation";
import { macroPointCalculator_preview } from '../components/PointCalculator';

const defaultLevelInfo = {
  level: 1,
  experience: 30,
  nextLevel: 50,
};

/**
 * @constructor
 * @description Constructs the LevelBar component which displays the user level, name, and streak.
 * @param {object} levelInfo - contains all information pertaining to the level of the user.
 * @param {object} streak - contains the streak number.
 * @returns {LevelBar} Returns the Level Bar as a React component.
 */
function LevelBar({ levelInfo, streak }) {
  const { t } = useTranslation();
  const [profileName, setProfileName] = useState('');
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
      // setEmail(snapshot.val().email);
    }).catch(error => {
      console.log('Error fetching user data:', error);
      setProfileName('Default');
    });
  }, []);

  return (
    <View style={homeStyle.levelBarContainer}>
      <View style={{width: '100%', backgroundColor: colors.darkGreen, flexDirection: 'row', justifyContent: 'space-between', height: 40, paddingLeft: 10}}>
        <View style={homeStyle.userLevelContainer}>
          <Text style={homeStyle.streakText}>{profileName}</Text>
        </View>
        <View style={homeStyle.userLevelContainer}>
          <Text style={homeStyle.streakText}>{t('level')} {levelInfo.level}</Text>
        </View>
        <View style={homeStyle.userStreakContainer}>
          <Icon name={"fire"} size={24} color={"white"}/>
          <Text style={homeStyle.streakText}>{streak}</Text>
        </View>
      </View>
      <View style={homeStyle.levelBarProgressBarContainer}>
        <Progress.Bar unfilledColor={colors.lightGreen} color={colors.darkGreen} progress={levelInfo.experience / levelInfo.nextLevel} width={350} height={20} borderRadius={20}/>
        <Text style={[homeStyle.blackText, {alignSelf: 'flex-end'}]}>exp: {levelInfo.experience} / {levelInfo.nextLevel}</Text>
      </View>
    </View>
  );
}

/**
 * @constructor
 * @description Constructs the home screen.
 * @param {object} navigation - Contains methods for navigating between screens.
 * @param {object} route - Contains methods for routing information between screens.
 * @returns {Home} Returns the home screen react native component.
 */
export default function Home({ route, navigation }) {
  const { t } = useTranslation();
  const [levelInfo, setLevelInfo] = useState(defaultLevelInfo);
  const [currentCal, setCurrentCal] = useState(0);
  const [currentPro, setCurrentPro] = useState(0);
  const [currentCar, setCurrentCar] = useState(0);
  const [currentFat, setCurrentFat] = useState(0);
  const [prefCal, setprefCal] = useState(3000);
  const [prefPro, setprefPro] = useState(10);
  const [prefCar, setprefCar] = useState(10);
  const [prefFat, setprefFat] = useState(10);
  const [progCal, setprogCal] = useState(0);
  const [progPro, setprogPro] = useState(0);
  const [progCar, setprogCar] = useState(0);
  const [progFat, setprogFat] = useState(0);
  const [estimatedExp, setEstimatedExp] = useState(0);

  // need to populate the user preferences if they are blank
  // useFocusEffect runs when the page is navigated to.
  useFocusEffect(() => {
    // User-set diet goal preferences
    const currentUser = auth().currentUser;
    const userNameRef = database().ref(`Users/${currentUser.uid}`);

    // Fetching user preferences
    const prefsRef = database().ref(`Users/${currentUser.uid}/preferences`);
    prefsRef.once('value').then(snapshot => {
      let cal = snapshot.val().cal;
      let pro = snapshot.val().pro;
      let car = snapshot.val().car;
      let fat = snapshot.val().fat;

      setprefCal(cal);
      setprefFat(fat);
      setprefPro(pro);
      setprefCar(car);

    }).catch(error => {
      let defaultDietGoals = {cal: 2000, pro: 50, car: 120, fat: 50};
      prefsRef.set({
        cal: defaultDietGoals.cal,
        pro: defaultDietGoals.pro,
        fat: defaultDietGoals.fat,
        car: defaultDietGoals.car,
      });

      setprefCal(defaultDietGoals.cal);
      setprefFat(defaultDietGoals.fat);
      setprefPro(defaultDietGoals.pro);
      setprefCar(defaultDietGoals.car);
    });

    // Get a reference for how much calories, carbs, proteins and fats have been eaten today
    const currDate = new Date();
    // format date() output to YYYY-MM-DD
    let formattedDate = `${currDate.getFullYear()}-${String(currDate.getMonth() + 1).padStart(2, '0')}-${String(currDate.getDate()).padStart(2, '0')}`;
    
    const userDailyRef = database().ref(`Users/${currentUser.uid}/history/${formattedDate}`);
    userDailyRef.once('value').then(snapshot => {
      let cal = snapshot.val().cal;
      let pro = snapshot.val().pro;
      let car = snapshot.val().car;
      let fat = snapshot.val().fat;

      setCurrentCal(cal);
      setCurrentCar(car);
      setCurrentFat(fat);
      setCurrentPro(pro);

    }).catch(error => {
      setCurrentCal(0);
      setCurrentCar(0);
      setCurrentFat(0);
      setCurrentPro(0);
      console.log("error reading current values: " , error);
    });

    // Make sure progress renders correctly!
    setprogCal(isNaN(currentCal / prefCal) ? 0 : currentCal / prefCal);
    setprogCar(isNaN(currentCar / prefCar) ? 0 : currentCar / prefCar);
    setprogPro(isNaN(currentPro / prefPro) ? 0 : currentPro / prefPro);
    setprogFat(isNaN(currentFat / prefFat) ? 0 : currentFat / prefFat);

    // console.log("Rerender done.");

    /**
     * @function getEstimatedExp - Check current exp earning estimate
     */
    async function getEstimatedExp() {
      let preview_G = {cal: prefCal, car: prefCar, pro: prefPro, fat: prefFat};
      let preview_D = {cal: currentCal, car: currentCar, pro: currentPro, fat: currentFat};
      let exp = macroPointCalculator_preview(preview_D, preview_G);
      setEstimatedExp(exp);
    }

    getEstimatedExp();
  });

  useEffect(()=> {
    const currentUser = auth().currentUser;
    const userNameRef = database().ref(`Users/${currentUser.uid}`);
    
    // We need to get our user's level and experience information.
    userNameRef.once('value').then(snapshot => {
      let exp = snapshot.val().experience;
      
      // This is a fix for the lack of levels being shown.
      // Each level is 50 exp, at the start
      // A leveling scheme will be as follows:
      /*
        The first level will require 50 exp to progress. 
        From this point on, there will be a 10% increase to the required number of exp points
        to level up.
      */

      // Let's do some calculations
      const startingExpReq = 50;
      const rate = 0.1;
      let level = 1;
      let expForNextLevel = startingExpReq;

      while (exp >= expForNextLevel) {
        exp -= expForNextLevel;
        level++;
        expForNextLevel = expForNextLevel * (1 + rate);
      }
      setLevelInfo({level: level, experience: Math.floor(exp), nextLevel: Math.ceil(expForNextLevel)});

      userNameRef.update({level: level});

    }).catch(error => {
      // There might be no exp assigned to this user, so their exp is zero.
      userNameRef.update(
        {
          experience: 0,
          level: 1
        }
      )
    });
  }, []);

  const [streak, setStreak] = useState(0);
  const currentUser = auth().currentUser;
  const userRef = database().ref(`Users/${currentUser.uid}`);

  useEffect(() => {
    const streakRef = userRef.child('streak');
    streakRef.on('value', (snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        setStreak(value); 
      }
    });

    return () => streakRef.off('value');
  }, [currentUser]);

  return (
    <View style={homeStyle.homeContainer}>
      <View style={homeStyle.header}>
        <View style={homeStyle.headerTop}>
          <LevelBar levelInfo={levelInfo} streak={streak}></LevelBar>
        </View>
        <View style={homeStyle.buddyTooltipContainer}>
          <View style={homeStyle.statsBars}>
            <Text style={[globalStyles.normal_text_bold, {fontSize: 20}]}>{t('goalHeader')}</Text>
            <Text style={globalStyles.normal_text_bold}>{t('currentExp')}: {estimatedExp} exp</Text>
            <Text style={globalStyles.normal_text}>{t('calories')} {Math.round(currentCal)}/{prefCal}kCal</Text>
            <Progress.Bar progress={progCal} color={colors.darkGreen} borderColor={colors.darkGreen} unfilledColor={colors.lightGreen} strokeCap='round' width={300}></Progress.Bar>
            <Text style={globalStyles.normal_text}>{t('proteins')} {Math.round(currentPro)}/{prefPro}g</Text>
            <Progress.Bar progress={progPro} color={colors.red} borderColor={colors.darkGreen} unfilledColor={colors.lightGreen} strokeCap='round' width={300}></Progress.Bar>
            <Text style={globalStyles.normal_text}>{t('carbs')} {Math.round(currentCar)}/{prefCar}g</Text>
            <Progress.Bar progress={progCar} color={colors.yellow} borderColor={colors.darkGreen} unfilledColor={colors.lightGreen} strokeCap='round' width={300}></Progress.Bar>
            <Text style={globalStyles.normal_text}>{t('fats')} {Math.round(currentFat)}/{prefFat}g</Text>
            <Progress.Bar progress={progFat} color={colors.red} borderColor={colors.darkGreen} unfilledColor={colors.lightGreen} strokeCap='round' width={300}></Progress.Bar>
          </View>
          <View style={{height: '70%', alignItems: 'center', justifyContent: 'center', paddingTop: '12%'}}>
            <View style={{backgroundColor: colors.offWhite, padding: 10, borderRadius: 10, width: '90%'}}>
              <Text style={{color: colors.black, fontSize: 13, width: '90%'}}>
                <Text style={globalStyles.normal_text_bold}>{t('welcome')}{"\n\n"}</Text>
                <Text>{t('navbarTutorial')}{"\n\n"}</Text>
                <Text>{t('goalsTutorial')}{"\n\n"}</Text>
                <Text>{t('pointsTutorial')}{"\n\n"}</Text>
                <Text>{t('expTutorial')}</Text>
              </Text>
            </View>
            <View style={homeStyle.buddyContainer}>
              <Image
                style={homeStyle.buddy}
                source={require('../assets/buddy_2.png')}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
