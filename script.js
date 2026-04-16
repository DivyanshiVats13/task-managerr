// DOM Elements
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const clearBtn = document.getElementById('clear-btn');
const emptyState = document.getElementById('empty-state');
const congratsBar = document.getElementById('congrats-bar');

// State
let tasks = [];

// Init
function init() {
    setGreeting();

    const stored = localStorage.getItem('tasks');
    if (stored) tasks = JSON.parse(stored);

    renderTasks();
}

// Save
function save() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Escape HTML
function escHtml(s) {
    return s.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

// Render (MENU STYLE UI)
function renderTasks() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        congratsBar.style.display = 'none';
        taskCount.textContent = 'No tasks yet — start small 🌱';
        return;
    }

    emptyState.style.display = 'none';

    const done = tasks.filter(t => t.done).length;
    const total = tasks.length;

    // Count text
    if (done === total) {
        taskCount.textContent = `All ${total} done! 🌟`;
        congratsBar.style.display = 'block';
    } else {
        taskCount.textContent = `${done} of ${total} done`;
        congratsBar.style.display = 'none';
    }

    // Create menu-style list
    tasks.forEach((task, i) => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.done ? ' done' : '');

        li.innerHTML = `
            <button class="check-btn" data-i="${i}">
                <svg class="check-icon" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
            </button>

            <span class="task-text">${escHtml(task.text)}</span>

            <button class="delete-btn" data-i="${i}">
                <svg width="13" height="13" viewBox="0 0 13 13">
                    <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" stroke-width="1.6"/>
                </svg>
            </button>
        `;

        taskList.appendChild(li);
    });

    // Toggle
    document.querySelectorAll('.check-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const i = +btn.dataset.i;
            tasks[i].done = !tasks[i].done;
            save();
            renderTasks();
        });
    });

    // Delete
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const i = +btn.dataset.i;
            tasks.splice(i, 1);
            save();
            renderTasks();
        });
    });
}

// Add Task
function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks.unshift({ text, done: false });
    taskInput.value = '';

    save();
    renderTasks();
}

// Clear All
clearBtn.addEventListener('click', () => {
    if (tasks.length === 0) return;

    if (confirm('Clear everything?')) {
        tasks = [];
        save();
        renderTasks();
    }
});

// Events
document.getElementById('add-btn').addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
});

// Greeting system (human feel)
const greetings = {
    morning: ["Good morning, <em>let's do this.</em>", "Rise and shine ✨"],
    afternoon: ["Good afternoon!", "Keep going 💪"],
    evening: ["Good evening 🌙", "Wrap it up strong."],
    night: ["Late night grind? 🕯️", "Still going? respect."]
};

const subtexts = [
    "One task at a time.",
    "Small steps matter.",
    "Focus > busy.",
    "Make today count."
];

function setGreeting() {
    const h = new Date().getHours();
    const key = h < 12 ? 'morning' : h < 17 ? 'afternoon' : h < 21 ? 'evening' : 'night';

    document.getElementById('greeting').innerHTML =
        greetings[key][Math.floor(Math.random() * greetings[key].length)];

    document.getElementById('subtext').textContent =
        subtexts[Math.floor(Math.random() * subtexts.length)];
}

// Start
init();
