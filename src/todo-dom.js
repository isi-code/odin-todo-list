export class TodoListDom {
    constructor(mainContainer) {
        this.mainContainer = mainContainer;
        this.navSection = document.createElement("header");
        this.navigationMap = [
            "Inbox",
            "Today",
            "Upcoming",
            "Completed",
            "Projects"
        ];
        this.renderNavBar();
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

    renderAllTasks(tasks){ tasks.forEach(task => {this.renderTask(task)}) }

    renderTask(taskData){ this.mainContainer.append(this.createTodoListDom(taskData)) }

    renderUnfinishedTasks(tasks){
        const unfinishedTasks = tasks.filter( task => {return task.status === false});
        this.renderAllTasks(unfinishedTasks);
    }

    renderNavBar(){ 
        this.createNavBarDom();
        this.mainContainer.append(this.navSection);
    }

    createTodoListDom (task){
        const taskContainer = document.createElement("div");
        taskContainer.setAttribute("class", "taskContainer");

        for (const [key, { tag, type }] of Object.entries(this.taskTagMap)) {
            if(task[key] !== ""){
                const htmlElement = document.createElement(tag);

                if(type) htmlElement.type = type;

                if (key !== "status") htmlElement.textContent = task[key];

                taskContainer.append(htmlElement);
            }
        }
        return taskContainer
    }

    createNavBarDom(){
        const nav = document.createElement("nav");
        const ul = document.createElement("ul");

        this.navigationMap.forEach( textMenu => {
            const li = document.createElement("li");
            const icon = document.createElement("span");
            icon.className = "";
            li.textContent = textMenu;
            li.append(icon);
            ul.append(li);
        });

        nav.append(ul)
        this.navSection.append(nav);
    }
}