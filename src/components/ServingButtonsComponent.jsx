import { View} from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { servingStyle } from '../styles/ServingDropdownStyle';
import { useTranslation } from "react-i18next";
import "../translation";

/**
 * @component
 * @description A component for selecting serving amounts.
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.servingChange - Function to handle changes in serving amount.
 * @returns {JSX.Element} - JSX element representing the ServingButtons component.
 */
function ServingButtons({ servingChange }) {
  const { t } = useTranslation();
  const [servingSize, setServingSize] = useState("");

  /**
   * @function pickerServing - Handles the change event of the serving picker.
   * @param {string} pickerValue - The selected value from the picker.
   */
  const pickerServing = (pickerValue) => {
    setServingSize(pickerValue);
    servingChange(pickerValue);
    console.log('serving change: ', pickerValue)
  };

  return (
  <>
    <View>
      <Picker
        style={[servingStyle.pickerInput, {margin: 15}]}
        selectedValue={servingSize}
        onValueChange={(pickerValue) => pickerServing(pickerValue)}
      >
        <Picker.Item label={t('selectServingAmount')} value="" />
        <Picker.Item label={t('fullServing')} value="1" />
        <Picker.Item label={t('halfServing')} value="0.5" />
        <Picker.Item label={t('thirdServing')} value="0.333" />
        <Picker.Item label={t('quarterServing')} value="0.25" />

        <Picker.Item label={t('fifthServing')} value="0.20" />
        <Picker.Item label={t('sixthServing')} value="0.167" />
        <Picker.Item label={t('seventhServing')} value="0.143" />
        <Picker.Item label={t('eighthServing')} value="0.125" />
        <Picker.Item label={t('ninthServing')} value="0.111" />
        <Picker.Item label={t('tenthServing')} value="0.1" />
        <Picker.Item label={t('eleventhServing')} value="0.091" />
        <Picker.Item label={t('twelfthServing')} value="0.083" />
      </Picker>
    </View>
  </>
  );
};

export default ServingButtons;
