import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import { signUpStyle } from "../styles/SignUpStyle";
import React, { useContext, useState } from 'react'; 
import { AuthContext } from '../providers/authentication';
import signInStyle from '../styles/SignInStyle';
import { useTranslation } from "react-i18next";
import "../translation";

/**
 * @constructor
 * @description Component that allows the user to create an account using their email, password, and username.
 * @param {object} navigation - Contains methods for navigating between screens.
 * @returns {SignUpPage} Returns jsx component where the user will navigate to sign up for the app.
 */
export default function SignUpPage({ navigation }) {
  const {register} = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();

  /**
   * @function onRegisterPress - Registers an account using the provided email, username, and password. Triggered when the "Sign Up" button is pressed.
   */
  async function onRegisterPress() {
    let errors = {};

    try {
      if (!email) errors.email = t('invalidEmail');
      if (!username) errors.username = t('invalidUsername');
      if (!password) errors.password = t('invalidPassword');

      setErrors(errors);

      if (Object.keys(errors).length > 0) {
        throw errors;
      }

      await register(email, password, username);

      setEmail("");
      setPassword("");
      setErrors({});
    } catch (error) {
      if (Object.keys(errors).length === 0) {
        setErrors({...error, authentication: error.message});
      }
    }
  }

  return(
    <View style={signUpStyle.container}>
      <Image style={signUpStyle.image} source={require("../assets/buddy_2.png")} /> 
      <Text style={signUpStyle.pointHeaderText}>{t('signup')}</Text>
      <View style={signUpStyle.inputView}>
        <TextInput
          style={signUpStyle.TextInput}
          placeholder={t('email')}
          placeholderTextColor="#000000"
          onChangeText={(email) => setEmail(email)}
        /> 
      </View> 

      <Text style={[signInStyle.errorText]}> {errors.email} </Text>

      <View style={signUpStyle.inputView}>
        <TextInput
          style={signUpStyle.TextInput}
          placeholder={t('username')}
          placeholderTextColor="#000000"
          onChangeText={(username) => setUsername(username)}
        /> 
      </View> 

      <Text style={[signInStyle.errorText]}> {errors.username} </Text>

      <View style={signUpStyle.inputView}>
        <TextInput
          style={signUpStyle.TextInput}
          placeholder={t('password')}
          placeholderTextColor="#000000"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        /> 
      </View>

      <Text style={[signInStyle.errorText]}>{errors.password}</Text>
      <Text style={[signInStyle.errorText]}>{errors.authentication}</Text>

      <TouchableOpacity style={signUpStyle.loginBtn} onPress={onRegisterPress}>
        <Text style={signUpStyle.loginText}>{t('createAccount')}</Text> 
      </TouchableOpacity> 

      <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
        <Text style={{ color: 'blue', marginTop: 10 }}>{t('haveAnAccount')}</Text>
      </TouchableOpacity>
    </View> 
  );
};
