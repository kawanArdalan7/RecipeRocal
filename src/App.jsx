import React from 'react';
import Routes from './navigation/Routes';
import AuthProvider from './providers/authentication';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

async function saveUserToken() {
  const currentUser = auth().currentUser;
  const userNameRef = database().ref(`Users/${currentUser.uid}`);

  const token = await messaging().getToken();

  userNameRef.update({
    token: token
  }).then(() => {
    console.log("Token updated: ", token);
  }).catch((error) => {
    console.log('Error updating token: ', error);
    throw error;
  });
}

const App = () => {
  React.useEffect(() => {
    (async () => {
        await requestUserPermission();
        await saveUserToken();
    })();
    
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage.notification);
      }
    });
}, []);

  return (
    <AuthProvider>
      <Routes testID="app"/>
    </AuthProvider>
  );
};

export default App;
