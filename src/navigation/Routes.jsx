import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../providers/authentication';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

/**
 * @component
 * @description Handles app navigation based on user authentication status.
 * @returns {NavigationContainer} Returns a component wrapping either the App or Auth Stack based on user authentication status.
 */
const Routes = () => {
  const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  /**
   * @function onAuthStateChanged - Handles changes in user authentication status.
   * @param {Object} user - The user object representing the authenticated user.
   */
  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; 
  }, []);

  if (initializing) return null;

  return(
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;
