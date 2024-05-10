const taskInput = document.getElementById('task-input');
const descriptionInput = document.getElementById('description-input');
const descriptionContainer = document.getElementById('description-container');
const addTaskButton = document.getElementById('add-task');
const pendingTasksList = document.getElementById('pending-tasks');
const completedTasksList = document.getElementById('completed-tasks');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
  pendingTasksList.innerHTML = '';
  completedTasksList.innerHTML = '';
  tasks.sort((a, b) => new Date(b.date) - new Date(a.date));
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = `${index + 1}. ${task.text} - ${formatDate(task.date)}`;
    span.classList.add(task.completed ? 'completed-task' : 'pending-task');

    const descriptionSpan = document.createElement('span');
    descriptionSpan.textContent = `Description: ${task.description}`;
    descriptionSpan.classList.add('task-description');

    const taskOptions = document.createElement('div');
    taskOptions.classList.add('task-options');
    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.addEventListener('click', () => completeTask(index));
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => deleteTask(index));

    if (task.completed) {
      taskOptions.appendChild(deleteButton);
      completedTasksList.appendChild(li);
    } else {
      taskOptions.appendChild(completeButton);
      taskOptions.appendChild(deleteButton);
      pendingTasksList.appendChild(li);
    }

    li.appendChild(span);
    li.appendChild(descriptionSpan);
    li.appendChild(taskOptions);
  });
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText) {
    const now = new Date();
    tasks.push({ text: taskText, description: '', completed: false, date: now.toISOString() });
    taskInput.value = '';
    descriptionContainer.style.display = 'block';
    descriptionInput.focus();
    saveTasksToLocalStorage();
    renderTasks();
  }
}

function completeTask(index) {
  tasks[index].completed = true;
  saveTasksToLocalStorage();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasksToLocalStorage();
  renderTasks();
}

function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return date.toLocaleString(undefined, options);
}

addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

descriptionInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const taskIndex = tasks.findIndex(task => task.description === '');
    if (taskIndex !== -1) {
      tasks[taskIndex].description = descriptionInput.value.trim();
      descriptionContainer.style.display = 'none';
      descriptionInput.value = '';
      saveTasksToLocalStorage();
      renderTasks();
    }
  }
});

renderTasks();