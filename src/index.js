import { Task, TodoListHandler } from "./todo.js";
import { TaskDom } from "./todo-dom.js"
import todoList from './todo-list.json'

const pageContContainer = document.getElementById("content");

class TodoListApp {
    constructor(container, todoListContent = '[]'){
        this.pageContContainer = container; 
        this.todoList = new TodoListHandler(todoListContent);
        //this.taskDom = new TaskDom(this.todoList.allTasks);
    }
}

//const testTask = new Task ("Dance Disco Music","Dance the night away","2026-01-06","Low");
new TodoListApp(pageContContainer, JSON.stringify(todoList));