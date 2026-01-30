import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { settingStyle } from "../styles/SettingStyle";
import colors from "../assets/colors";
import i18n from "../translation";
import { useTranslation } from "react-i18next";
import "../translation";
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

/**
 * @component
 * @description Constructs buttons for the language options; handles language translations.
 * @param {object} navigation - Contains methods for navigating between screens.
 * @returns {LanguageButton} Returns a language selection screen as a React component.
 */
const LanguageButton = ({ navigation }) => {
  const { t } = useTranslation();
  const currentUser = auth().currentUser;
  const userSetRef = database().ref(`Users/${currentUser.uid}/personalization`);
  const [contrast, setContrast] = useState(true);

  const languageStates = {
    en: useState(true),
    fra: useState(false),
    ger: useState(false),
    hin: useState(false),
    ind: useState(false),
    ita: useState(false),
    jap: useState(false),
    por: useState(false),
    rus: useState(false),
    es: useState(false),
  };

  useEffect(() => {
    userSetRef.once('value').then(snapshot => {
      let lang = snapshot.val().language;

      Object.keys(languageStates).forEach(key => {
        if (key === lang) {
          languageStates[key][1](true); // Set the state to true for the selected language
        } else {
          languageStates[key][1](false); // Set the state to false for other languages
        }
      });

      let light = snapshot.val().contrast;
      setContrast(light);
    }).catch(error => {
      console.error('Error fetching user data:', error);
      setContrast(true);
    });
  }, []);

  /**
   * @function toggleLanguage - Toggles the application language from one language to another.
   * @param {string} lang - The flag indicating the new language.
   */
  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
    userSetRef.update({language: lang}).then(() => console.log('Language updated successfully!'));

    Object.keys(languageStates).forEach(key => {
      if (key === lang) {
        languageStates[key][1](true); // Set the state to true for the selected language
      } else {
        languageStates[key][1](false); // Set the state to false for other languages
      }
    });
  };

  return(
    <>
      <View style={[settingStyle.settingsContainer, { backgroundColor: contrast ? colors.offWhite : colors.black }]}>
        <View style={[settingStyle.buttonsContainer, { backgroundColor: contrast ? colors.offWhite : colors.black }]}>
          {Object.keys(languageStates).map(key => (
            <Pressable
              key={key}
              style={[
                key === 'en' ? settingStyle.pressTopButton : key === 'es' ? settingStyle.pressBottomButton : settingStyle.pressButton,
                { backgroundColor: languageStates[key][0] ? colors.darkGreen : colors.yellow }
              ]}
              onPress={() => toggleLanguage(key)}
            >
              <Text style={[settingStyle.buttonText, { color: languageStates[key][0] ? colors.white : colors.black }]}>
                {t(key)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </>
  );
};

export default LanguageButton;
