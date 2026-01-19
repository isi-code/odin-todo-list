import {parseISO, format} from 'date-fns';

export class Task {
    constructor(title, description, dueDate, priority, project = "") {
        this.id = crypto.randomUUID();
        this.title = title;
        this.description = description;
        this.dueDate = this.formatDate(dueDate);
        this.priority = priority;
        this.status = false;
        this.project = project;
    }

    formatDate(date){
        const dueDate = parseISO(date);
        return format(dueDate,'yyyy-MM-dd, p');
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
        this.#todoList[taskIdx].status = status;
        this.#save();
    }
}