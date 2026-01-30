import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import PieChart from 'react-native-pie-chart'
import colors from '../assets/colors';
import { useTranslation } from "react-i18next";
import { macronutrientDisplayStyle } from '../styles/MacronutrientDisplayStyle';
import "../translation";

/**
 * @component
 * @description A donut chart for displaying calories and primary macronutrients.
 * @param {list} series - List of the macronutrients in the recipe. Will be used to display the portions in the donut chart. 
 * @param {number} calories - Number of calories in the recipe.
 * @returns {MacronutrientDisplay} Returns a pie chart displaying primary nutrition info (calories, protein, fat, and carbs).
 */
const MacronutrientDisplay = ({ series = [1, 1, 1], calories = 0 }) => {
  const { t } = useTranslation();
  const labels = [t('protein'), t('fat'), t('carbs')];

  const widthAndHeight = 200;
  const sliceColor = [colors.red, colors.yellow, colors.darkGreen];

  return (
    <ScrollView style={{ flex: 1, marginBottom: 20 }}>
      <View style={macronutrientDisplayStyle.container}>
        <PieChart
          widthAndHeight={widthAndHeight}
          series={series}
          sliceColor={sliceColor}
          coverRadius={0.55}
          coverFill={'#FFF'}
        />
        <Text style={macronutrientDisplayStyle.centerText}>{Math.round(calories)} cal</Text>
        <View style={macronutrientDisplayStyle.legend}>
          {labels.map((label, index) => (
            <View key={index} style={macronutrientDisplayStyle.legendItem}>
            <View style={[macronutrientDisplayStyle.colorIndicator, { backgroundColor: sliceColor[index] }]} />
            <Text style={macronutrientDisplayStyle.legendText}>{label}: {Math.round(series[index])}g</Text>
          </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default MacronutrientDisplay;
