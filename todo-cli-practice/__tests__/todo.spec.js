const todoList = require("../todo");

const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("TodoList Test Suite", () => {
  beforeEach(() => {
    // Clear all todos before each test
    all.length = 0;
  });

  test("should create a new todo", () => {
    const todoItemCount = all.length;
    add({
      title: "New Test Todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10), // Today's date
    });
    expect(all.length).toBe(todoItemCount + 1);
    expect(all[all.length - 1].title).toBe("New Test Todo");
  });

  test("should mark a todo as complete", () => {
    const todoID = 0; // Assume the ID of the todo to be marked as complete
    add({
      title: "Mark Complete Todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10), // Today's date
    });
    expect(all[todoID].completed).toBe(false);
    markAsComplete(todoID);
    expect(all[todoID].completed).toBe(true);
  });

  test("should retrieve overdue items", () => {
    const overdueDate = new Date();
    overdueDate.setDate(overdueDate.getDate() - 1); // Yesterday
    add({
      title: "Submit assignment",
      completed: false,
      dueDate: overdueDate.toISOString().slice(0, 10),
    });
    const overdueItems = overdue();
    expect(overdueItems.length).toBeGreaterThan(0);
    expect(overdueItems[0].title).toBe("Submit assignment");
  });

  test("should retrieve today items", () => {
    const todayDate = new Date().toISOString().slice(0, 10); // Today's date
    add({
      title: "Pay rent",
      completed: true,
      dueDate: todayDate,
    });
    add({
      title: "Service Vehicle",
      completed: false,
      dueDate: todayDate,
    });
    const todayItems = dueToday();
    expect(todayItems.length).toBeGreaterThan(0);
    expect(todayItems[0].title).toBe("Pay rent");
    expect(todayItems[1].title).toBe("Service Vehicle");
  });

  test("should retrieve due later items", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1); // Tomorrow
    add({
      title: "File taxes",
      completed: false,
      dueDate: futureDate.toISOString().slice(0, 10),
    });
    add({
      title: "Pay electric bill",
      completed: false,
      dueDate: futureDate.toISOString().slice(0, 10),
    });
    const laterItems = dueLater();
    expect(laterItems.length).toBeGreaterThan(0);
    expect(laterItems[0].title).toBe("File taxes");
    expect(laterItems[1].title).toBe("Pay electric bill");
  });
});
