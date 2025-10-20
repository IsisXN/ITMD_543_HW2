// script.js — filtering logic for the Simple To-Do Filter
// Defer attribute is used in index.html so the DOM is ready.

(() => {
  // Cached DOM nodes
  const tasksList = document.getElementById('tasks');
  const taskItems = Array.from(tasksList.querySelectorAll('.card'));
  const filterForm = document.getElementById('filterForm');
  const searchInput = document.getElementById('search');
  const sortSelect = document.getElementById('sort');
  const emptyMessage = document.getElementById('empty');

  // Helper: get selected categories (values of checked checkboxes)
  function getSelectedCategories() {
    const boxes = Array.from(filterForm.querySelectorAll('input[name="category"]'));
    return boxes.filter(b => b.checked).map(b => b.value);
  }

  // Helper: check if a task matches filters
  function matchesFilters(card, categories, searchText) {
    const cat = card.dataset.category || '';
    if (!categories.includes(cat)) return false;

    if (searchText) {
      const text = (card.textContent || '').toLowerCase();
      if (!text.includes(searchText.toLowerCase())) return false;
    }
    return true;
  }

  // Show/hide tasks according to filters
  function applyFilters() {
    const selected = getSelectedCategories();
    const searchText = searchInput.value.trim();
    let visibleCount = 0;

    taskItems.forEach(card => {
      if (matchesFilters(card, selected, searchText)) {
        card.hidden = false;
        // small staggered animation
        requestAnimationFrame(() => card.style.opacity = 1);
        visibleCount++;
      } else {
        card.hidden = true;
      }
    });

    emptyMessage.hidden = (visibleCount > 0);
  }

  // Sorting function (by title text)
  function applySort() {
    const mode = sortSelect.value;
    let sorted = [...taskItems];

    if (mode === 'alpha') {
      sorted.sort((a, b) => a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent));
    } else if (mode === 'alpha-desc') {
      sorted.sort((a, b) => b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent));
    } else {
      // default: keep DOM order (we'll not reorder)
      sorted = [...taskItems];
    }

    // Re-append sorted nodes to the list (only visible ones shown in DOM order)
    sorted.forEach(node => tasksList.appendChild(node));
  }

  // Combined action when filters or sort change
  function refresh() {
    applySort();
    applyFilters();
  }

  // Event listeners
  filterForm.addEventListener('change', () => {
    refresh();
  });

  searchInput.addEventListener('input', () => {
    // small debounce to avoid too many repaints
    clearTimeout(searchInput._timer);
    searchInput._timer = setTimeout(() => refresh(), 150);
  });

  sortSelect.addEventListener('change', () => {
    refresh();
  });

  // Initial application of filters (on load)
  refresh();

  // Accessibility: keyboard shortcut "f" focuses search input
  document.addEventListener('keydown', (e) => {
    if (e.key === 'f' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      searchInput.focus();
    }
  });

})();
