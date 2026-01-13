export class Task {
    constructor(title, desc, dueDate, priority, project = "") {
        this.id = crypto.randomUUID();
        this.title = title;
        this.description = desc;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = false;
        this.project = project;
    }
}

export class TodoListHandler {
    #listName;
    #todoList;

    constructor(content, listName = "todo-list") {
        this.#listName = listName;
        this.#todoList = this.#initTodoList(content);
    }

    #initTodoList(content){
        let todoList = JSON.parse(localStorage.getItem(this.#listName));
        if (todoList === null) {
            this.#save(content);
            return JSON.parse(localStorage.getItem(this.#listName));
        }
        return todoList
    }

    get allTasks() { return [...this.#todoList] }

    #save(content = this.#todoList){ localStorage.setItem(this.#listName, JSON.stringify(content)); }

    addTask(task) {
        this.#todoList.push(task);
        this.#save();
    }

    removeTask (taskIdx) {
        this.#todoList.splice(taskIdx, 1);
        this.#save();
    }

    updateTaskStatus(taskIdx, status) {
        this.#todoList[taskIdx].status = (status === false) ? true : false;
        this.#save();
    }

    editTaskInfo(taskIdx, field, info) {
        this.#todoList[taskIdx][field] = info;
        this.#save();
    }
}