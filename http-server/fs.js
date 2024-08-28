// load module
const fs = require("fs");

// write a file
fs.writeFile(
    "sample.txt",
    "Hello WOrld. welcome to Node.js File system module",
    (err) => {
        if (err) throw err ;
        console.log("file Creted");
    }
)

// read a file
fs.readFile("sample.txt", (err, data) => {
    if (err) throw err;
    console.log(data.toString());
})


// Append the data
fs.appendFile("sample.txt", "Thsnknakv aknkavb", (err) => {
    if(err) throw err;
    console.log("File Updated");
})

// Reanem the file
fs.rename("sample.txt", "test.txt", (err) => {
    if (err) throw err;
    console.log("filee name updatef");
})

// Remove the File
fs.unlink("test.txt", (err) => {
    if (err) throw err;
    console.log("File deleted Successfully");
})