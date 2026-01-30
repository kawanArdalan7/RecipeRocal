import { StyleSheet } from 'react-native';
import colors from '../assets/colors';
import { LinearGradient } from 'react-native-svg';

export const homeStyle = StyleSheet.create({
  body: {
    backgroundColor: colors.offWhite,
    flexDirection: 'column',
  },
  headingText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 40
  },
  homeContainer: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  blackText: {
    color: 'black'
  },
  header: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%'
  },
  headerTop: {
    backgroundColor: colors.white,
    width: '100%',
    height: '15%',
  },
  topButtons:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: colors.darkGreen,
    borderTopWidth: 5,
    gap: 10,
    height: '100%',
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10
  },
  Button:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 80,
    width: '80%',
    padding: 10,
    borderRadius: 20,
    elevation: 3
  },
  buttonText:{
    fontWeight: 'bold',
    color: colors.white,
    fontSize: 15,
  },
  levelBarContainer: {
    margin: 'auto',
    // flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-evenly',
    borderRadius: 5,
    width:'100%',
    height: 120,
  },
  usernameLevelStreakContainer:{
    justifyContent: 'space-evenly',
    width: '100%'
  },
  buddy: { 
    width: 170, 
    height: 170, 
  },
  buddyContainer: { 
    width: '50%',
    height: '50%',
    justifyContent: 'flex-end',
    alignSelf: 'flex-start'
  },
  toolTipContainer:{
    backgroundColor: colors.lightGreen, 
    color: colors.black, 
    justifyContent: 'center', 
    alignSelf: 'center',
    padding: '2%', 
    width: '70%',
    height: '50%',
    borderColor: colors.darkGreen,
    borderWidth: 1,
  },
  streakLevelDisplayContainer:{
    flexDirection: 'row',
    // marginRight: 5,
  },
  userStreakContainer:{
    backgroundColor: colors.yellow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  userLevelContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  streakText:{
    fontSize: 20,
    color: colors.white
  },
  buddyTooltipContainer:{
    // justifyContent:'space-evenly',
    paddingTop: 10,
    alignContent: 'center',
    backgroundColor: colors.white,
    width: '100%',
    flex: 1,
    // flexDirection: 'row',
  },
  statsBars: {
    padding: 10, 
    width: '90%',
    height: 195,
    backgroundColor: colors.lightGreen, 
    alignSelf: 'center',
    margin: 5, 
    borderRadius: 10
  },
  levelBarProgressBarContainer:{
    top: 5,
  }
});