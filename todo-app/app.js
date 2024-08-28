/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const path = require("path");
var csrf = require("tiny-csrf");
var cookieParser = require("cookie-parser");
// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("This_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

app.set("view engine", "ejs");

app.get("/", async (request, response) => {
  const allTodos = await Todo.getTodos();
  const overdue = await Todo.overdue();
  const dueToday = await Todo.dueToday();
  const dueLater = await Todo.dueLater();
  const completed = await Todo.completed();
  if (request.accepts("html")) {
    response.render("index", {
      overdue,
      dueLater,
      dueToday,
      completed,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({
      overdue,
      dueLater,
      dueToday,
      completed,
    });
  }
});

app.get("/todos", async (request, response) => {
  try {
    const overdue = await Todo.overdue();
    const dueToday = await Todo.dueToday();
    const dueLater = await Todo.dueLater();
    const completed = await Todo.completed();

    if (request.accepts("html")) {
      response.render("index", {
        overdue,
        dueLater,
        dueToday,
        completed,
      });
    } else {
      response.json({
        overdue,
        dueLater,
        dueToday,
        completed,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    response.status(500).send("Internal Server Error");
  }
});

app.use(express.static(path.join(__dirname, "public")));

// app.get("/todos", async (request, response) => {
//   console.log("Processing list of all Todos ...");
//   // FILL IN YOUR CODE HERE

//   // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
//   // Then, we have to respond with all Todos, like:
//   // response.send(todos)
//   try {
//     // Query the database for all todos
//     const todos = await Todo.findAll();
//     // Respond with the list of todos
//     response.json(todos);
//   } catch (error) {
//     console.log(error);
//     response.status(422).json(error);
//   }
// });

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    if (!todo) {
      return response.status(404).json({ message: "Todo not found" });
    }
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addTodo(request.body);
    // return response.json(todo);
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.setCompletionStatus();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async (request, response) => {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  // FILL IN YOUR CODE HERE

  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
  // response.send(true)

  /**  My Implementation Logic
  try {
    const todo = await Todo.findByPk(request.params.id);
    if (!todo) {
      return response.send(false);
    }
    await todo.destroy();

    response.send(true);
  } catch (error) {
    console.log(error);
    response.status(422).json(error);
  }
    */

  // Tutorial
  try {
    await Todo.remove(request.params.id);
    return response.json({ success: true });
  } catch (error) {
    return response.status(422).json(error);
  }
});

module.exports = app;
