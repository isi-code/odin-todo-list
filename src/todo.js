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
        const todoList = localStorage.getItem(this.#listName);
        
        if (todoList === null) { 
            this.#save(content); 
            return content; 
        }
        
        return JSON.parse(todoList);
    }

    get allTasks() { return Object.entries(this.#todoList); }

    #save(content = this.#todoList){ localStorage.setItem(this.#listName, JSON.stringify(content)); }

    addTask(taskId, task) { 
        if (taskId in this.#todoList) this.#todoList[taskId] = task;
        this.#save();
    }

    removeTask (taskId) { 
        if (taskId in this.#todoList) delete this.#todoList[taskId];
        this.#save();
    }

    updateTaskStatus(taskId, status) { 
        if (taskId in this.#todoList) this.#todoList[taskId].status = status;
        this.#save();
    }
}