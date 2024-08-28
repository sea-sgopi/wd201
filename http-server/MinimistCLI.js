const minimist = require("minimist");

// normal function
// let args = require("minimist")(process.argv.slice(2));

// console.log(args);

// Aliasing  & default features

//  let args = minimist(process.argv.slice(2),{
//     alias : {
//         n: "name",
//         a: "age",
//     },
//     default: {
//         greeting : "heloo",
//     },
//  }) ;
//  console.log(args);

let args = minimist(process.argv.slice(2),{
    alias : {
        p: "port"
    }
});
console.log(args);

//  run it npm start -- --name msnk