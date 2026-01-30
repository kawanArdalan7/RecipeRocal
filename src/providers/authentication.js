import React, { createContext, useState } from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return(
    <AuthContext.Provider
      value={{
        user,
        setUser,

        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);
          } catch (e) {
            console.log("Could not login user. ", e);
            throw e;
          }
        },

        register: async (email, password, username) => {
          try {
            let today = new Date();
            let yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            let todayKey = today.toISOString().slice(0,10);
            let yesterdayKey = yesterday.toISOString().slice(0,10);
            
            let token = await messaging().getToken();

            await auth().createUserWithEmailAndPassword(email, password)
            .then((response) => {
              const uid = response.user.uid;
              const data = {
                id: uid,
                email,
                username, 
                experience: 0, 
                history: { 
                  [yesterdayKey]: {
                    cal: 0,
                    car: 0,
                    fat: 0,
                    pro: 0,
                  },
                  [todayKey]: {
                    cal: 0,
                    car: 0,
                    fat: 0,
                    pro: 0,
                  }
                },
                token: token,
                personalization: {
                  contrast: false,
                  language: "en"
                },
                preferences: {
                  cal: 2000,
                  car: 100,
                  fat: 50,
                  pro: 50,
                },
                saved: { },
                streak: 0,
              };

              database()
                .ref(`/Users/${uid}`) 
                .set(data) 
                .then(() => {
                  console.log("User registered with Realtime Database: ", uid);
                });
            })
            .catch(error => {
              console.log('Couldn\'t add user to Database: ', error);
              throw error;  
            })
          }
          catch (e) {
            console.log("Could not register user. ", e);
            throw e;
          }
        },

        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.log("Could not log out user.", e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;