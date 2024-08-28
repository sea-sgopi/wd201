// assert.js

let toggleTdoCompletedStatus = (todoItem) => {
  todoItem.completed = !todoItem.completed;
  return todoItem;
};

let testToggleCompletion = () => {
  let item = {
    title: "Buy Milk",
    completed: false,
  };
  item = toggleTdoCompletedStatus(item);

  console.assert(item.completed === true, "Todo item should be completed");
};

testToggleCompletion();
