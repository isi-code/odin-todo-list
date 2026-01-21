import {parseISO, format} from 'date-fns';

export class Task {
    constructor(title, description, dueDate, priority, project = "") {
        this.createTask(title, description, this.formatDate(dueDate), priority, project);
    }

    formatDate(date){
        const dueDate = parseISO(date);
        return format(dueDate,'yyyy-MM-dd, p');
    }

    createTask(title, description, dueDate, priority, project){
        const task = {};
        const id = crypto.randomUUID();
        task[id] = { title, description, dueDate, priority, project };
        return task
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

    get allTasks() { return {...this.#todoList} }

    #save(){ localStorage.setItem(this.#listName, JSON.stringify(this.#todoList)); }

    addTask(taskId, task) {
        this.#todoList[taskId] = task;
        this.#save();
    }

    removeTask (taskId) {
        delete this.#todoList[taskId];
        this.#save();
    }

    updateTaskStatus(taskId, status) {
        this.#todoList[taskId].status = status;
        this.#save();
    }
}