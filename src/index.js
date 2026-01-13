import { Task, TodoListHandler } from "./todo.js";
import { TodoListDom } from "./todo-dom.js"
import todoList from './todo-list.json'

const pageContContainer = document.getElementById("content");

/** This class purpose is to orchestrate all other JS classes needed in the todo-list.*/
class TodoListApp {
    /**
     * Creates intances for other classes 
     * 
     * @param {HTMLElement} container This is where all HTML generated should point to.
     * @param {string} todoListContent This is an optional parameter to add content when creating the todo list for the first time.
     */
    constructor(container, todoListContent = '[]'){
        this.todoList = new TodoListHandler(todoListContent);
        this.taskDom = new TodoListDom(container);
        this.taskDom.renderUnfinishedTasks(this.todoList.allTasks);
    }

    // createNewTask(title,desc, dueDate, priority, project = ""){
    //     todoList.addTask(new Task(title, desc, dueDate, priority, project));
    // }
}

new TodoListApp(pageContContainer, todoList);