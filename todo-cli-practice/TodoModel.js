// //  How to create a table
// const { Sequelize, DataTypes, Model } = require("sequelize");
// const { sequelize } =require("./connectDB.js");

// class Todo extends Model {}

// Todo.init ({
//     // Model attributes are definnedd here

//     title: {
//         type: DataTypes.STRING,
//         allowNull:false,
//     },
//     dueDate: {
//         type: DataTypes.DATEONLY,
//     },
//     completed: {
//         type: DataTypes.BOOLEAN,
//     },
// },
// {
//     sequelize
// }
// );

// module.exports = Todo;

// Todo.sync();

// // TodoModel.js

// const { DataTypes } = require("sequelize");
// const { sequelize } = require("./connectDB.js");

// const Todo = sequelize.define (
//     "Todo",
//     {
//         // Model attributes are defined here
//         title: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         dueDate: {
//             type: DataTypes.DATEONLY,
//         },
//         complete: {
//             type: DataTypes.BOOLEAN,
//         },
//     },
//     {
//         tableName: "todos"
//     }
// );

// module.exports = Todo;
// Todo.sync(); // Create the table

// The second way of defining a model is by extending it from Model base class and then using the init method with model attributes.

const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("./connectDB.js");

class Todo extends Model {
  static async addTask(params) {
    return await Todo.create(params);
  }

  displayString() {
    return `${this.completed ? "[X]" : "[ ]"} ${this.id}. ${this.title} - ${this.dueDate}`;
  }
}
Todo.init(
  {
    // Model attributes are defined here
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
    },
    completed: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
  },
);

Todo.sync();
module.exports = Todo;
