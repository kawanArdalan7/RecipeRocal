import { Text, View, ScrollView, Keyboard, FlatList, TouchableOpacity, Modal, Linking, Image } from 'react-native';
import { recipeSearchStyle } from '../styles/RecipeSearchStyle';
import { useState, useEffect } from 'react';
import { SearchBar } from '@rneui/themed';
import { recipeSearch } from '../service/recipe';
import RecipeCard from '../components/RecipeCard';
import globalStyles from '../assets/globalStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ButtonGroup } from '@rneui/themed'
import colors from '../assets/colors';
import MacronutrientDisplay from '../components/MacronutrientDisplay';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { useTranslation } from "react-i18next";
import "../translation";

var calorieCounterInfo = {
  label: 'Calories',
  max: 2000,
  min: 0,
  curr: 1
};

var proteinCounterInfo = {
  label: 'Protein(g)',
  max: 100,
  min: 0,
  curr: 1
};

var fatCounterInfo = {
  label: 'Fat(g)',
  max: 100,
  min: 0,
  curr: 1
};

const carbCounterInfo = {
  label: 'Carbs',
  max: 200,
  min: 0,
  curr: 1
};

/**
 * @constructor
 * @description RecipeSearchPage component that allows the user to search recipes by keyword and view recipes that meet their goals.
 * @param {Object} navigation - Contains methods for navigating between screens.
 * @return {RecipeSearchPage} The screen for searching, viewing, and logging recipes.
 */
