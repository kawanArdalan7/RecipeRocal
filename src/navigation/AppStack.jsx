import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../assets/colors.js';
// import { useTranslation } from "react-i18next";
// import "../translation";

import HomePage from '../pages/HomeScreen.jsx';
import ProfilePage from '../pages/ProfileScreen.jsx';
import GetPointsPage from '../pages/GetPointsScreen.jsx';
import Logging from '../pages/Logging.jsx';
import HomePageNav from '../components/homePageNav.jsx';
import RecipeSearchPage from '../pages/recipesearch.jsx';
import SettingsPage from '../pages/SettingsScreen.jsx';
import SavedRecipesScreen from '../pages/SavedRecipesScreen.jsx';
import LanguageButton from '../components/LanguageButton.jsx';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * @component
 * @description Bottom tab navigator.
 * @returns {Tab.Navigator} Returns interactive bar for navigation to the bottom of the application.
 */
const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home';
        } 
        else if (route.name === 'Recipesearch') {
          iconName = 'magnify';
        } 
        else if (route.name === 'Settings') {
          iconName = 'cog';
        } 
        else if (route.name === 'Getpoints') {
          iconName = 'clipboard-list';
        }
        else if (route.name === 'SavedRecipes') {
          iconName = 'heart';
        }
        return <Icon name={iconName} size={size} color={color} />;
      }, 
      tabBarActiveTintColor: colors.white,
      tabBarInactiveTintColor: colors.darkGreen,
      tabBarStyle: { backgroundColor: colors.lightGreen, borderColor: colors.darkGreen, borderTopWidth: 1, height: 60 },
    })}
  >
    <Tab.Screen name="Home" component={HomePage} options={{headerShown: false, tabBarLabel: 'Home'}} />
    <Tab.Screen name="Getpoints" component={GetPointsPage} options={{headerShown: false, tabBarLabel: 'Enter Macros'}} />
    <Tab.Screen name="Recipesearch" component={RecipeSearchPage} options={{headerShown: false, tabBarLabel: 'Recipe Search'}} />
    <Tab.Screen name="SavedRecipes" component={SavedRecipesScreen} options={{headerShown: false, tabBarLabel: 'Saved Recipes'}} />
    <Tab.Screen name="Settings" component={SettingsPage} options={{headerShown: false, tabBarLabel: 'Settings'}} />
  </Tab.Navigator>
);

/**
 * @component
 * @description Forms navigation component.
 * @returns {Stack.Navigator} Returns navigating object.
 */
const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.darkGreen,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Main"
        component={BottomTabNavigator}
        options={{ headerTitle: (props) => <HomePageNav {...props} /> }}
      />
      <Stack.Screen name="Profile" component={ProfilePage} options={{headerTitle: 'User Profile'}}/>
      <Stack.Screen name="Getpoints" component={GetPointsPage} />
      <Stack.Screen name="Logging" component={Logging} />
      <Stack.Screen name="Recipesearch" component={RecipeSearchPage} options={{headerTitle: 'Recipe Search'}}/>
      <Stack.Screen name="Settings" component={SettingsPage} />
      <Stack.Screen name="SavedRecipes" component={SavedRecipesScreen} />
      <Stack.Screen name="Language" component={LanguageButton} />
    </Stack.Navigator>
  );
};

export default AppStack;
