const greetings = {
    morning:   ["Good morning, <em>let's do this.</em>", "Rise and shine ✨", "Morning! Big things ahead."],
    afternoon: ["Good afternoon!", "Afternoon — keep the momentum.", "Hey there, afternoon hero!"],
    evening:   ["Good evening 🌙", "Evening — wrapping things up?", "Almost done with the day!"],
    night:     ["Burning the midnight oil? 🕯️", "Night owl mode on.", "Late night grind, respect."]
};

const subtexts = [
    "One task at a time — you've got this.",
    "Small steps add up to big things.",
    "Focus beats hustle, every time.",
    "What's the one thing that matters most today?",
    "Let's make it count."
];

function setGreeting() {
    const h = new Date().getHours();
    const key = h < 12 ? 'morning' : h < 17 ? 'afternoon' : h < 21 ? 'evening' : 'night';
    const list = greetings[key];
    document.getElementById('greeting').innerHTML = list[Math.floor(Math.random() * list.length)];
    document.getElementById('subtext').textContent = subtexts[Math.floor(Math.random() * subtexts.length)];
}

setGreeting();

let tasks = [];

function escHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderTasks() {
    const list     = document.getElementById('task-list');
    const empty    = document.getElementById('empty-state');
    const count    = document.getElementById('task-count');
    const congrats = document.getElementById('congrats-bar');

    list.innerHTML = '';

    if (tasks.length === 0) {
        empty.style.display   = 'block';
        congrats.style.display = 'none';
        count.textContent = 'No tasks yet — start somewhere small 🌱';
        return;
    }

    empty.style.display = 'none';

    const done  = tasks.filter(t => t.done).length;
    const total = tasks.length;

    if (done === total) {
        count.textContent      = `All ${total} done! 🌟`;
        congrats.style.display = 'block';
    } else {
        count.textContent      = done > 0 ? `${done} of ${total} done` : `${total} task${total > 1 ? 's' : ''} to go`;
        congrats.style.display = 'none';
    }

    tasks.forEach((task, i) => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.done ? ' done' : '');

        li.innerHTML = `
            <button class="check-btn" data-i="${i}" aria-label="Toggle done">
                <svg class="check-icon" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <span class="task-text">${escHtml(task.text)}</span>
            <button class="delete-btn" data-i="${i}" aria-label="Delete task">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
            </button>
        `;

        list.appendChild(li);
    });

    list.querySelectorAll('.check-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            tasks[+btn.dataset.i].done = !tasks[+btn.dataset.i].done;
            renderTasks();
        });
    });

    list.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            tasks.splice(+btn.dataset.i, 1);
            renderTasks();
        });
    });
}

function addTask() {
    const input = document.getElementById('task-input');
    const text  = input.value.trim();
    if (!text) return;
    tasks.unshift({ text, done: false });
    input.value = '';
    renderTasks();
    input.focus();
}

document.getElementById('add-btn').addEventListener('click', addTask);
document.getElementById('task-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
});

document.getElementById('clear-btn').addEventListener('click', () => {
    if (tasks.length === 0) return;
    if (confirm('Clear everything? Your to-dos will be gone for good.')) {
        tasks = [];
        renderTasks();
    }
});

renderTasks();
