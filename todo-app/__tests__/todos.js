/* eslint-disable no-unused-vars */
const request = require("supertest");

const db = require("../models/index");
const app = require("../app");
const cheerio = require("cheerio");
const passport = require("passport");

let server, agent;
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  let csrfToken = extractCsrfToken(res);
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
};
describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(31000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Sign up", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "test",
      lastName: "User A",
      email: "user@test.com",
      password: "password",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });

  test("Should redirect to /todos page when a logged in user visits root url", async () => {
    await agent
      .post("/session")
      .send({ email: "user@test.com", password: "password" });

    const response = await agent.get("/");
    expect(response.status).toBe(302);
    expect(response.header.location).toBe("/todos");
  });

  test("Sign Out", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  });

  test("Creates a new todo", async () => {
    const agent = request.agent(server);
    await login(agent, "user@test.com", "password");
    const res = await agent.get("/todos");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Marks a todo with the given ID as complete", async () => {
    const agent = request.agent(server);
    await login(agent, "user@test.com", "password");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodoResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodoResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday.length;
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        _csrf: csrfToken,
      });
    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  test("Deletes a todo with the given ID", async () => {
    const agent = request.agent(server);
    await login(agent, "user@test.com", "password");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy Bread",
      dueDate: new Date().toISOString(),
      completed: true,
      _csrf: csrfToken,
    });

    const groupedTodoResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodoResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday.length;
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const deleteResponse = await agent.delete(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
    });
    expect(deleteResponse.statusCode).toBe(200);

    const checkDeleteResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedCheckDeleteResponse = JSON.parse(checkDeleteResponse.text);
    const deleteTodo = parsedCheckDeleteResponse.dueToday.find(
      (todo) => todo.id === latestTodo,
    );
    expect(deleteTodo).toBeUndefined();
  });

  test("Marks a todo with the given ID as Incomplete", async () => {
    const agent = request.agent(server);
    await login(agent, "user@test.com", "password");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy Internet",
      dueDate: new Date().toISOString().split("T")[0],
      completed: true,
      _csrf: csrfToken,
    });

    const groupedTodoResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodoResponse.text);
    const dueTodayCount = parsedGroupedResponse.completed.length;
    const latestTodo = parsedGroupedResponse.completed[dueTodayCount - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        _csrf: csrfToken,
      });
    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(false);
  });

  test("should render index if the user is not logged in", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Todo Application"); // Adjust based on your actual index content
  });

  test("Should be able to add a todo item and logout", async () => {
    await login(agent, "user@test.com", "password");
    const res = await agent.get("/todos");
    const csrfToken = extractCsrfToken(res);

    const addTodoResponse = await agent.post("/todos").send({
      title: "Test Todo",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    expect(addTodoResponse.statusCode).toBe(302);

    const todosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const todos = JSON.parse(todosResponse.text);
    const addedTodo = todos.dueToday.find((todo) => todo.title === "Test Todo");
    expect(addedTodo).toBeDefined();

    const logoutResponse = await agent.get("/signout");
    expect(logoutResponse.statusCode).toBe(302);
    const todosAfterLogoutResponse = await agent.get("/todos");
    expect(todosAfterLogoutResponse.statusCode).toBe(302);
    expect(todosAfterLogoutResponse.header.location).toBe("/login");
  });

  test("should be able to sign up and not login with invalid credentials", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    const signupResponse = await agent.post("/users").send({
      firstName: "Test",
      lastName: "User",
      email: "user@test.com",
      password: "password",
      _csrf: csrfToken,
    });

    expect(signupResponse.statusCode).toBe(302);
    res = await agent.get("/login");
    const loginCsrfToken = extractCsrfToken(res);
    const invalidLoginResponse = await agent.post("/session").send({
      email: "user@test.com",
      password: "wrongpassword",
      _csrf: loginCsrfToken,
    });

    expect(invalidLoginResponse.statusCode).toBe(302);
    expect(invalidLoginResponse.header.location).toBe("/login");
    const todoResponse = await agent.get("/todos");
    expect(todoResponse.statusCode).toBe(302);
  });

  test("Should not create a an account with empty email", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(request);
    const signupResponse = await agent.post("/users").send({
      firstName: "Test",
      lastName: "user",
      email: "",
      password: "abx",
      _csrf: csrfToken,
    });

    expect(signupResponse.statusCode).toBe(400);
    expect(signupResponse.text).toContain("Email is required");
  });

  test("Should noot create a account with empty password", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    const signupResponse = await agent.post("/users").send({
      firstName: "Test",
      lastName: "user",
      email: "user@test.com",
      password: "",
      _csrf: csrfToken,
    });
    expect(signupResponse.statusCode).toBe(400);

    expect(signupResponse.text).toContain("Password is required");
  });

  test("Should not create a account with empty first name", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    const signupResponse = await agent.post("/users").send({
      firstName: "",
      lastName: "User",
      email: "user@test.com",
      password: "password",
      _csrf: csrfToken,
    });

    expect(signupResponse.statusCode).toBe(400);
    expect(signupResponse.text).toContain("First name is required");
  });
});
