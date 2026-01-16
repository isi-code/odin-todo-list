import feather from 'feather-icons';

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
        status: {
            mainTag: "input",
            label: "Is it done?",
            inputType: "checkbox",
        },
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
            options: ["low", "medium", "high"],
        },
        project: { mainTag: "div", label: "Project", inputType: "text" },
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

    completedTasks(tasks){ 
        const finishedTasks = tasks.filter( task => {return task.status === true});
        this.allTasks(finishedTasks);
    }

    render(element){ this.container.append(element) }

    addTaskForm(){ this.render(this.domBuilder.createAddTaskForm()) }
}