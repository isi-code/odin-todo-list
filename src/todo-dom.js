export class TodoListDom {
    constructor(mainContainer) {
        this.mainContainer = mainContainer;
        this.todoListSection = document.createElement("section");
        this.navSection = document.createElement("nav");
        this.taskTagMap = {
            title: {tag:"h3"},
            description: {tag:"p"},
            dueDate: {tag:"div"},
            priority: {tag: "div"},
            status: {tag:"input", type:"checkbox"},
            project: {tag:"div"}
        };
        this.navigationMap = ["Inbox","Today","Upcoming","Completed","Projects"]
    }

    renderAllTasks(tasks){ tasks.forEach(task => {this.renderTask(task)}) }

    renderTask(taskData){ this.mainContainer.append(this.createTodoListDom(taskData)) }

    renderUnfinishedTasks(tasks){
        const unfinishedTasks = tasks.filter( task => {return task.status === false});
        this.renderAllTasks(unfinishedTasks);
    }

    createTodoListDom (task){
        const taskContainer = document.createElement("div");
        taskContainer.setAttribute("class", "taskContainer");
        for (const [key, { tag, type }] of Object.entries(this.taskTagMap)) {
            const htmlElement = document.createElement(tag);
            
            if(type) htmlElement.type = type;

            if (key !== "status") htmlElement.textContent = task[key];

            taskContainer.append(htmlElement);
        }
        return taskContainer
    }
}