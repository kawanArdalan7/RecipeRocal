import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInPage from '../pages/signin.jsx';
import SignUpPage from '../pages/signup.jsx';
// import { useTranslation } from "react-i18next";
// import "../translation";

const Stack = createNativeStackNavigator();

/**
 * @component
 * @description Handles user authentication through login/sign-up navigation.
 * @returns {Stack.Navigator} Returns navigation components for the login/sign-up page.
 */
const AuthStack = () => {
  return(
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#3D8965',
      },
      headerTintColor: '#FFF',
      headerTitleStyle: {
        fontWeight: 'bold', 
      },
    }}>
      <Stack.Screen name="Signin" component={SignInPage} options={{headerTitle: 'Sign In'}} />
      <Stack.Screen name="Signup" component={SignUpPage} />
    </Stack.Navigator>
  );
};

export default AuthStack;
