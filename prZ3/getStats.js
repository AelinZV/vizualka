// getStats.js
export default async function getStats(getDataFromAPI) {
  const recipes = await getDataFromAPI();
  const ingredientStats = {};
  
  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      ingredientStats[ingredient] = (ingredientStats[ingredient] || 0) + 1;
    });
  });
  
  return ingredientStats;
}