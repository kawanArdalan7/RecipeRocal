const id = "cc9654b6";
const key = "a3830d78ed458465d69acff511707f3f";

export const recipeSearch = async (query) => {
  if (!query || query === "") return [];
  const url = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${id}&app_key=${key}&${query}`
  const res = await fetch(url);
  const recipes = await res.json();
  return recipes;
};

export const lowCarbRecipes = async () => {
  const url = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${id}&app_key=${key}&$`
  const res = await fetch(url);
  const recipes = await res.json();
  return recipes;
};