import "./style.css";
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
        this.todoListRender.navBar();
        this.navEvents();
        this.todoListRender.unfinishedTasks(this.todoList.allTasks);
    }

    inbox(){
        this.refresh();
        this.todoListRender.unfinishedTasks(this.todoList.allTasks);
    }

    refresh(){ if(this.domBuilder.mainSectionHasContent) this.domBuilder.removeMainContent() }

    completed(){
        this.refresh();
        this.todoListRender.completedTasks(this.todoList.allTasks);
    }

    newTask(){
        const dialog = this.todoListRender.addTaskForm();
        const form = dialog.querySelector("form");
        console.log(form.elements);
        form.addEventListener("submit", (e)=>{
            e.preventDefault();
            
            //const newTask = new Task();
            //this.todoList.addTask(newTask);
            dialog.remove();
        });
    }

    today(){
        this.refresh();
        console.log("It works!");
    }

    upcoming(){
        this.refresh();
        console.log("It works!");
    }

    navEvents(){
        const liMenus = this.domBuilder.liMenus;        
        liMenus.forEach(li => {
            if (this[li.dataset.menu]) {
                li.addEventListener("click", () => { this[li.dataset.menu]() });
            };
        });
    }
}

new TodoListApp(pageContContainer, todoList);