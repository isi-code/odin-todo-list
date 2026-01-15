import { Task, TodoListHandler } from "./todo.js";
import { TodoListDomFactory, TodoListRender } from "./todo-dom.js"
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
        this.domBuilder = new TodoListDomFactory();
        this.todoListRender = new TodoListRender(container, this.domBuilder);
        this.init();
    }   
    
    init(){
        this.todoListRender.renderNavBar();
        this.navEvents()
        this.todoListRender.renderUnfinishedTasks(this.todoList.allTasks);
    }

    inbox(){
        this.domBuilder.removeMainContent();
        this.todoListRender.renderUnfinishedTasks(this.todoList.allTasks);
    }

    completed(){
        this.domBuilder.removeMainContent();
        this.todoListRender.renderCompletedTasks(this.todoList.allTasks);
    }

    newTask(){
        console.log("It works!");
    }

    today(){
        console.log("It works!");
    }

    upcoming(){
        console.log("It works!");
    }

    navEvents(){
        const liMenus = this.domBuilder.liMenus;
        liMenus.forEach(li => {
            if (this[li.id]) li.addEventListener("click", () => {this[li.id]() } );
        });
    }
}

new TodoListApp(pageContContainer, todoList);