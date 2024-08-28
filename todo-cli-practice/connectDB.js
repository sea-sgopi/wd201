// connectDB.js

// const { Connection } = require("pg");
const Sequelize = require("sequelize");

const datebase = "todo_db";
const username = "postgres";
const password = "Postgres";
const sequelize = new Sequelize(datebase, username, password, {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

// sequelize
//     .authenticate()
//     .then(() =>{
//         console.log("Connection has been established successfully");
//     })
//     .catch((error) => {
//         console.error("Unable to connect to the databse:" , error);
//     })

const connect = async () => {
  return sequelize.authenticate();
};

module.exports = {
  connect,
  sequelize,
};
