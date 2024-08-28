//  load the modules
const http = require("http");
const fs = require("fs");

// function for server to load the data
// const server = http.createServer((req,res) => {
//     fs.readFile("sample.txt",(err, data) => {
//         res.end(data);
//     })
// });

// using the streams same function
const server = http.createServer((req,res) => {
    const stream = fs.createReadStream("sample.txt");
    stream.pipe(res);
});

server.listen(3000, () => {
    console.log("server is listeninign ")
});