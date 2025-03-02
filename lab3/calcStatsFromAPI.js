// calcStatsFromAPI.js
import loadData from './loadData';
import calcStats from './calcStats';

export default async function calcStatsFromAPI() {
    const catsInfo = await loadData();
    return calcStats(catsInfo);
}