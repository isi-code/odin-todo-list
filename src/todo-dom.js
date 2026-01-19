import feather from 'feather-icons';
import {parse, differenceInHours, startOfDay, endOfDay, isWithinInterval} from 'date-fns';

export class TodoListDomFactory {
  #navigation;
  #task;
  #mainSection;

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
    dueDate: { mainTag: "div", label: "Due date", inputType: "date" },
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

    this.#mainSection = document.createElement("main");
  }

  get liMenus() {
    return Array.from(document.querySelectorAll("[data-menu]"));
  }

  get mainSectionHasContent() {
    if (this.#mainSection.children) return true;
    return false;
  }

  createTaskCard(task) {
    const taskContainer = document.createElement("div");
    taskContainer.className = "taskContainer";
    // Create a div wrapper to wrap around task info
    const infoWrapper = document.createElement("div");
    infoWrapper.className = "info-wrapper";

    for (const [key, { mainTag, inputType }] of Object.entries(this.#task)) {
      // Skip empty fields to keep the UI clean
      if (task[key] !== "") {
        const htmlElement = document.createElement(mainTag);
        // Special handling for the checkbox/status input
        if (key === "status") {
          htmlElement.type = inputType;
          const taskId = task.id;
          htmlElement.id = taskId;
          taskContainer.append(htmlElement);
        } else {
          htmlElement.textContent = task[key];
          infoWrapper.append(htmlElement);
        }
        taskContainer.append(infoWrapper);
      }
    }
    return taskContainer;
  }

  createTodoList(tasks) {
    const todoListSection = document.createElement("section");
    todoListSection.className = "todo-list";

    for (let task of tasks) {
      const taskEl = this.createTaskCard(task);
      todoListSection.append(taskEl);
    }

    this.#mainSection.append(todoListSection);
    return this.#mainSection;
  }

  createNavBar() {
    const header = document.createElement("header");

    const logoCont = document.createElement("div");
    logoCont.className = "logo-wrapper";
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
    xBtn.className = "xBtn";
    xBtn.setAttribute("data-feather", 'x');
    const form = document.createElement("form");

    for (const [key, { label, inputType }] of Object.entries(this.#task)) {
        //This method return label and input
        form.append(...this.createInputs(key, label, inputType));
    }
    //console.log(Array.from(form));

    const hiddenInput= document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.value = crypto.randomUUID();

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Add Task";

    form.append(hiddenInput, submitBtn);
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

  removeMainContent() {
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

    render(element){ this.container.append(element); }

    navBar(){ 
        const navBar = this.domBuilder.createNavBar();
        this.render(navBar);
        feather.replace();
    }

    allTasks(tasks){ 
        const todoList = this.domBuilder.createTodoList(tasks);
        this.render(todoList);
    }

    unfinishedTasks(tasks){ 
        const unfinishedTasks = tasks.filter( task => {return task.status === false});
        this.allTasks(unfinishedTasks);
    }

    todayTasks(tasks){
      const currentDateTime = new Date();

      const todayTasks = tasks.filter(task => {
        const dueDate = parse(task.dueDate,'yyyy-MM-dd, p', currentDateTime);
        const isTodayTask = isWithinInterval(dueDate, {start: startOfDay(currentDateTime), end: endOfDay(currentDateTime)});
        return isTodayTask === true && task.status === false
      });

      this.allTasks(todayTasks);
    }

    upcomingTasks(tasks){
      const currentDateTime = new Date();
      
      const upcomingTasks = tasks.filter(task => {
        const dueDate = parse(task.dueDate,'yyyy-MM-dd, p', currentDateTime);
        const hoursDifference = differenceInHours(dueDate, currentDateTime);
        return hoursDifference >= 24 && task.status === false
      });

      this.allTasks(upcomingTasks);
    }

    completedTasks(tasks){ 
        const finishedTasks = tasks.filter( task => {return task.status === true});
        this.allTasks(finishedTasks);
    }   

    addTaskForm(){
        const form = this.domBuilder.createAddTaskForm();
        this.render(form);
        feather.replace();
        return form
    }
}