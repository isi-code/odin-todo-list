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
        this.currentPage = "inbox";
        this.init();
    }   
    
    init(){
        this.navBar();
        this.inbox();
        this.menuHighlight();
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
        const xBtn = dialog.querySelector(".xBtn");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const inputs = Array.from(form.elements).filter(elem => elem.name);
            const values = {};

            for(let i = 0; i < inputs.length; i++) values[inputs[i].name] = inputs[i].value;

            const newTask = new Task(values.title, values.description, values.dueDate, values.priority, values.project);
            this.todoList.addTask(newTask);
            dialog.remove();
            
        });
        xBtn.addEventListener("click", () => { dialog.remove(); });
    }

    today(){
        this.refresh();
        this.todoListRender.todayTasks(this.todoList.allTasks);
    }

    upcoming(){
        this.refresh();
        this.todoListRender.upcomingTasks(this.todoList.allTasks);
    }

    navBar(){
        this.todoListRender.navBar();
        this.navEvents();
    }

    navEvents(){
        const liMenus = this.domBuilder.liMenus;        
        liMenus.forEach(li => {
        if (this[li.dataset.menu]) {
            li.addEventListener("click", () => { 
                this[li.dataset.menu]();
                this.currentPage = li.dataset.menu;
                this.menuHighlight();
            });               
        }});
    }

    menuHighlight(){
    const liMenus = this.domBuilder.liMenus;
    for (let li of liMenus){
        li.classList.remove("active");
        if(li.dataset.menu === this.currentPage) li.classList.add("active");
        }
    }
}

new TodoListApp(pageContContainer, todoList);