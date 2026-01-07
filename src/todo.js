export class Task {
    constructor(title, desc, dueDate, priority, project = "") {
        this.title = title;
        this.description = desc;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = false;
        this.project = project;
    }
}