'use strict';

// Task Class: Represent a Task

class Task {
  constructor(currentTask, pomodoro) {
    this.currentTask = currentTask;
    this.pomodoro = pomodoro;
    
    // this.note = note;
  }
}

// UI Class: Handle UI Task-field

class UI {

  static displayTask() {
    const storedTasks = Store.getTasks();
    const tasks = storedTasks;

    tasks.forEach((task) => UI.addTaskToList(task))
  }

  static addTaskToList(task) {
    const list = document.querySelector('#task-list-container');

    const div = document.createElement('div');
    div.classList.add('task-list-container');
    div.innerHTML = `
      <div class="task-list">
        <i id="check-circle" class="fas fa-check-circle"></i>
        <div id="task-name" class="name-list">${task.currentTask}
        </div>
        </div>
      <div class="task-list">
        <div id="task-unit" class="unit-list">0/${task.pomodoro}
        </div>
        <button class="list-menu-btn">
          <i class="fas fa-times delete"></i>
        </button>
      </div>
    `;

    list.appendChild(div);
  }

  static deleteTask(el) {
    if(el.classList.contains('delete')){
      el.parentElement.parentElement.parentElement.remove();
    }
  }

  static clearFields() {
    document.querySelector('#insert-task-name').value = '';
    document.querySelector('#insert-task-unit').value = '';
  }

}

// Store Class: Handle Storage

class Store {
  // get task from local storage of the browser
  static getTasks() {
    let tasks;
    if(localStorage.getItem('tasks') === null){
      tasks = [];
    } else {
      // parsing string which return .getItem() to object
      tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    return tasks;
  }

  static addTask(task) {
    const tasks = Store.getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }

  static removeTask(currentTask) {
    
    const tasks = Store.getTasks();

    tasks.forEach((task, index) => {
      if(tasks.currentTask === currentTask) {
        tasks.splice(index, 1);
      }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// Event: Display Field to fill task after click on Add-btn

const addBtn = document.getElementById('addBtn');
const taskEditor = document.getElementById('task-editor-container');

addBtn.addEventListener("click", function() {
  taskEditor.classList.remove('hide');
});

// Event: Close Field task-editor and clear fields
const cancelBtn = document.getElementById('cancel-btn');

cancelBtn.addEventListener("click", function() {
  taskEditor.classList.add('hide');
  UI.clearFields();
});


// Event: Display Task

document.addEventListener('DOMContentLoaded', UI.displayTask())

// Event: Add a Task

document.getElementById('save-btn').addEventListener("click",(e) => {
  // Get form values
  const currentTask = document.querySelector('#insert-task-name').value;
  const pomodoro = document.querySelector('#insert-task-unit').value;

  // Validate
  if(currentTask === '' || pomodoro === ''){
    document.getElementById('save-btn').setAttribute('disabled', true);
  } else {
      // Istatiate task
    const task = new Task(currentTask,pomodoro);
    console.log(task);

    // Add task to UI
    UI.addTaskToList(task);

    // Add task to store
    Store.addTask(task);

    // Clear fields from task-editor
    UI.clearFields();
    }
});

// Event: Add "checked" symbol when clicking on list item and vice versa

// const checked = document.getElementById('check-circle');
// checked.addEventListener('click', (event) => {
//   if (event.target.tagName === 'i') {
//     const task = document.getElementById('task-name');

//     checked.classList.add('fa-check-circle-checked');
//     task.classList.add('name-list-checked');
//   }
// }, false);

// Event: Remove a Task
document.getElementById('task-list-container').addEventListener('click', (e) => {
  // Remove task from UI
  UI.deleteTask(e.target);

  // Remove book from the store
  Store.removeTask(e.target.parentElement.parentElement.previousElementSibling.childNodes[3].value)
})
