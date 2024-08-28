const { connect } = require("./connectDB.js");
const Todo = require("./TodoModel.js");

const createTodo = async () => {
  try {
    await connect();
    const todo = await Todo.addTask({
      title: "Third  Item",
      dueDate: new Date(),
      completed: false,
    });
    console.log(`Created todo with ID : ${todo.id}`);
  } catch (error) {
    console.error(error);
  }
};

const countItems = async () => {
  try {
    const totalCount = await Todo.count();
    console.log(`Found ${totalCount} item in the table`);
  } catch {
    console.error();
  }
};
const getAllTodos = async () => {
  try {
    const todos = await Todo.findAll({
      where: {
        completed: true,
      },
      order: [["id", "DESC"]],
    });
    const todoList = todos.map((todo) => todo.displayString()).join("\n");
    console.log(todoList);
  } catch {
    console.error();
  }
};

const getSingleTodo = async () => {
  try {
    const todo = await Todo.findOne({
      where: {
        completed: false,
      },
      order: [["id", "DESC"]],
    });
    console.log(todo.displayString());
  } catch {
    console.error();
  }
};
const updateItem = async (id) => {
  try {
    const todo = await Todo.update(
      { completed: true },
      {
        where: {
          id: id,
        },
      },
    );
    console.log(todo);
  } catch {
    console.error();
  }
};
const deleteItem = async (id) => {
  try {
    const deleteRowCount = await Todo.destroy({
      where: {
        id: id,
      },
    });
    console.log(`Deleted ${deleteRowCount} rows!`);
  } catch {
    console.error();
  }
};

// Immediately Invoked Function Expression (IIFE)  in a Anonymous way to mimic the Synchronise behaviour
(async () => {
  await createTodo();
  await getAllTodos();
  await getAllTodos();
  await getSingleTodo();
  await updateItem();
  await deleteItem();
  await countItems();
})();
