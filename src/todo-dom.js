export class TodoListDomFactory {
    constructor() {
        this.navigationMap = {
            Inbox: {iconName:"inbox"},
            Today : {iconName:"sun"},
            Upcoming: {iconName:"trending-up"},
            Completed : {iconName:"check-circle"},
            Projects : {iconName:"folder"}
        };
        this.taskTagMap = {
            title: {tag:"h3"},
            description: {tag:"p"},
            dueDate: {tag:"div"},
            priority: {tag: "div"},
            status: {tag:"input", type:"checkbox"},
            project: {tag:"div"}
        };
        this.todoListSection = document.createElement("section");
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

    createTodoList(task){
        this.todoListSection.append(this.createTask(task));
        return this.todoListSection
    }

    createNavBar(){
        const header = document.createElement("header");
        const nav = document.createElement("nav");
        const ul = document.createElement("ul");

        for ( const [ key, {iconKey, iconName} ] of Object.entries(this.navigationMap)){
            const li = document.createElement("li");
            const span = document.createElement("span");
            const icon = document.createElement("i");
            icon.setAttribute("data-feather", iconName);
            span.textContent = key;
            li.append(icon, span);
            ul.append(li);
        }

        nav.append(ul)
        header.append(nav);
        return header
    }
}

export class TodoListRender {
    constructor(mainContainer, domBuilder) {
        this.mainContainer = mainContainer;
        this.domBuilder = domBuilder;
    }

    renderNavBar(){ 
        const navBar = this.domBuilder.createNavBar();
        this.mainContainer.append(navBar);
    }

    renderAllTasks(tasks){ tasks.forEach(task => {this.renderTask(task)}) }

    renderTask(taskData){ 
        const task = this.domBuilder.createTodoList(taskData);
        this.mainContainer.append(task)
    }

    renderUnfinishedTasks(tasks){
        const unfinishedTasks = tasks.filter( task => {return task.status === false});
        this.renderAllTasks(unfinishedTasks);
    }
}