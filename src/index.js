import { Task } from "./todo.js";
import { todoListHandler } from "./todoListHandler.js";
import todoList from './todo-list.json'


const test = new Task ("Dance all night long","Check soil moisture for the","2026-01-06","Low");

const addTest = new todoListHandler("todo-list", JSON.stringify(todoList));

addTest.addTask(test);

