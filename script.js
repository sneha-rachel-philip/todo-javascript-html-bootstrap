document.addEventListener("DOMContentLoaded", loadTasks);

const newTaskInput = document.getElementById("newTask");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const filterAll = document.getElementById("filterAll");
const filterActive = document.getElementById("filterActive");
const filterCompleted = document.getElementById("filterCompleted");

// Add Task
addTaskBtn.addEventListener("click", addTask);
newTaskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});

function addTask() {
    const taskText = newTaskInput.value.trim();
    if (taskText === "") return;

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    saveTask(task);
    renderTasks();
    newTaskInput.value = "";
}

// Save to localStorage
function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Get tasks from localStorage
function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

// Render tasks
function renderTasks(filter = "all") {
    taskList.innerHTML = "";
    const tasks = getTasks();

    tasks.forEach((task) => {
        if (filter === "active" && task.completed) return;
        if (filter === "completed" && !task.completed) return;

        const li = document.createElement("li");
        li.classList.add("list-group-item");

        const span = document.createElement("span");
        span.textContent = task.text;
        if (task.completed) span.classList.add("completed");

        const completeBtn = document.createElement("button");
        completeBtn.textContent = "✔";
        completeBtn.classList.add("btn", "btn-success", "btn-sm", "ms-2");
        completeBtn.addEventListener("click", () => toggleComplete(task.id));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.classList.add("delete-btn", "ms-2");
        deleteBtn.addEventListener("click", () => deleteTask(task.id));

        li.appendChild(span);
        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });
}

// Toggle task completion
function toggleComplete(id) {
    const tasks = getTasks();
    const task = tasks.find(task => task.id === id);
    task.completed = !task.completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

// Delete task
function deleteTask(id) {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

// Filter buttons
filterAll.addEventListener("click", () => {
    renderTasks("all");
    updateFilterButton(filterAll);
});

filterActive.addEventListener("click", () => {
    renderTasks("active");
    updateFilterButton(filterActive);
});

filterCompleted.addEventListener("click", () => {
    renderTasks("completed");
    updateFilterButton(filterCompleted);
});

// Highlight selected filter
function updateFilterButton(activeButton) {
    document.querySelectorAll(".btn-group .btn").forEach(btn => btn.classList.remove("active"));
    activeButton.classList.add("active");
}

// Load tasks from localStorage
function loadTasks() {
    renderTasks();
}
