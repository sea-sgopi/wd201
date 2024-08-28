// models/todo.js
"use strict";
const Sequelize = require("sequelize");
const { Model } = Sequelize;
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      const overdueTasks = await Todo.overdue();
      overdueTasks.forEach((task) => console.log(task.displayableString()));

      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      const todayTasks = await Todo.dueToday();
      todayTasks.forEach((task) => console.log(task.displayableString()));
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const laterTasks = await Todo.dueLater();
      laterTasks.forEach((task) => console.log(task.displayableString()));
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      return await Todo.findAll({
        where: {
          dueDate: {
            [Sequelize.Op.lt]: new Date().toISOString().split("T")[0],
          },
        },
      });
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      const today = new Date().toISOString().split("T")[0];
      return await Todo.findAll({
        where: {
          [Sequelize.Op.or]: [
            // { completed: { [Sequelize.Op.eq]: true } },
            { dueDate: { [Sequelize.Op.eq]: today } },
          ],
        },
      });
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      const today = new Date().toISOString().split("T")[0];
      return await Todo.findAll({
        where: {
          [Sequelize.Op.or]: [
            { dueDate: { [Sequelize.Op.gt]: today } },
            // { completed: { [Sequelize.Op.eq]: false } }  // Assuming `completed` is a boolean field
          ],
        },
      });
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      return await Todo.update(
        {
          completed: true,
        },
        { where: { id: id } },
      );
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      let date = new Date().toISOString().split("T")[0];
      // let data = date === this.dueDate ? "" : this.dueDate;
      // return `${this.id}. ${checkbox} ${this.title} ${data}`;
      if (date == this.dueDate) {
        return `${this.id}. ${checkbox} ${this.title}`;
      } else {
        return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
      }
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );
  return Todo;
};
