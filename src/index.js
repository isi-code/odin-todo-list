import { Task, TodoListHandler } from "./todo.js";
import { TodoListDom } from "./todo-dom.js"
import todoList from './todo-list.json'

const pageContContainer = document.getElementById("content");

class TodoListApp {
    constructor(container, todoListContent = '[]'){

        this.todoList = new TodoListHandler(todoListContent);
        this.taskDom = new TodoListDom(container,this.todoList.allTasks);
    }

    // createNewTask(title,desc, dueDate, priority, project = ""){
    //     todoList.addTask(new Task(title, desc, dueDate, priority, project));
    // }
}

//const testTask = new Task ("Dance Disco Music","Dance the night away","2026-01-06","Low");
new TodoListApp(pageContContainer, todoList);