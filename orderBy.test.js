const sortObjects = require("./orderBy.js");

test("Sorts array by name then age", () => {
    const data = [
        { name: "a", age: 25 },
        { name: "b", age: 20 },
        { name: "a", age: 22 },
        
    ];
    const sortedData = sortObjects(data, ["name", "age"]);
    expect(sortedData).toEqual([
        { name: "a", age: 22 },
        { name: "a", age: 25 },
        { name: "b", age: 20 }
    ]);
});
// test("Sorts array by name then age", () => {
//     const data = [
//         { name: "a", age: 25 },
//         { name: "b", age: 20 },
//         { name: "a", age: 22 },
//     ];
//     const sortedData = sortObjects(data, ["name", "age"]);
    
//     expect(sortedData).toEqual([
//         { name: "a", age: 25 }, 
//         { name: "a", age: 22 },
//         { name: "b", age: 20 }
//     ]);
// });


test("Throws error when array contains non-object elements", () => {
    expect(() => sortObjects([1, 2, 3], ["name"])).toThrow("Input must be an array of objects");
});

test("Throws error when property is missing", () => {
    const data = [
        { name: "a", age: 25 },
        { name: "b" }
    ];
    expect(() => sortObjects(data, ["name", "age"])).toThrow("Property 'age' is missing in some objects");
});

test("Sorts array by single property", () => {
    const data = [
        { name: "c", age: 30 },
        { name: "a", age: 25 },
        { name: "b", age: 20 }
    ];
    const sortedData = sortObjects(data, ["name"]);
    expect(sortedData).toEqual([
        { name: "a", age: 25 },
        { name: "b", age: 20 },
        { name: "c", age: 30 }
    ]);
});

test("Sorts array with nested properties", () => {
    const data = [
        { name: "a", details: { age: 25 } },
        { name: "b", details: { age: 20 } },
        { name: "a", details: { age: 22 } }
    ];
    const sortedData = sortObjects(data, ["name", "details.age"]);
    expect(sortedData).toEqual([
        { name: "a", details: { age: 22 } },
        { name: "a", details: { age: 25 } },
        { name: "b", details: { age: 20 } }
    ]);
});

