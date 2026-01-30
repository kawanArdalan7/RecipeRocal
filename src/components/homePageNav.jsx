import { Text, View } from 'react-native';

/**
 * @component
 * @description Builds header title for the application.
 * @param {object} navigation - Contains methods for navigating between screens.
 * @returns {HomePageNav} Header bar for the application.
 */
export default function HomePageNav({ navigation }) {
  // Note that this text does not need to be translated since it will be universal as the app's name
  return (
    <>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
        <Text style={{fontSize:30, fontWeight: 'bold', color: 'white', marginLeft: '2%'}}>RecipeRocal</Text>
      </View>
    </>
  );
};
