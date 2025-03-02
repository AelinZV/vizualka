// loadData.js
import fetch from 'node-fetch';

async function loadData() {
    let url = "https://catfact.ninja/breeds";
    let data = [];
    
    while (url) {
        const response = await fetch(url);
        const json = await response.json();
        data = data.concat(json.data);
        url = json.next_page_url; // Обновляем URL на следующую страницу
    }
    
    return data;
}

export default loadData;