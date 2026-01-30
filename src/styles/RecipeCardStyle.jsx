import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');
const cardWidth = width * 0.4; 
const cardHeight = height * 0.25; 

export const recipeCardStyle = StyleSheet.create({
    card: {
      width: cardWidth,
      height: cardHeight,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#FFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5, 
      margin: 10
    },
    textContainer: {
      backgroundColor: 'white',
      padding: 7, 
      height: '27%',
    },
    backgroundImage: {
      flex: 1,
      justifyContent: 'flex-end'
    },
    title:{
      color: 'black'
    }
  });