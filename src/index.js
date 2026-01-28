import "./css/default-and-nav.css";
import "./css/body.css";
import { Task, TodoListStorage } from "./todo.js";
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
    constructor(container, todoListContent = '{}'){
        this.todoList = new TodoListStorage(todoListContent);
        this.domBuilder = new TodoListDomFactory();
        this.todoListRender = new TodoListRender(container, this.domBuilder);
        this.currentPage = null;
        this.init();
    }   
    
    init(){
        this.currentPage = "inbox";
        this.navBar();
        this.inbox();
    }

    inbox(){ 
        const todoList = this.todoListRender.unfinishedTasks(this.todoList.allTasks);
        this.taskEvents(todoList);
    }

    completed(){ 
        const todoList = this.todoListRender.completedTasks(this.todoList.allTasks);
        this.taskEvents(todoList);
    }

    newTask(){
        const dialog = this.todoListRender.addTaskForm();
        dialog.showModal();
        const form = dialog.querySelector("form");
        const xBtn = dialog.querySelector(".xBtn");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const inputs = Array.from(form.elements).filter(elem => elem.name);
            const values = {};

            for(let i = 0; i < inputs.length; i++) values[inputs[i].name] = inputs[i].value;
            
            const taskId = crypto.randomUUID();
            const newTask = new Task(values.title, values.description, values.dueDate, values.priority, values.project);
            this.todoList.addTask(taskId, newTask);

            dialog.remove();
            this.refreshUI();
        });
        xBtn.addEventListener("click", () => { dialog.remove(); });
    }

    today(){ 
        const todoList = this.todoListRender.todayTasks(this.todoList.allTasks);
        this.taskEvents(todoList);
    }

    upcoming(){ 
        const todoList = this.todoListRender.upcomingTasks(this.todoList.allTasks);
        this.taskEvents(todoList);
    }

    projects(){
        const projects = this.todoListRender.projectNameList(this.todoList.allTasks);
        const projectCategory = projects.querySelectorAll(".project");
        this.tasksByProject(projectCategory);
    }

    tasksByProject(projects){
        for (let proj of projects){
            proj.addEventListener("click", (e) => {
                const taskProject = e.target.closest(".project").dataset.project;
                if(taskProject){ 
                    this.todoListRender.removeMainContent();
                    const filteredTasks = this.todoListRender.projectTasks(this.todoList.allTasks, taskProject);
                    this.taskEvents(filteredTasks);
                }
            });
        }
    }

    taskEvents(todoList){
        const tasks = todoList.querySelectorAll(".taskContainer");
        
        tasks.forEach(task => {
            task.addEventListener("click", (e) => {
                const el = e.target;
                if (el.className === "detailsBtn") console.log("It works");
                else if(el.className === "removeBtn") this.removeTaskBtn(el.dataset.taskId);
                else if(el.name === "checkDone") this.markTaskDone(el.dataset.taskId);
                else if(el.className === "editBtn") this.editTaskBtn(el.dataset.taskId);
            })
        });
    }

    markTaskDone(taskId){
        this.todoList.updateTaskStatus(taskId, true);
        this.refreshUI();    
    }

    removeTaskBtn(taskId) {
        this.todoList.removeTask(taskId);
        this.refreshUI();
    }

    editTaskBtn(taskId){
        this.todoListRender.removeMainContent();
        const form = this.todoListRender.editTaskForm(this.todoList.getSingleTask(taskId));
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const inputs = Array.from(e.target.elements);
            inputs.forEach((input)=>{
                const field = input.name;
                const value = input.value;
                this.todoList.editTask(taskId, field, value);
            });

            this.refreshUI();            
        })
    }

    navBar(){
        const nav = this.todoListRender.navBar();
        const liMenus = nav.querySelectorAll("li"); 
        this.navEvents(liMenus);
        this.menuHighlight(liMenus);
    }

    navEvents(liMenus){
        liMenus.forEach(li => {
        if (this[li.dataset.menu]) {
            li.addEventListener("click", () => {
                if (li.dataset.menu !== "newTask"){
                    this.todoListRender.removeMainContent();
                    this[li.dataset.menu]();
                    this.currentPage = li.dataset.menu;
                    this.menuHighlight(liMenus);
                } else {
                    this[li.dataset.menu]();
                } 
            });               
        }});
    }

    menuHighlight(liMenus){
    for (let li of liMenus){
        li.classList.remove("active");
        if(li.dataset.menu === this.currentPage) li.classList.add("active");
        }
    }

    refreshUI() {
        this.todoListRender.removeMainContent();
        this[this.currentPage](this.todoList.allTasks);
    }
}

new TodoListApp(pageContContainer, todoList);
