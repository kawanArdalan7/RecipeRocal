import { Button, Text, View, TextInput, Image, KeyboardAvoidingView } from 'react-native';
import React, { useState, useContext } from 'react';
import { AuthContext } from '../providers/authentication';
import signInStyle from '../styles/SignInStyle';
import colors from '../assets/colors'
import AnimatedBackground from '../components/AnimatedBackground';
import { useTranslation } from "react-i18next";
import "../translation";

/**
 * @constructor
 * @description Component that allows the user to sign back into their account using their credentials.
 * @param {object} navigation - Contains methods for navigating between screens.
 * @returns {SignInPage} Returns the SignIn Page React component.
 */
export default function SignInPage({ navigation }) {
  const { t } = useTranslation();
  const {login} = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  /** 
   * @function onLoginPress - Runs when the login button is pressed and sends email and password information to the login function.
   */
  async function onLoginPress() {
    let errors = {};
    
    try {
      if (!email) errors.email = t('invalidEmail');
      if (!password) errors.password = t('invalidPassword');
      setErrors(errors);

      if (Object.keys(errors).length > 0) {
        throw errors;
      }
      
      await login(email, password);
      console.log("Submitted email:", email, ", password:", password);

      setEmail("");
      setPassword("");
      setErrors({});
    } catch (error) {
      errors.custom = "Authentication failed";
      console.log(errors.custom);
      setErrors({...error, custom: t('failedAuth')});
    }
  };

  return(
    <KeyboardAvoidingView 
      behavior="padding" 
      keyboardVerticalOffset={100} 
      style={[signInStyle.screenContainer]}
    >
      <AnimatedBackground></AnimatedBackground>
      <View style={[signInStyle.form]}>
        <Image source={require("../assets/FoodDemo.jpg")} style={[signInStyle.image]} />
        <Text style={[signInStyle.label]}> {t('email')}</Text>
        <TextInput 
          style={[signInStyle.input]} 
          placeholder={t('enterEmail')}
          placeholderTextColor={'black'}
          value={email}
          onChangeText={setEmail}
          required
        />

        { errors.email ? <Text style={[signInStyle.errorText]}> {errors.email} </Text> : null }

        <Text style={[signInStyle.label]}> {t('password')}</Text>
        <TextInput 
          style={[signInStyle.input]} 
          placeholder={t('enterPassword')}
          placeholderTextColor={'black'}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          required
        />

        { errors.password ? <Text style={[signInStyle.errorText]}>{errors.password}</Text> : null }
        { errors.custom ? <Text style={[signInStyle.errorText]}>{errors.custom}</Text> : null }

        <Button
          title={t('login')}
          color={colors.darkGreen}
          onPress={onLoginPress}
        /> 

        <Button
          title={t('signup')}
          color={colors.darkGreen}
          onPress={() => navigation.navigate('Signup')}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
