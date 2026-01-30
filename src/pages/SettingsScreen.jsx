import { View } from 'react-native';
import React, { useEffect, useState} from 'react';
import { Pressable, Text } from 'react-native';
import ButtonTemplate from '../components/ButtonTemplate';
import { settingStyle } from '../styles/SettingStyle';
import colors from "../assets/colors";
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { useContext } from 'react';
import { AuthContext } from '../providers/authentication';
import { useTranslation } from "react-i18next";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import "../translation";

/**
 * @constructor
 * @description Handles various user settings.
 * @param {object} navigation - Contains methods for navigating between screens.
 * @returns {Settings} Returns the user settings options as a React component.
 */
const SettingsPage = ({ navigation }) => {
  const { t } = useTranslation();
  const currentUser = auth().currentUser;
  const userSetRef = database().ref(`Users/${currentUser.uid}/personalization`);
  const {logout} = useContext(AuthContext);

  const [contrast, setContrast] = useState(true);

  useEffect(() => {
    userSetRef.once('value').then(snapshot => {
      let light = snapshot.val().contrast;
      setContrast(light);
    }).catch(error => {
      console.error('Error fetching user data:', error);
      setContrast(true);
    });
  }, []);

  return(
    <>
      <View style={[settingStyle.settingsContainer, { backgroundColor: contrast ? colors.offWhite : colors.black }]}>
        <View style={[settingStyle.buttonsContainer, { backgroundColor: contrast ? colors.offWhite : colors.black }]}>
          <ButtonTemplate
            pos='top'
            nav={navigation}
            route='Profile'
            name={t('profile')}
          />
          <ButtonTemplate
            pos='middle'
            nav={navigation}
            route='Language'
            name={t('language')}
          />
          <Pressable onPress={logout} style={[settingStyle.pressBottomButton, { backgroundColor: colors.red }]}>
            <Text style={settingStyle.buttonText}>{t('logout')}</Text>
            <Icon name={'logout'} size={30} color={'black'} />
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default SettingsPage;
