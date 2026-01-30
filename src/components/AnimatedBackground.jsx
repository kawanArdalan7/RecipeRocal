import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ImageBackground } from 'react-native';
// source base code https://medium.com/@anujguptawork/how-to-animate-background-image-in-react-native-970989f885ed

import backgroundImage from '../assets/background.png';
import animBackgroundStyle from '../styles/AnimBackgroundStyle';

const INPUT_RANGE_START = 0;
const INPUT_RANGE_END = 1;
const OUTPUT_RANGE_START = -250;
const OUTPUT_RANGE_END = 0;
const ANIMATION_TO_VALUE = 1;
const ANIMATION_DURATION = 10000;

/**
 * @component
 * @description Creates background for images to be animated.
 * @returns {AnimatedBackground} Returns an animated background image.
 */
export default function AnimatedBackground() {
  const initialValue = 0;
  const translateValue = useRef(new Animated.Value(initialValue)).current;

  useEffect(() => {
    const translate = () => {
      translateValue.setValue(initialValue);
      Animated.timing(translateValue, {
        toValue: ANIMATION_TO_VALUE,
        duration: ANIMATION_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => translate());
    };

    translate();
  }, [translateValue]);

  const translateAnimation = translateValue.interpolate({
    inputRange: [INPUT_RANGE_START, INPUT_RANGE_END],
    outputRange: [OUTPUT_RANGE_START, OUTPUT_RANGE_END],
  });

  const AnimatedImage = Animated.createAnimatedComponent(ImageBackground);

  return (
    <AnimatedImage 
      resizeMode="repeat" 
      style={[animBackgroundStyle.background, {
        transform: [
          {
            translateX: translateAnimation,
          },
          {
            translateY: translateAnimation,
          },
        ],
      }]}
      source={backgroundImage} 
      testID="animated-image"
    />
  );
};
