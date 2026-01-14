import feather from 'feather-icons';

export class TodoListDomFactory {
    constructor() {
        this.navigationMap = {
            newTask: {iconName:"file-plus", name:"New Task"},
            inbox: {iconName:"inbox", name:"Inbox"},
            today : {iconName:"sun", name:"Today"},
            upcoming: {iconName:"trending-up", name:"Upcoming"},
            completed : {iconName:"check-circle", name:"Completed"},
            projects : {iconName:"folder", name:"Projects"}
        };
        this.taskTagMap = {
            title: {tag:"h3"},
            description: {tag:"p"},
            dueDate: {tag:"div"},
            priority: {tag: "div"},
            status: {tag:"input", type:"checkbox"},
            project: {tag:"div"}
        };
        this.mainSection = document.createElement("main");
    }

    createTask(task){
        const taskContainer = document.createElement("div");
        taskContainer.setAttribute("class", "taskContainer");

        for (const [key, { tag, type }] of Object.entries(this.taskTagMap)) {
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
            const taskEl = this.createTask(task);
            todoListSection.append(taskEl);
        });

        this.mainSection.append(todoListSection);

        return this.mainSection
    }

    createNavBar(){
        const header = document.createElement("header");
        const nav = document.createElement("nav");
        const ul = document.createElement("ul");

        for ( const [ key, {iconName, name } ] of Object.entries(this.navigationMap)){
            const li = document.createElement("li");

            const span = document.createElement("span");
            const icon = document.createElement("i");
            icon.setAttribute("data-feather", iconName);
            span.textContent = name;
            li.append(icon, span);
            ul.append(li);
        }

        nav.append(ul)
        header.append(nav);
        return header
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
}