const { read } = require("fs");
const readLine= require("readline");

const lineDetail = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
});

lineDetail.question("Please provide your name - ", (name) => {
    console.log(`hi ${name}`);
    lineDetail.close();
});
