export class Task {
    constructor(title, desc, dueDate, priority, project = "") {
        this.title = title;
        this.description = desc;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = false;
        this.project = project;
    }
}

export class TodoListHandler {
    constructor(content, listName = "todo-list") {
        this.listName = listName;
        this.todoList = this.initTodoList(content);   
    }

    initTodoList(content){
        if(!(localStorage.key(this.listName) ?? false)) 
            localStorage.setItem(this.listName, content);

        return JSON.parse(localStorage.getItem(this.listName))
    }

    get allTasks() { return this.todoList }

    addTask(task) {
        this.todoList.push(task);
        localStorage.setItem(this.listName, JSON.stringify(this.todoList));
    }

    removeTask (taskIdx) {
        this.todoList.splice(taskIdx, 1);
        localStorage.setItem(this.listName, JSON.stringify(this.todoList));
    }

    updateTaskStatus(taskIdx, status) {
        this.todoList[taskIdx].status = (status === false) ? true : false;
        localStorage.setItem(this.listName, JSON.stringify(this.todoList));
    }

    editTaskInfo(taskIdx, field, info) {
        this.todoList[taskIdx][field] = info;
        localStorage.setItem(this.listName, JSON.stringify(this.todoList));
    }
}