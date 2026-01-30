import { StyleSheet } from 'react-native';

import colors from '../assets/colors.js';

export const pointStyle = StyleSheet.create({
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pointHeaderText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 40
  },
  pointSubText: {
    color: 'black',
    fontSize: 20
  }, 

  body: {
    padding: 20
  },
  counterLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  counterLabel: {
    fontSize: 20,
    paddingVertical: 10,
    color: colors.black,
    textAlign: 'center'
  },
  counterValue: {
    backgroundColor: colors.lightGreen,
    fontSize: 20,
    paddingVertical: 10,
    width: '70%',
    color: colors.white,
    textAlign: 'center'
  },
  decrementButton: {
    backgroundColor: colors.darkGreen,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    width: 50,
    height: 50,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  incrementButton: {
    backgroundColor: colors.darkGreen,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    width: 50,
    height: 50,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },
  counterButtonText: {
    color: colors.white,
    fontSize: 20,
    textAlign: 'center'
  },
  getPointsButton:{
    backgroundColor: colors.darkGreen,
    padding: 20,
    marginTop: '10%',
    borderRadius: 10,
    elevation: 3,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 20
  }, 

  // Juliana
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  }, 
  input: {
    color: colors.black,
    height: 40,
    width: "50%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },

});
