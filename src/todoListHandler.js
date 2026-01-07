export class todoListHandler {
    constructor(listName = "todo-list", content = '[]') {
        this.listName = listName;
        this.tasks = JSON.parse(localStorage.getItem(this.listName)) ?? false;
        if (!this.tasks) {
            localStorage.setItem(listName, content);
            this.tasks = JSON.parse(localStorage.getItem(listName));
        }
    }

    get todoList() { return this.tasks }

    addTask (task) {
        this.tasks.push(task);
        localStorage.setItem(this.listName, JSON.stringify(this.todoList));
    }    
}