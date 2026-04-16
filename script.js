// DOM Elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const clearAllBtn = document.getElementById('clear-all');
const emptyState = document.getElementById('empty-state');

// State Application
let tasks = [];

// Initialize app
function init() {
    updateGreeting();
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    renderTasks();
}

// Add Dynamic Greeting
function updateGreeting() {
    const greetingEl = document.getElementById('greeting');
    if (!greetingEl) return;
    
    const hour = new Date().getHours();
    let greetingText = 'Good Evening! 🌙';
    
    if (hour < 12) {
        greetingText = 'Good Morning! ☀️';
    } else if (hour < 18) {
        greetingText = 'Good Afternoon! ☕';
    }
    
    greetingEl.innerText = greetingText;
}

// Update Local Storage
function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render Tasks
function renderTasks() {
    // Clear list
    taskList.innerHTML = '';
    
    // Check for empty state
    if (tasks.length === 0) {
        emptyState.style.display = 'flex';
        taskList.style.display = 'none';
        clearAllBtn.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        taskList.style.display = 'flex';
        clearAllBtn.style.display = 'block';
    }
    
    // Render each task
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', task.id);
        
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                <span class="task-text">${escapeHTML(task.text)}</span>
            </div>
            <div class="task-actions">
                <button class="btn-icon delete-btn" onclick="deleteTask(${task.id})" title="Delete Task">
                    <i class="ph ph-trash"></i>
                </button>
            </div>
        `;
        
        taskList.appendChild(li);
    });
    
    // Update count
    updateCount();
}

// Add Task
function addTask(e) {
    e.preventDefault();
    
    const taskText = taskInput.value.trim();
    if (!taskText) return;
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    tasks.push(newTask);
    updateLocalStorage();
    renderTasks();
    
    taskInput.value = '';
    taskInput.focus();
}

// Toggle Task Completion
window.toggleTask = function(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    updateLocalStorage();
    renderTasks();
};

// Delete Task
window.deleteTask = function(id) {
    tasks = tasks.filter(task => task.id !== id);
    updateLocalStorage();
    renderTasks();
};

// Clear All Tasks
function clearAllTasks() {
    if (confirm('Ready for a clean slate? This will remove all your tasks.')) {
        tasks = [];
        updateLocalStorage();
        renderTasks();
    }
}

// Update Task Count
function updateCount() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    if (total === 0) {
        taskCount.innerHTML = '✨ Fresh start!';
    } else if (completed === total) {
        taskCount.innerHTML = '🎉 All done! Amazing job!';
    } else {
        taskCount.innerHTML = `🚀 <b>${completed}</b> of <b>${total}</b> completed`;
    }
}

// Security: escape HTML to prevent XSS
function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// Event Listeners
taskForm.addEventListener('submit', addTask);
clearAllBtn.addEventListener('click', clearAllTasks);

// Start the app
init();
