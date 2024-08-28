// __tests__/todo.js
/* eslint-disable no-undef */

// To fix the ReferenceError: TextEncoder is not defined
const { TextEncoder, TextDecoder } = require("util");
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

const db = require("../models");

describe("Todolist Test Suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("Should add new todo", async () => {
    const todoItemsCount = await db.Todo.count();
    await db.Todo.addTask({
      title: "Test todo",
      completed: false,
      dueDate: new Date(),
    });
    const newTodoItemsCount = await db.Todo.count();
    expect(newTodoItemsCount).toBe(todoItemsCount + 1);
  });

  // close the connection
  afterAll(async () => {
    await db.sequelize.close();
  });
});
