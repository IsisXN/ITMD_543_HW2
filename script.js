// script.js

const filterForm = document.getElementById('filterForm');
const taskList = document.getElementById('tasks');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const emptyMsg = document.getElementById('empty');
const addTaskForm = document.getElementById('addTaskForm');

function updateEmptyMessage() {
  const visible = [...taskList.children].some(li => !li.hidden);
  emptyMsg.hidden = visible;
}

function filterTasks() {
  const checked = [...filterForm.querySelectorAll('input[name="category"]:checked')].map(i => i.value);
  const search = searchInput.value.toLowerCase();
  [...taskList.children].forEach(li => {
    const matchesCat = checked.includes(li.dataset.category);
    const matchesSearch = li.textContent.toLowerCase().includes(search);
    li.hidden = !(matchesCat && matchesSearch);
  });
  updateEmptyMessage();
}

function sortTasks() {
  const items = [...taskList.children];
  const sortType = sortSelect.value;
  items.sort((a, b) => {
    const textA = a.querySelector('h3').textContent.toLowerCase();
    const textB = b.querySelector('h3').textContent.toLowerCase();
    if (sortType === 'alpha') return textA.localeCompare(textB);
    if (sortType === 'alpha-desc') return textB.localeCompare(textA);
    return 0;
  });
  taskList.append(...items);
}

// Event listeners
filterForm.addEventListener('change', () => {
  filterTasks();
  sortTasks();
});

searchInput.addEventListener('input', filterTasks);
sortSelect.addEventListener('change', sortTasks);

// Add new task
addTaskForm.addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('taskTitle').value.trim();
  const due = document.getElementById('taskDue').value;
  const category = document.getElementById('taskCategory').value;
  const desc = document.getElementById('taskDesc').value.trim();

  if (!title || !category) return alert('Please enter a title and category.');

  const li = document.createElement('li');
  li.className = 'card';
  li.dataset.category = category;
  li.innerHTML = `
    <article>
      <header>
        <input type="checkbox" class="complete-task" title="Mark complete" />
        <h3>${title}</h3>
        <p class="meta">${due ? `Due: ${due}` : 'No due date'} · <span class="category">${category.charAt(0).toUpperCase() + category.slice(1)}</span></p>
      </header>
      <p>${desc || ''}</p>
    </article>
  `;
  taskList.appendChild(li);
  addTaskForm.reset();
  filterTasks();
});

// Mark as complete = remove
taskList.addEventListener('change', e => {
  if (e.target.classList.contains('complete-task')) {
    const li = e.target.closest('li');
    li.style.opacity = '0';
    li.style.transform = 'scale(0.95)';
    setTimeout(() => li.remove(), 300);
  }
});
