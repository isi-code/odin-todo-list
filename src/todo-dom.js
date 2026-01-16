import feather from 'feather-icons';

export class TodoListDomFactory {
    #navigation;
    #task;
    #mainSection;

    constructor() {
        this.#navigation = {
            newTask: {iconName:"file-plus", name:"New Task"},
            inbox: {iconName:"inbox", name:"Inbox"},
            today : {iconName:"sun", name:"Today"},
            upcoming: {iconName:"trending-up", name:"Upcoming"},
            completed : {iconName:"check-circle", name:"Completed"},
            projects : {iconName:"folder", name:"Projects"}
        };
        this.#task = {
            title: {tag:"h3"},
            description: {tag:"p"},
            dueDate: {tag:"div"},
            priority: {tag: "div"},
            status: {tag:"input", type:"checkbox"},
            project: {tag:"div"}
        };
        this.#mainSection = document.createElement("main");
    }

    get liMenus(){ return Array.from(document.querySelectorAll('[data-menu]')) }

    createTaskCard(task){
        const taskContainer = document.createElement("div");
        taskContainer.className = "taskContainer";

        for (const [key, { tag, type }] of Object.entries(this.#task)) {
            if(task[key] !== ""){
                const htmlElement = document.createElement(tag);
                if (key === "status") {
                    htmlElement.type = type;
                    const taskId = task.id ;
                    htmlElement.name = taskId;
                }
                else htmlElement.textContent = task[key];

                taskContainer.append(htmlElement);
            }
        }
        return taskContainer
    }

    createTodoList(tasks){
        const todoListSection = document.createElement("section");

        tasks.forEach(task => {
            const taskEl = this.createTaskCard(task);
            todoListSection.append(taskEl);
        });

        this.#mainSection.append(todoListSection);

        return this.#mainSection
    }

    createNavBar(){
        const header = document.createElement("header");

        const logoCont = document.createElement("div");
        logoCont.className = "logo-wrapper";
        const logoText = document.createElement("span");
        logoText.textContent = "Todo List"
        const logo = document.createElement("i");
        logo.setAttribute("data-feather","pen-tool");
        
        logoCont.append(logo,logoText);

        const nav = document.createElement("nav");
        const ul = document.createElement("ul");

        for ( const [key, {iconName, name}] of Object.entries(this.#navigation))
            ul.append(this.createMenu(key, iconName, name));
        
        nav.append(ul);
        header.append(logoCont, nav);
        return header
    }

    createMenu(key, iconName, name){
        const li = document.createElement("li");
        li.setAttribute("data-menu", key);

        const menuText = document.createElement("span");
        const icon = document.createElement("i");
        icon.setAttribute("data-feather", iconName);
        menuText.textContent = name;

        li.append(icon, menuText);
        return li;
    }

    removeMainContent(){
        while (this.#mainSection.lastChild) {
            this.#mainSection.removeChild(this.#mainSection.lastChild);
        }
    }
}

export class TodoListRender {
    constructor(container, domBuilder) {
        this.container = container;
        this.domBuilder = domBuilder;
    }

    renderNavBar(){ 
        const navBar = this.domBuilder.createNavBar();
        this.container.append(navBar);
        feather.replace();
    }

    renderAllTasks(tasks){ 
        const todoList = this.domBuilder.createTodoList(tasks);
        this.container.append(todoList);
    }

    renderUnfinishedTasks(tasks){ 
        const unfinishedTasks = tasks.filter( task => {return task.status === false});
        this.renderAllTasks(unfinishedTasks);
    }

    renderCompletedTasks(tasks){ 
        const finishedTasks = tasks.filter( task => {return task.status === true});
        this.renderAllTasks(finishedTasks);
    }
}