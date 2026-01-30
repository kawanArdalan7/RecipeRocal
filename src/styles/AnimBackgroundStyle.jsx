import {StyleSheet} from 'react-native'

const animBackgroundStyle = StyleSheet.create({    
    
    background: {
        position: 'absolute',
        width: 1200,
        height: 1200,
        top: 0,
        opacity: 0.5,
        transform: [
          {
            translateX: 0,
          },
          {
            translateY: 0,
          },
        ],      
      }, 
  });

export default animBackgroundStyle