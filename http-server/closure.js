// todo list

const totdoList = () => {
    all =[];
    const add = (todoTask) => {
        all.push(all);
    }
    const markAsComplete = (index) => {
        all[index].completed = true;
        console.log(all);
    }
    return { all, add, markAsComplete };
}

const todos = totdoList()

todos.all

todos.add ({title: "i need the sjncksk", duedate: "05-05-2024", completed: false});
todos.add ({title: " sjncksk", duedate: "05-05-2024", completed: false});


todos.markAsComplete(1);

todos.all