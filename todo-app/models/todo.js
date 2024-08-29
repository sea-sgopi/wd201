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
    static associate(models) {
      Todo.belongsTo(models.User,{
        foreignKey: 'userId'
      })
      // define association here
    }

    static addTodo({ title, dueDate, completed = false , userId}) {
      return this.create({ title: title, dueDate: dueDate, completed , userId});
    }

    static async overdue(userId) {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      return await Todo.findAll({
        where: {
          dueDate: {
            [Sequelize.Op.lt]: new Date(),
          },
          userId,
          completed : false
        },
      });
    }

    static async completed(userId) {
      return this.findAll({
        where: {
          completed: true,
          userId
        }, 
      });
    }

    static async remove(id,userId) {
      return this.destroy({
        where: {
          id, // id: id,
          userId
        },
      });
    }

    static async dueToday(userId) {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      return await Todo.findAll({
        where: {
          dueDate: { 
            [Sequelize.Op.eq]: new Date()
          } ,
          userId,
          completed: false,
        },
      });
    }

    static async dueLater(userId) {
      return await Todo.findAll({
        where: {
          dueDate: { 
            [Sequelize.Op.gt]: new Date()
          },
          userId,
          completed: false
        },
      });
    }


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
