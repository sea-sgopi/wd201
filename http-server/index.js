const http = require("http");
const fs = require("fs");
const minimist = require("minimist");

// let homeContent = "";
// let projectContent = "";
fs.readFile("home.html",(err, home) => {
    // console.log(home.toString());
    if(err){
        throw err;
    }
    // http.
    // createServer((req,res) => {
        // res.writeHeader(200, {"Content-Type": "text/html"});
        // res.write(home);
        // res.end();

    // })
    // .listen(3000);
    homeContent = home;
});

fs.readFile("project.html", (err, project) => {
    if (err){
        throw err;
    }
    projectContent = project;
});

fs.readFile("registration.html", (err, registration) => {
    if (err) {
        throw err;
    }
    registrationContent = registration;
});

let args = minimist(process.argv.slice(2),{
    alias : {
        p: "port"
    },
    default: {
        port: "5000"
    }
});
// console.log(args);

console.log("Starting server on port:", args.port);

http.createServer((req, res) => {
    let url = req.url;
    res.writeHeader(200, {"Content-Type": "text/html"});
    switch (url.toLocaleLowerCase()) {
        case "/project":
            res.write(projectContent);
            res.end();
            break;
        case "/registration":
            res.write(registrationContent);
            res.end();
            break;
        default:
            res.write(homeContent);
            res.end();
            break;
    }
})
.listen(args.port, () => {
    console.log(`Server is running on the port ${args.port}`);
});