export default function RecipeSearchPage({ route, navigation }) {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [APIResult, setAPIResult] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [discoverRecipes, setDiscoverRecipes] = useState([]);
  const [lowCarbRecipes, setLowCarbRecipes] = useState([]);
  const [highProteinRecipes, setHighProteinRecipes] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [manualVisible, setManualVisible] = useState(true); 

  const currentUser = auth().currentUser;
  const userRef = database().ref(`Users/${currentUser.uid}`);
  const currDate = new Date();
  // formate date() output to YYYY-MM-DD
  let formattedDate = `${currDate.getFullYear()}-${String(currDate.getMonth() + 1).padStart(2, '0')}-${String(currDate.getDate()).padStart(2, '0')}`;
  
  const userDailyRef = database().ref(`Users/${currentUser.uid}/history/${formattedDate}`);
  const userSavedRef = database().ref(`Users/${currentUser.uid}/saved`);

  /**
   * @function openDetails - Opens the details modal.
   * @param {Object} recipe - The selected recipe.
   */
  const openDetails = (recipe) => {
    setSelectedRecipe(recipe);
    setDetailsVisible(true);
  };

  /**
   * @function closeDetails - Closes the details modal.
   */
  const closeDetails = () => {
    setSelectedIndex(0);
    setSelectedRecipe(null);
    setDetailsVisible(false);
  };

  /**
   * @function updateSearch - Updates the search state.
   * @param {string} search - The new value for the search state.
   */
  const updateSearch = (search) => {
    setSearch(search);
  };

  /**
   * @function processRecipes - Processes recipes to include additional attributes.
   * @param {Object} recipes - The recipes to be processed.
   * @returns {Object} The processed recipes.
   */
  const processRecipes = (recipes) => {
    const res = recipes.map((r, index) => {
      return {
        ...r.recipe, 
        id: index,
        // Here, we can compute exp attribute
      };
    });
  
    return res;
  };

  /**
   * @function generateRecommendations - Generates recipe recommendations based on user preferences.
   */
  const generateRecommendations = async () => {
    const preferencesRef = userRef.child('preferences');
    const preferencesSnapshot = await preferencesRef.once('value');
    
    let cal = 2000 / 3;
    let pro = 50 / 3;
    let car = 100 / 3;
    let fat = 30 / 3;

    let calMargin = 200;
    let macMargin = 15;

    if (preferencesSnapshot.exists()) {
      const preferences = preferencesSnapshot.val();
      cal = Math.floor(preferences.cal / 3);
      pro = Math.floor(preferences.pro / 3);
      car = Math.floor(preferences.car / 3);
      fat = Math.floor(preferences.fat / 3);
    }

    let calMin = cal - calMargin;
    let calMax = cal + calMargin;
    let proMin = pro - macMargin;
    let proMax = pro + macMargin;

    const recommendationsQuery = 
      `nutrients%5BENERC_KCAL%5D=${calMin}-${calMax}&`+
      `nutrients%5BPROCNT%5D=${proMin}-${proMax}`;

    const recommendationsResult = await recipeSearch(recommendationsQuery);
    setRecommendations(processRecipes(recommendationsResult.hits));

    const discoverResult = await recipeSearch("nutrients%5BENERC_KCAL%5D=0-4000&random=true");
    setDiscoverRecipes(processRecipes(discoverResult.hits));

    const lowCarbResult = await recipeSearch("diet=low-carb&random=true");
    setLowCarbRecipes(processRecipes(lowCarbResult.hits));

    const highProteinResult = await recipeSearch("diet=high-protein&random=true");
    setHighProteinRecipes(processRecipes(highProteinResult.hits))
  };

  /**
   * @function onSearch - Sends the search query to the Edamam API and populates the recipes array.
   */
  const onSearch = async () => {
    Keyboard.dismiss();

    if (search === "" || !search) {
      setRecipes([]);
      setManualVisible(true);
    }
    else {
      const result = await recipeSearch("q="+search);
      setAPIResult(result);
      setRecipes(processRecipes(result.hits));
      setManualVisible(false); 
    }
  };

  /**
   * @function renderRecipe - Renders a recipe card component with a truncated title if necessary.
   * @param {Object} params - The parameters object.
   * @param {Object} params.item - The recipe item to be rendered.
   * @param {string} params.item.label - The title of the recipe.
   * @param {string} [params.item.image] - The URL of the recipe image. Optional.
   * @returns {JSX.Element} A RecipeCard component populated with the recipe's details.
   */
  const renderRecipe = ({ item: recipe }) => {
    const len = 33;
    const label = (recipe?.label.length > len ? recipe.label.substring(0, len) + "..." : recipe.label) ?? "";

    return (
      <RecipeCard
        imageUrl = {recipe?.image ?? ""}
        title = {label}
        onPress = {() => openDetails(recipe)}
      />
    );
  };

  /**
   * @constructor
   * @description Renders a screen displaying a list of ingredients. The screen is only rendered if its tab is selected.
   * @returns {JSX.Element} - The ingredients screen.
   */
  function IngredientsScreen() {
    if (selectedIndex != 0) return null;

    return (
      <View style={{top: -10}}>
        <View style={{flexDirection: "row"}}>
          <Icon name={"bowl-mix-outline"} size={24} color={"black"}/>
          <Text style={{...globalStyles.h3, ...recipeSearchStyle.modalHeader}}> {t('ingredients')}</Text>
        </View>
        <View style={recipeSearchStyle.thickLine} />
        {
          selectedRecipe?.ingredientLines?.map((item, index) => (
            <View key = {index}>
              <View key = {index} style={{...recipeSearchStyle.row}}>
                <Text style={recipeSearchStyle.textItem}>
                  {item}
                </Text>
              </View>
              <View style={recipeSearchStyle.line} />
            </View>

          )) ?? null
        }
      </View>
    );
  };
  
  /**
   * @constructor
   * @description Renders a screen displaying the nutritional info of the selected recipe. The screen is only rendered if its tab is selected.
   * @returns {JSX.Element} The nutritional info screen.
   */
  function NutritionInfoScreen() {
    if (selectedIndex != 1) return null;

    let format = (value) => {
      if (value === null || value === "") return "0";
      return Math.round(Number(value)).toString();
    }

    const primaryMacros = ['ENERC_KCAL', 'PROCNT', 'CHOCDF', 'FAT'];

    const series = [
      selectedRecipe.totalNutrients.PROCNT.quantity,
      selectedRecipe.totalNutrients.FAT.quantity,
      selectedRecipe.totalNutrients.CHOCDF.quantity
    ];

    return (
      <ScrollView style={{top: -10}}> 
        <View style={{flexDirection: "row", marginBottom: 20}}>
          <Icon name={"nutrition"} size={24} color={"black"} />
          <Text style={{...globalStyles.h3, ...recipeSearchStyle.modalHeader}}> {t('nutritionInfo')}</Text>
        </View>
        <MacronutrientDisplay
          series={series}
          calories={selectedRecipe.totalNutrients.ENERC_KCAL.quantity}
        />
        {
          Object.entries(selectedRecipe?.totalNutrients ?? {})
          .filter(([key, item]) => primaryMacros.includes(key))
          .map(([key, item], index) => (
            <View key = {index}>
              <View style={{...recipeSearchStyle.row}}>
              <Text style={{...recipeSearchStyle.modalText, fontWeight: 'bold'}}>
                {item.label}
              </Text>
              <Text style={{...recipeSearchStyle.modalText, fontWeight: 'bold'}}>
                {format(item?.quantity)} {item?.unit}
              </Text>
            </View>

            <View style={recipeSearchStyle.line} />
            </View>
          )) ?? null
        }

        {
          Object.entries(selectedRecipe?.totalNutrients ?? {})
          .filter(([key, item]) => !primaryMacros.includes(key))
          .map(([key, item], index) => (
            <View key = {index}>
              <View style={{...recipeSearchStyle.row}}>
              <Text style={{...recipeSearchStyle.modalText}}>
                {item.label}
              </Text>
              <Text style={{...recipeSearchStyle.modalText}}>
                {format(item?.quantity)} {item?.unit}
              </Text>
            </View>

            <View style={recipeSearchStyle.line} />
            </View>
          )) ?? null
        }
      </ScrollView>
    );
  }
  
  /**
   * @constructor
   * @description Renders a screen where users can log their macros based on he macros of the selected recipe. The screen is only rendered if its tab is selected.
   * @returns {JSX.Element} The logging screen.
   */
  function LoggingScreen() {
    if (selectedIndex != 2) return null;

    useEffect(() => {
      calorieCounterInfo.curr = selectedRecipe.totalNutrients.ENERC_KCAL.quantity;
      proteinCounterInfo.curr = selectedRecipe.totalNutrients.PROCNT.quantity;
      fatCounterInfo.curr = selectedRecipe.totalNutrients.FAT.quantity;
      carbCounterInfo.curr = selectedRecipe.totalNutrients.CHOCDF.quantity;
    }, []);

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ScrollView>  
          <TouchableOpacity 
            style={[recipeSearchStyle.button, {backgroundColor: colors.darkGreen}]}
            onPress={() => {
              closeDetails();
              navigation.navigate('Logging', 
                {
                  currMealName: selectedRecipe.label, 
                  currCal: calorieCounterInfo.curr, 
                  currFat: fatCounterInfo.curr, 
                  currPro: proteinCounterInfo.curr, 
                  currCar: carbCounterInfo.curr,
                  saveMealBool: true,
                }
              );
            }}
          >                  
            <Text style={recipeSearchStyle.buttonText}>{t('logMeal')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  useEffect(()=> {
    generateRecommendations();
  }, []);

  return (
    <>
      <View style = {recipeSearchStyle.container}>
        <SearchBar
          placeholder={t('findRecipes')}
          onChangeText={updateSearch}
          containerStyle={recipeSearchStyle.searchBarContainer}
          inputContainerStyle={recipeSearchStyle.searchBarInput}
          inputStyle={globalStyles.normal_text}
          value={search}
          lightTheme={true}
          round={true}
          showCancel={true}
          searchIcon={null}
          cancelIcon={null}
          onSubmitEditing={onSearch}
        />
        <TouchableOpacity onPress={onSearch} style={recipeSearchStyle.searchButton}>
          <Text style={globalStyles.button_text}>{t('search')}</Text>
        </TouchableOpacity>
      </View>

      {
        manualVisible && 
        <ScrollView>
          <View style = {recipeSearchStyle.horizontalFlatList}>
            <Text style={{...globalStyles.h2, ...recipeSearchStyle.recommendationheader, fontWeight: 'bold'}}>{t('explore')}</Text>
            <FlatList
              data={discoverRecipes}
              renderItem={renderRecipe}
              keyExtractor={item => item.id}
              extraData={null}
              contentContainerStyle={recipeSearchStyle.horizontalFlatListContent}
              horizontal={true}
            />
          </View>

          <View style = {recipeSearchStyle.horizontalFlatList}>
            <Text style={{...globalStyles.h2, ...recipeSearchStyle.recommendationheader, fontWeight: 'bold'}}>{t('ketoFriendly')}</Text>
            <FlatList
              data={lowCarbRecipes}
              renderItem={renderRecipe}
              keyExtractor={item => item.id}
              extraData={null}
              contentContainerStyle={recipeSearchStyle.horizontalFlatListContent}
              horizontal={true}
            />
          </View>

          <View style = {recipeSearchStyle.horizontalFlatList}>
            <Text style={{...globalStyles.h2, ...recipeSearchStyle.recommendationheader, fontWeight: 'bold'}}>{t('highProtein')}</Text>
            <FlatList
              data={highProteinRecipes}
              renderItem={renderRecipe}
              keyExtractor={item => item.id}
              extraData={null}
              contentContainerStyle={recipeSearchStyle.horizontalFlatListContent}
              horizontal={true}
            />
          </View>
        </ScrollView>
      }

      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={item => item.id}
        extraData={null}
        numColumns={2}
        contentContainerStyle={recipeSearchStyle.flatListContent}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsVisible}
        onRequestClose={closeDetails}
      >
        <Image
          source={{ uri: selectedRecipe?.image ?? "" }}
          style={recipeSearchStyle.backgroundImage}>
        </Image>
        <TouchableOpacity onPress={closeDetails} style={recipeSearchStyle.closeButton}>
          <Icon name={"close"} size={24} color={"black"}/>
        </TouchableOpacity>
        <ScrollView style={recipeSearchStyle.modalView}>
          <View style={recipeSearchStyle.headerContainer}>
            <Text style={{...globalStyles.h2, ...recipeSearchStyle.modalText, fontWeight: 'bold'}}>{selectedRecipe?.label}</Text>

            <Text 
              style={{...recipeSearchStyle.modalText, color: 'blue', marginVertical: 5}} 
              onPress={() => Linking.openURL(selectedRecipe.url)}
            >
              {t('recipeLink')}
            </Text> 
            <ButtonGroup
              buttons={[t('ingredients'), t('nutritionInfo'), t('logRecipe')]}
              selectedIndex={selectedIndex}
              onPress={(value) => {
                setSelectedIndex(value);
              }}
              containerStyle={{ borderRadius: 15 }}
              buttonStyle={{ backgroundColor: colors.lightGreen }}
              selectedButtonStyle={{ backgroundColor: colors.darkGreen }}
              textStyle={{color: "#000"}}
            />
          </View>
          
          <View style={recipeSearchStyle.detailsContainer}>
            <IngredientsScreen/>
            <NutritionInfoScreen/>
            <LoggingScreen/>
          </View>
        </ScrollView>
      </Modal>
    </>
  );
};
