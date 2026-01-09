class DOMBuilderHelper {
    constructor(tagContainer, className = false){
        this.mainTag = this.createTag(tagContainer, className);
    }

    //get mainTag() { return this.mainTag }

    //set mainTag(tag) { this.mainTag = tag; }

    createTag(tag, className){
        const newTag = document.createElement(tag);
        if (className && typeof className === "string") newTag.setAttribute("class", className);
        return newTag
    }

    createInputTag(type, className = false){
        const newInputTag = document.createElement("input", className);
        newInputTag.type = type;
        return newInputTag
    }
}

export class TodoListDom {
    constructor(mainContainer, tasks) {
        this.mainContainer = mainContainer;
        this.todoListSection = new DOMBuilderHelper("section", "tasks");
        this.renderAllUnfinishedTasks(tasks);
    }

    renderAllUnfinishedTasks(tasks){
        tasks.forEach( (task) => { if (task.status === false){ this.todoListDom(task); } });
        this.mainContainer.append(this.todoListSection.mainTag);
    }

    todoListDom(task){
        const taskContainer = this.todoListSection.createTag("div","task");
        
        const taskInfoWrapper = this.todoListSection.createTag("div","taskContent");
        const title = this.todoListSection.createTag("h3");
        title.textContent = task.title;
        
        const description = this.todoListSection.createTag("p");
        description.textContent = task.description;

        const dueDateSpan = this.todoListSection.createTag("p");
        dueDateSpan.textContent = task.dueDate;
        
        //const priorityContainer = this.todoListSection.createTag("p");
        //const priorityContent = this.todoListSection.createTag("span", "");
        //priorityContainer.append(priorityContent);
        
        const checkbox = this.todoListSection.createInputTag("checkbox");

        taskInfoWrapper.append(title,description,dueDateSpan);
        
        taskContainer.append(checkbox,taskInfoWrapper);

        this.todoListSection.mainTag.append(taskContainer);
    }
}