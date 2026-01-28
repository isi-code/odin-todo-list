import feather from 'feather-icons';
import {parse, format, differenceInHours, startOfDay, endOfDay, isWithinInterval} from 'date-fns';

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

    const btnContainer =  document.createElement("div");
    btnContainer.classList = "updateTask";

    const detailsBtn =  document.createElement("button");
    detailsBtn.dataset.taskId = id;
    detailsBtn.classList = "detailsBtn"
    detailsBtn.textContent = "Task Details";

    const editBtn =  document.createElement("button");
    editBtn.dataset.taskId = id;
    editBtn.classList = "editBtn"
    editBtn.textContent = "Edit Task";

    const removeBtn =  document.createElement("button");
    removeBtn.dataset.taskId = id;
    removeBtn.classList = "removeBtn"
    removeBtn.textContent = "Remove Task";

    btnContainer.append(detailsBtn, editBtn, removeBtn);

    taskContainer.append(btnContainer);
    return taskContainer;
  }

  createProjectCard(projectName, count) {
    const projectCard = document.createElement("div");
    projectCard.dataset.project = projectName;
    projectCard.classList = 'project';

    const icon = document.createElement("i");
    icon.setAttribute("data-feather", "folder");
    
    const title = document.createElement("h3");
    title.textContent = projectName;

    const taskAmount = document.createElement("div");
    taskAmount.textContent = `Task Number: ${count}`;

    projectCard.append(icon, title, taskAmount);
    return projectCard
  }

  createTodoList(tasks) {
    const todoListSection = document.createElement("section");
    todoListSection.classList = "list";

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

  createProjectList(projects){
    const projectListSection = document.createElement("section");
    projectListSection.classList = "list";

    for (let project of Object.keys(projects)) {
      const projectEl = this.createProjectCard(project, projects[project]);
      projectListSection.append(projectEl);
    }

    return projectListSection
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

  createTaskForm(btnText = "Add Task", ){
    const form = document.createElement("form");

    for (const [key, { label, inputType }] of Object.entries(this.#task)) {
        //This method return label and input
        if(key.toLowerCase() !== "status") form.append(...this.createInputs(key, label, inputType));
    }

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = btnText;

    form.append(submitBtn);

    return form
  }

  createAddTaskForm() {
    const dialog = document.createElement("dialog");
    const xBtn = document.createElement("div");
    
    xBtn.classList = "xBtn";
    xBtn.setAttribute("data-feather", 'x');
    
    const form = this.createTaskForm();
    form.method = "dialog";

    dialog.append(form, xBtn);

    return dialog
  }

  createEditTaskForm(task) {   
    const editFormSection = document.createElement("section");
    editFormSection.classList = "editForm";
    
    const form = this.createTaskForm("Edit Task");
    editFormSection.append(this.addTaskValues(form, task));

    return editFormSection
  }

  addTaskValues(form, task){
    for (let input of form.elements){
      const value = task[input.name];
      if (value){
        if(input.name === "dueDate"){
          const parsedDate = parse(value, "yyyy-MM-dd, hh:mm a", new Date());
          input.value = format(parsedDate, "yyyy-MM-dd'T'HH:mm");
        } else{
          input.value = value;
        }
      } 
    }     
    return form
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

    renderToMain(element){ 
        let main = this.container.querySelector("main");
        if(!main) main = this.domBuilder.createMainContainer();

        main.append(element);
        this.render(main);
     }

    navBar(){
        const header = this.domBuilder.createNavBar();
        this.render(header);
        feather.replace();
        const nav = header.querySelector("nav");
        return nav
    }

    todoList(tasks){
        const todoList = this.domBuilder.createTodoList(tasks);
        this.renderToMain(todoList);
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

    editTaskForm(task){
      const form = this.domBuilder.createEditTaskForm(task);
      this.renderToMain(form);
      return form
    }

    projectNameList(tasks){
      const projectCount = tasks.reduce((acc, [_, { project }]) => {
        if (project !== "") acc[project] = (acc[project] || 0) + 1;
        return acc;
      }, {});

      const projectList = this.domBuilder.createProjectList(projectCount);
      this.renderToMain(projectList);
      feather.replace();
      
      return projectList
    }

    projectTasks(tasks, project){
        const projectTasks = tasks.filter( ([_, taskInfo]) => {return taskInfo.project === project});
        return this.todoList(projectTasks);
    }

    removeMainContent() {
      const main = this.container.querySelector("main");
      while (main.lastChild) main.removeChild(main.lastChild);
    }
}