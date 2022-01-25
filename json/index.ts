const objectLiteral = {
    valTypes: {
        string: "aaa",
        number: 42,
        boolean: true,
        symbol: Symbol(),
        array: [1, 2, 3],
        func: () => 'hello world'
    },
    keyTypes: {
        "key": "string",
        23: "number",
        true: "boolean",
        [Symbol()]: "symbol",
        // [[1,2,3]]: "asd",
        // [() => 42]: 'asd',
    },
};
console.log(`~~~ Original object:`);
console.log(objectLiteral);

console.log(`~~~ Accessing keys:`);
console.log(objectLiteral.keyTypes.key);
console.log(objectLiteral.keyTypes.true);
// console.log(objectLiteral.keyTypes[true]);
console.log(objectLiteral.keyTypes["23"]);
console.log(objectLiteral.keyTypes[23]);
// console.log(objectLiteral.keyTypes.23);

console.log(`~~~ Stringified json:`);
const json = JSON.stringify(objectLiteral, undefined, 4);
console.log(json);

console.log(`~~~ Parsed object:`);
const obj = JSON.parse(json);
console.log(obj);


console.log(`~~~ requiring obj literal`);
try {
    console.log(require('./objLiteral.json'));
} catch (e) {
    console.log(`ERROR!`);
}

console.log(`~~~ requiring json`);
console.log(require('./json.json'));
