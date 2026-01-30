import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

/*
  Preferences need:
  - Calorie goal
  - Protein goal
  - Fat goal
  - Carbs (sugar) goal
*/

/**
 * @class
 * @description Point calculator to be run at end of each day.
 * @returns {int} Amount of experience points gained from the day.
 */
export async function macroPointCalculator () {
  // establish backend connection to get our user preferences HERE
  const currentUser = auth().currentUser;
  const prefsRef = database().ref(`Users/${currentUser.uid}/preferences`);

  // Get today's macros ref
  const currDate = new Date();
  // format date() output to YYYY-MM-DD
  let formattedDate = `${currDate.getFullYear()}-${String(currDate.getMonth() + 1).padStart(2, '0')}-${String(currDate.getDate()).padStart(2, '0')}`;
  const macrosRef = database().ref(`Users/${currentUser.uid}/history/${formattedDate}`);

  /**
   * @function readMacro - Fetches macro nutrient information from database.
   * @param {string} macroName - Nutrient to fetch.
   * @param {obj} ref - Database reference.
   * @returns {int} - Database value stored for the macro nutrient.
   */
  async function readMacro(macroName, ref) {
    let currValue = 0;
    let snapshot = await ref.once('value');

    try {
      // if the snapshot.val() returns null, create the values by setting to 0 and retake the snapshot
      if (!snapshot.val()){
        // push new day with -1 values for macros to set up
        ref.set({
          cal: 0,
          pro: 0,
          fat: 0,
          car: 0,
        });
        // update snapshot with new setup date branch
        snapshot = await ref.once('value');
      }
    } catch (error) {
      console.error('Error reading snapshot:', error);
    }
    
    try {
      if (macroName === "Calories") {
        currValue = snapshot.val().cal;
      } else if (macroName === "Fat") {
        currValue = snapshot.val().fat;
      } else if (macroName === "Protein") {
        currValue = snapshot.val().pro;
      } else if (macroName === "Carbs") {
        currValue = snapshot.val().car;
      } else {
        console.error('Error finding macro type:');
      }

      if (currValue === null) {
        currValue = 0; // Provide a default value if currValue is null
      }
    } catch (error) {
      console.error('Error calculating new macro:', error);
    }

    return currValue;
  }

  /**
   * @function fetchGoal - Fetches user macro preferences.
   * @returns {object} List of user dietary nutrient goals.
   */
  async function fetchGoal() {
    let fetchedGoal = { cal: 0, pro: 0, car: 0, fat: 0 };

    fetchedGoal.cal = await readMacro("Calories", prefsRef);
    fetchedGoal.pro = await readMacro("Protein", prefsRef);
    fetchedGoal.car = await readMacro("Carbs", prefsRef);
    fetchedGoal.fat = await readMacro("Fat", prefsRef);

    return fetchedGoal;
  }

  /**
   * @function fetchData - Fetches user's macro nutrient information.
   * @returns {object} List of user's macro info.
   */
  async function fetchData() {
    let fetchedData = { cal: 0, pro: 0, car: 0, fat: 0 };

    fetchedData.cal = await readMacro("Calories", macrosRef);
    fetchedData.pro = await readMacro("Protein", macrosRef);
    fetchedData.car = await readMacro("Carbs", macrosRef);
    fetchedData.fat = await readMacro("Fat", macrosRef);

    return fetchedData;
  }
  
  /**
   * @function calculateExp - Calculate points earned for each nutrient.
   * @returns {int} Returns the total amount of points.
   */
  async function calculateExp() {
    try {
      // Fetch data
      const fetchedData = await fetchData();
      const fetchedGoal = await fetchGoal();

      // Calculate points earned for each nutrient
      let totalPoints = 0;
      
      totalPoints = macroPointCalculator_preview(fetchData, fetchGoal);

      // console.log("Total points earned:", totalPoints);
      return totalPoints;
    } catch (error) {
      console.error("Error fetching data:", error);
      return 0;
    }
  }

  let exp = await calculateExp();
  console.log("my experience: ", exp);

  return exp;
};

/**
 * @function macroPointCalculator_preview - Determines the expected amount of points to be received at the end of the day.
 * @param {*} data - User's current macro count.
 * @param {*} goal - User's macro goal.
 * @returns {int} Returns the total amount of points.
 */
export function macroPointCalculator_preview(data, goal) {
  // should we choose to use user-set strictness, the default value will be 10%
  // Calculate the acceptable range for each nutrient based on the margin of strictness
  const marginOfStrictness = 0.10;
  const acceptableRange = {
    cal: {
      lowerBound: goal.cal * (1 - marginOfStrictness),
      upperBound: goal.cal * (1 + marginOfStrictness)
    },
    pro: {
      lowerBound: goal.pro * (1 - marginOfStrictness),
      upperBound: goal.pro * (1 + marginOfStrictness)
    },
    car: {
      lowerBound: goal.car * (1 - marginOfStrictness),
      upperBound: goal.car * (1 + marginOfStrictness)
    },
    fat: {
      lowerBound: goal.fat * (1 - marginOfStrictness),
      upperBound: goal.fat * (1 + marginOfStrictness)
    }
  };

  // Calculate points earned for each nutrient
  let totalPoints = 0;
  if (data.cal >= acceptableRange.cal.lowerBound && data.cal <= acceptableRange.cal.upperBound) {
    totalPoints += 10;
  }
  if (data.pro >= acceptableRange.pro.lowerBound && data.pro <= acceptableRange.pro.upperBound) {
    totalPoints += 10;
  }
  if (data.car >= acceptableRange.car.lowerBound && data.car <= acceptableRange.car.upperBound) {
    totalPoints += 10;
  }
  if (data.fat >= acceptableRange.fat.lowerBound && data.fat <= acceptableRange.fat.upperBound) {
    totalPoints += 10;
  }

  return totalPoints;
};
