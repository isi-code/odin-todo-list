import feather from 'feather-icons';
import {parse, differenceInHours, startOfDay, endOfDay, isWithinInterval} from 'date-fns';

export class TodoListDomFactory {
  #navigation;
  #task;

  constructor() {
    this.#navigation = {
    newTask: { iconName: "file-plus", name: "New Task" },
    inbox: { iconName: "inbox", name: "Inbox" },
    today: { iconName: "sun", name: "Today" },
    upcoming: { iconName: "trending-up", name: "Upcoming" },
    completed: { iconName: "check-circle", name: "Completed" },
    projects: { iconName: "folder", name: "Projects" },
    };

    this.#task = {
    title: { mainTag: "h3", label: "Title", inputType: "text" },
    description: {
        mainTag: "p",
        label: "Description",
        inputType: "textarea",
    },
    dueDate: { mainTag: "div", label: "Due date", inputType: "datetime-local" },
    priority: {
        mainTag: "div",
        label: "Priority",
        inputType: "select",
        options: ["Low", "Medium", "High"],
    },
    project: { mainTag: "div", label: "Project", inputType: "text" },
    status: {
        mainTag: "input",
        label: "Is it done?",
        inputType: "checkbox",
    }
    };
  }

  createTaskCard(task) {
    const taskContainer = document.createElement("div");
    taskContainer.classList = "taskContainer";

    const [id, taskInfo] = task;

    for (const [key, { mainTag, inputType }] of Object.entries(this.#task)) {
      // Skip empty fields to keep the UI clean
      if (taskInfo[key] !== "") {
        const htmlElement = document.createElement(mainTag);
        // Special handling for the checkbox/status input
        if (key === "status") {
          htmlElement.type = inputType;
          htmlElement.name = 'checkDone';
          htmlElement.checked = taskInfo[key];
          htmlElement.disabled = taskInfo[key];
          htmlElement.dataset.taskId = id;
          taskContainer.append(htmlElement);
        }
        else {
          htmlElement.textContent = taskInfo[key];
          htmlElement.classList = key;
        }
        taskContainer.append(htmlElement);
      }
    }

    const form =  document.createElement("form");
    form.dataset.taskId = id;
    form.classList = "removeTask";

    const removeBtn =  document.createElement("button");
    removeBtn.textContent = "Remove Task";

    form.append(removeBtn);

    taskContainer.append(form);
    return taskContainer;
  }

  createTodoList(tasks) {
    const todoListSection = document.createElement("section");
    todoListSection.classList = "todo-list";

    for (let task of tasks) {
      const taskEl = this.createTaskCard(task);
      todoListSection.append(taskEl);
    }

    return todoListSection
  }

  createNavBar() {
    const header = document.createElement("header");

    const logoCont = document.createElement("div");
    logoCont.classList = "logo-wrapper";
    const logoText = document.createElement("span");
    logoText.textContent = "Todo List";
    const logo = document.createElement("i");
    logo.setAttribute("data-feather", "pen-tool");

    logoCont.append(logo, logoText);

    const nav = document.createElement("nav");
    const ul = document.createElement("ul");

    for (const [key, { iconName, name }] of Object.entries(this.#navigation))
      ul.append(this.createMenu(key, iconName, name));

    nav.append(ul);
    header.append(logoCont, nav);
    return header;
  }

  createMainContainer(content = null){ 
    const main = document.createElement("main");
    if (content) main.append(content);
    return main; 
  }

  createProjectList(projectName){
    const todoListSection = document.createElement("section");
    todoListSection.classList = "todo-list";

    for (let task of projectName) {
      const taskEl = this.createProjectCard(task);
      todoListSection.append(taskEl);
    }

    return todoListSection
  }

  createMenu(key, iconName, name) {
    const li = document.createElement("li");
    li.setAttribute("data-menu", key);

    const menuText = document.createElement("span");
    const icon = document.createElement("i");
    icon.setAttribute("data-feather", iconName);
    menuText.textContent = name;

    li.append(icon, menuText);
    return li;
  }

  createAddTaskForm() {
    const dialog = document.createElement("dialog");
    const xBtn = document.createElement("div");
    xBtn.classList = "xBtn";
    xBtn.setAttribute("data-feather", 'x');
    const form = document.createElement("form");

    for (const [key, { label, inputType }] of Object.entries(this.#task)) {
        //This method return label and input
        if(key.toLowerCase() !== "status") form.append(...this.createInputs(key, label, inputType));
    }

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Add Task";

    form.append(submitBtn);
    dialog.append(form, xBtn);

    return dialog
  }

  createInputs(key, label, inputType){
    const labelTag = document.createElement("label");
    labelTag.textContent = label;
    labelTag.setAttribute("for", key);

    let inputTag;
    switch (inputType) {
    case "textarea":
        inputTag = document.createElement(inputType);
        break;

    case "select":
        inputTag = document.createElement(inputType);
        const options = this.#task[key].options;
        const optionTags = options.map(option => {
            const optionTag = document.createElement("option");
            optionTag.value = option;
            optionTag.textContent = option;

            return optionTag
        });
        inputTag.append(...optionTags);
        break;

    default:
        inputTag = document.createElement("input");
        inputTag.type = inputType;
        break;
    }
    inputTag.id = key;
    inputTag.name = key;

    return [labelTag, inputTag]
  }

}

export class TodoListRender {
  constructor(container, domBuilder) {
    this.container = container;
    this.domBuilder = domBuilder;
  }

    render(element){ this.container.append(element); }

    navBar(){
        const header = this.domBuilder.createNavBar();
        this.render(header);
        feather.replace();
        const nav = header.querySelector("nav");
        return nav
    }

    todoList(tasks){
        const todoList = this.domBuilder.createTodoList(tasks);
        
        let main = this.container.querySelector("main");
        if(!main) main = this.domBuilder.createMainContainer();

        main.append(todoList);
        this.render(main);
        return todoList
    }

    unfinishedTasks(tasks){
      const unfinishedTasks = tasks.filter( ([_, taskInfo]) => {return taskInfo.status === false});
      return this.todoList(unfinishedTasks);
    }

    todayTasks(tasks){
      const currentDateTime = new Date();

      const todayTasks = tasks.filter( ([_, taskInfo]) => {
        const dueDate = parse(taskInfo.dueDate,'yyyy-MM-dd, p', currentDateTime);
        const isTodayTask = isWithinInterval(dueDate, {start: startOfDay(currentDateTime), end: endOfDay(currentDateTime)});
        return isTodayTask === true && taskInfo.status === false
      });

      return this.todoList(todayTasks);
    }

    upcomingTasks(tasks){
      const currentDateTime = new Date();

      const upcomingTasks = tasks.filter( ([_, taskInfo]) => {
        const dueDate = parse(taskInfo.dueDate,'yyyy-MM-dd, p', currentDateTime);
        const hoursDifference = differenceInHours(dueDate, currentDateTime);
        return hoursDifference >= 24 && taskInfo.status === false
      });

      return this.todoList(upcomingTasks);
    }

    completedTasks(tasks){
        const finishedTasks = tasks.filter( ([_, taskInfo]) => {return taskInfo.status === true});
        return this.todoList(finishedTasks);
    }

    addTaskForm(){
        const form = this.domBuilder.createAddTaskForm();
        this.render(form);
        feather.replace();
        return form
    }

    removeMainContent() {
      const main = this.container.querySelector("main");
      while (main.lastChild) main.removeChild(main.lastChild);
    }
}