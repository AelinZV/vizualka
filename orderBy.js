function sortObjects(arr, keys) {
    if (!Array.isArray(arr) || arr.some(item => typeof item !== "object" || item === null)) {
        throw new Error("Input must be an array of objects");
    }

    const getValue = (obj, key) => key.split('.').reduce((val, part) => val?.[part], obj);

    for (const key of keys) {
        const prop = key.startsWith('-') ? key.slice(1) : key;
        if (arr.some(item => getValue(item, prop) === undefined)) {
            throw new Error(`Property '${prop}' is missing in some objects`);
        }
    }

    return [...arr].sort((a, b) => {
        for (const key of keys) {
            const desc = key.startsWith('-'); 
            const prop = desc ? key.slice(1) : key;

            const valueA = getValue(a, prop);
            const valueB = getValue(b, prop);

            if (valueA > valueB) return desc ? -1 : 1;
            if (valueA < valueB) return desc ? 1 : -1;
        }
        return 0;
    });
}

module.exports = sortObjects;
