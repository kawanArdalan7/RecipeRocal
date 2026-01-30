import React from 'react';

import { View, Text, Pressable, ImageBackground } from 'react-native';
import { useTranslation } from "react-i18next";
import { recipeCardStyle } from '../styles/RecipeCardStyle';
import "../translation";

/** 
 * @component
 * @description Clickable card component that brings up the recipe details modal.
 * @param {object} imageUrl - Background image for the card .
 * @param {string} title - Title of the recipe, placed at the bottom of the card.
 * @param {string} onPress - Function that triggers when the card is pressed.
 * @returns {RecipeCard} Card component for a single recipe.
 */
const RecipeCard = ({ imageUrl, title, onPress }) => {
  return (
    <Pressable onPress={onPress} style={recipeCardStyle.card}>
      <ImageBackground
        source={{ uri: imageUrl }}
        resizeMode="cover"
        style={recipeCardStyle.backgroundImage}>
      </ImageBackground>
      <View style={recipeCardStyle.textContainer}>
        <Text style={recipeCardStyle.title}>{title}</Text>
      </View>
    </Pressable>
  );
};

export default RecipeCard;
