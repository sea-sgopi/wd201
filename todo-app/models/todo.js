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
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }

    static addTodo({ title, dueDate, completed = false }) {
      return this.create({ title: title, dueDate: dueDate, completed });
    }

    static getTodos() {
      return this.findAll();
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      return await Todo.findAll({
        where: {
          [Sequelize.Op.and]: [
            { completed: { [Sequelize.Op.eq]: false } },
            {
              dueDate: {
                [Sequelize.Op.lt]: new Date().toISOString().split("T")[0],
              },
            },
          ],
        },
      });
    }

    static async completed() {
      return this.findAll({
        where: {
          completed: true,
        },
      });
    }

    static async remove(id) {
      return this.destroy({
        where: {
          id: id,
        },
      });
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      const today = new Date().toISOString().split("T")[0];
      return await Todo.findAll({
        where: {
          [Sequelize.Op.and]: [
            { completed: { [Sequelize.Op.eq]: false } },
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
          [Sequelize.Op.and]: [
            { dueDate: { [Sequelize.Op.gt]: today } },
            { completed: { [Sequelize.Op.eq]: false } },
          ],
        },
      });
    }
    /** Removeed in level 9   and changed to setCompletionStatus
    markAsCompleted() {
      return this.update({ completed: true });
    }
      */

    setCompletionStatus() {
      return this.update({ completed: !this.completed });
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
