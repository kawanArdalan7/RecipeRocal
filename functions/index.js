/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp();

function sendWinNotification(token) {
  var message = {
    notification: {
      title: 'RecipeRocal',
      body: 'You hit your goal from yesterday. Keep it up!'
    },
    token: token,
  };
  
  admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
}

function sendLoseNotification(token) {
  var message = {
    notification: {
      title: 'RecipeRocal',
      body: 'You missed yesterday\'s goal. Don\'t worry, you\'ll get it soon!'
    },
    token: token,
  };
  
  admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
}

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.experienceCalculation = functions.pubsub.schedule('every day 00:00').onRun(async (context) => {
  let today = new Date();
  let yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  let todayKey = today.toISOString().slice(0,10);
  let yesterdayKey = yesterday.toISOString().slice(0,10);

  const usersRef = admin.database().ref('Users');
  const snapshot = await usersRef.once('value');
  const users = snapshot.val();

  for (const userId in users) {
    if (users.hasOwnProperty(userId)) {
      const userRef = usersRef.child(userId);
      const yesterdayRef = userRef.child(`history/${yesterdayKey}`);
      const yesterdaySnapshot = await yesterdayRef.once('value');

      if(yesterdaySnapshot.exists()) {
        const macros = yesterdaySnapshot.val();
        const expRef = userRef.child('experience');
        const expSnapshot = await expRef.once('value');

        if(expSnapshot.exists()){
          const preferencesRef = userRef.child('preferences');
          const preferencesSnapshot = await preferencesRef.once('value');
          if (preferencesSnapshot.exists()) {
            const preferences = preferencesSnapshot.val();
            const expGain = 10 * (Math.abs(preferences.cal - macros.cal) <= 200 ? 1 : 0) +
                            10 * (Math.abs(preferences.pro - macros.pro) <= 20 ? 1 : 0) +
                            10 * (Math.abs(preferences.car - macros.car) <= 40 ? 1 : 0) +
                            10 * (Math.abs(preferences.fat - macros.fat) <= 20 ? 1 : 0);

            const currentExp = expSnapshot.val() || 0;
            await expRef.set(currentExp + expGain);
            logger.info(`User ${userId} gained ${expGain} experience!`, {structuredData: true});

            const streakRef = userRef.child('streak');
            const streakSnapshot = await streakRef.once('value');
            let currentStreak = streakSnapshot.val() || 0;

            const tokenRef = userRef.child('token');
            const tokenSnapshot = await tokenRef.once('value');
            const token = tokenSnapshot.exists() ? tokenSnapshot.val() : null;

            console.log(token);

            if(expGain === 40){
              currentStreak++;
              if(token !== null){
                sendWinNotification(token);
                console.log("win")
              }
            }
            else{
              currentStreak = 0;
              if(token !== null){
                sendLoseNotification(token);
                console.log("lose")
              }
            }
            await streakRef.set(currentStreak);
          } 
        }
        else{
          logger.info(`Missing Attribute - Experience attribute missing for user ${userId}`, {structuredData: true});
        }
      }

      const historyRef = userRef.child(`history`);
      const historySnapshot = await historyRef.once('value');

      if(historySnapshot.exists()){
        const newMacros = {
          cal: 0,
          pro: 0,
          car: 0,
          fat: 0,
        }

        historyRef.update({[todayKey] : newMacros});
      }
      else{
        logger.info(`Missing Attribute - History attribute missing for user ${userId}`, {structuredData: true});
      }
    }
  }
});