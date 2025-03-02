// getDataFromAPI.js
export default async function getDataFromAPI() {
    try {
        const response = await fetch('https://dummyjson.com/recipes');
        if (!response.ok) throw new Error('Network response was not ok');
        const json = await response.json();
        return json.recipes; // Возвращаем только массив recipes
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}