import {parseISO, format} from 'date-fns';

export class Task {
    constructor(title, description, dueDate, priority, project = "") {
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
        this.#todoList[taskId] = task;
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