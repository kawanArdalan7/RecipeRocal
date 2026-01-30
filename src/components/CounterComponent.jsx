import { Pressable, Text, View } from 'react-native';
import colors from "../assets/colors";
import { useState } from 'react';
import { Slider } from '@miblanchard/react-native-slider';
import { pointStyle } from '../styles/GetPointsStyle';

/**
 * @component
 * @description Counter component that handles the increment and decrement of nutritional elements.
 * @param {string} labelName - Contains the nutrient label.
 * @param {object} counterInfo - Contains the max and min values for the counter.
 * @returns {Counter} Returns a responsive counter component.
 */
function Counter({ labelName, counterInfo }){
  const [counter, setCounter] = useState(1); // initial state of 1

  /**
   * @function increment - Increments the counter.
   */
  const increment = () => { 
    if (counter + 1 > counterInfo.max) {
      setCounter(counter)
    } else {
      counterInfo.curr = counter + 1;
      console.log('--- ', labelName, ":", counter+1);
      setCounter(counter + 1); 
    }
  }; 

  /**
   * @function decrement - Decrements the counter.
   */
  const decrement = () => { 
    if (counter - 1 < counterInfo.min) {
      setCounter(counter)
    } else {
      counterInfo.curr = counter - 1;
      console.log('--- ', labelName, ":", counter-1);
      setCounter(counter - 1); 
    }
  }; 

  /**
   * @function updateSlider - Updates the current macro counterInfo object with the value from the slider.
   * @param {int} value - The slider's current value.
   */
  function updateSlider({ value }) {
    counterInfo.curr = value[0];
    console.log('--- ', labelName, ":", value[0]);
  };

  // Render the counter with increment and decrement buttons and a slider for visual representation
  return (
    <>
      <View>
        <Text style={pointStyle.counterLabel}>{labelName}</Text>
        <View style={pointStyle.counterLayout}>
          <Pressable style={pointStyle.decrementButton} onPress={decrement}>
            <Text style={pointStyle.counterButtonText}>-</Text>
          </Pressable>
          <Text style={pointStyle.counterValue}> 
            {counter}
          </Text>
          <Pressable style={pointStyle.incrementButton} onPress={increment}>
            <Text style={pointStyle.counterButtonText}>+</Text>
          </Pressable>
        </View>
        <Slider
          value={counter}
          maximumValue={counterInfo.max}
          minimumValue={counterInfo.min}
          step={1}
          onValueChange={(value) => {
            setCounter(parseInt(value));
            updateSlider({value});
          }}
          maximumTrackTintColor={colors.lightGrey}
          minimumTrackTintColor={colors.lightGreen}
          thumbTintColor={colors.darkGreen}
        />
      </View>
    </>
  );
};

export default Counter;
