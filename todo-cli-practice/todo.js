const todoList = () => {
  let all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    // Write the date check condition here and return the array
    // of overdue items accordingly.
    return all.filter(
      (item) => item.dueDate < new Date().toISOString().slice(0, 10),
    );
  };

  const dueToday = () => {
    // Write the date check condition here and return the array
    // of todo items that are due today accordingly.
    return all.filter(
      (item) => item.dueDate === new Date().toISOString().slice(0, 10),
    );
  };

  const dueLater = () => {
    // Write the date check condition here and return the array
    // of todo items that are due later accordingly.
    return all.filter(
      (item) => item.dueDate > new Date().toISOString().slice(0, 10),
    );
  };

  const toDisplayableList = (list) => {
    // Format the To-Do list here, and return the output string
    // as per the format given above.
    return list.map(
      (item) =>
        `${item.completed ? "[x]" : "[ ]"} ${item.title} ${item.dueDate}`,
    );
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

module.exports = todoList;
