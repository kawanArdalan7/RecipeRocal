import { StyleSheet } from 'react-native';

export const macronutrientDisplayStyle = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      margin: 10,
    },
    legend: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 8,
    },
    colorIndicator: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 5,
    },
    legendText: {
      fontSize: 14,
    },
    centerText: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -32 }, { translateY: -25 }], 
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center'
    },
});