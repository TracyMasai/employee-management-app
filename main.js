// ── Storage helpers ──────────────────────────────────────────────
const STORAGE_KEY = 'ems_employees';

function getEmployees() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveEmployees(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Seed sample data on first load
function seedIfEmpty() {
  if (getEmployees().length) return;
  const sample = [
    { id: 1, name: 'Ann Mutiga',           email: 'ann.mutiga@company.co.ke',       phone: '+254 712 345 678', dept: 'HR',  position: 'HR Manager' },
    { id: 2, name: 'Brian Otieno',          email: 'b.otieno@company.co.ke',         phone: '+254 723 456 789', dept: 'IT',  position: 'Software Engineer' },
    { id: 3, name: 'Cecilia Nyokabi',       email: 'c.nyokabi@company.co.ke',        phone: '+254 734 567 890', dept: 'FIN', position: 'Finance Analyst' },
    { id: 4, name: 'Charles Onyango',       email: 'c.onyango@company.co.ke',        phone: '+254 745 678 901', dept: 'MKT', position: 'Marketing Lead' },
    { id: 5, name: 'Christine Mogeni',      email: 'c.mogeni@company.co.ke',         phone: '+254 756 789 012', dept: 'OPS', position: 'Operations Officer' },
    { id: 6, name: 'David Kimani',          email: 'd.kimani@company.co.ke',         phone: '+254 767 890 123', dept: 'IT',  position: 'System Administrator' },
  ];
  saveEmployees(sample);
}

// ── Toast notification ───────────────────────────────────────────
function showToast(message, icon = '✅') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast-icon">${icon}</span> ${message}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// ── Active nav link ───────────────────────────────────────────────
function markActiveLink() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === current);
  });
}

// ── New Contact page ─────────────────────────────────────────────
function initNewContact() {
  const form = document.getElementById('newContactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const employees = getEmployees();
    const newId = employees.length ? Math.max(...employees.map(x => x.id)) + 1 : 1;

    const employee = {
      id: newId,
      name: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      dept: document.getElementById('dept').value,
      position: document.getElementById('position').value.trim(),
    };

    employees.push(employee);
    saveEmployees(employees);
    showToast(`${employee.name} added successfully!`);
    form.reset();
    setTimeout(() => window.location.href = 'view-contacts.html', 1200);
  });

  document.getElementById('resetBtn')?.addEventListener('click', () => form.reset());
}

// ── View Contacts page ───────────────────────────────────────────
function initViewContacts() {
  const tbody = document.getElementById('contactsBody');
  if (!tbody) return;

  const searchInput = document.getElementById('searchInput');
  let employees = getEmployees();

  function deptClass(d) {
    const map = { HR:'dept-HR', IT:'dept-IT', FIN:'dept-FIN', MKT:'dept-MKT', OPS:'dept-OPS' };
    return map[d] || 'dept-IT';
  }

  function initials(name) {
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }

  function render(list) {
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="5">
        <div class="empty-state">
          <div class="empty-icon">👥</div>
          <p>No employees found. <a href="new-contact.html" style="color:var(--accent)">Add one?</a></p>
        </div>
      </td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(emp => `
      <tr>
        <td>
          <div class="employee-name">
            <div class="avatar">${initials(emp.name)}</div>
            <div>
              <div style="font-weight:500">${emp.name}</div>
              <div style="color:var(--text-muted);font-size:0.78rem">${emp.position}</div>
            </div>
          </div>
        </td>
        <td style="color:var(--text-muted)">${emp.email}</td>
        <td style="font-family:'JetBrains Mono',monospace;font-size:0.85rem">${emp.phone}</td>
        <td><span class="dept-badge ${deptClass(emp.dept)}">${emp.dept}</span></td>
        <td>
          <div class="actions-cell">
            <button class="btn btn-sm btn-teal" onclick="viewDetails(${emp.id})">👁 Details</button>
            <button class="btn btn-sm btn-amber" onclick="editEmployee(${emp.id})">✏️ Edit</button>
            <button class="btn btn-sm btn-red" onclick="deleteEmployee(${emp.id})">🗑 Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  render(employees);

  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    render(employees.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.dept.toLowerCase().includes(q)
    ));
  });

  // Update stats
  const countEl = document.getElementById('totalCount');
  const deptEl = document.getElementById('deptCount');
  if (countEl) countEl.textContent = employees.length;
  if (deptEl) {
    const depts = new Set(employees.map(e => e.dept));
    deptEl.textContent = depts.size;
  }
}

// ── Details Modal ────────────────────────────────────────────────
function viewDetails(id) {
  const emp = getEmployees().find(e => e.id === id);
  if (!emp) return;

  const overlay = document.getElementById('detailModal');
  document.getElementById('modalName').textContent = emp.name;
  document.getElementById('modal-name').textContent = emp.name;
  document.getElementById('modal-email').textContent = emp.email;
  document.getElementById('modal-phone').textContent = emp.phone;
  document.getElementById('modal-dept').textContent = emp.dept;
  document.getElementById('modal-position').textContent = emp.position;
  document.getElementById('modal-id').textContent = '#' + String(emp.id).padStart(4, '0');
  overlay.classList.add('open');
}

function closeModal() {
  document.getElementById('detailModal')?.classList.remove('open');
}

// ── Edit Modal ────────────────────────────────────────────────────
function editEmployee(id) {
  const emp = getEmployees().find(e => e.id === id);
  if (!emp) return;

  // Pre-fill the edit form
  document.getElementById('editId').value       = emp.id;
  document.getElementById('editName').value     = emp.name;
  document.getElementById('editEmail').value    = emp.email;
  document.getElementById('editPhone').value    = emp.phone;
  document.getElementById('editDept').value     = emp.dept;
  document.getElementById('editPosition').value = emp.position;

  // Open modal
  document.getElementById('editModal').classList.add('open');
}

function closeEditModal() {
  document.getElementById('editModal').classList.remove('open');
}

function saveEdit() {
  const id = parseInt(document.getElementById('editId').value);
  const name     = document.getElementById('editName').value.trim();
  const email    = document.getElementById('editEmail').value.trim();
  const phone    = document.getElementById('editPhone').value.trim();
  const dept     = document.getElementById('editDept').value;
  const position = document.getElementById('editPosition').value.trim();

  if (!name || !email || !phone || !position) {
    showToast('Please fill in all fields.', '⚠️');
    return;
  }

  const employees = getEmployees();
  const index = employees.findIndex(e => e.id === id);
  if (index === -1) return;

  employees[index] = { id, name, email, phone, dept, position };
  saveEmployees(employees);

  closeEditModal();
  showToast(`${name} updated successfully!`, '✅');

  // Re-render the table
  initViewContacts();
}

// ── Delete (Confirm Dialog) ──────────────────────────────────────
function deleteEmployee(id) {
  const emp = getEmployees().find(e => e.id === id);
  if (!emp) return;
  const confirmed = confirm(`Are you sure you want to delete?\n\nEmployee: ${emp.name}`);
  if (confirmed) {
    const updated = getEmployees().filter(e => e.id !== id);
    saveEmployees(updated);
    showToast(`${emp.name} removed.`, '🗑️');
    setTimeout(() => initViewContacts(), 300);
    // Re-render without reload
    const employees2 = getEmployees();
    const tbody = document.getElementById('contactsBody');
    if (tbody) {
      // trigger re-render
      document.getElementById('searchInput').value = '';
      initViewContacts();
    }
  }
}

// ── Home page stats ──────────────────────────────────────────────
function initHome() {
  const employees = getEmployees();
  const totalEl = document.getElementById('statTotal');
  const deptsEl = document.getElementById('statDepts');
  const newEl   = document.getElementById('statNew');

  if (totalEl) totalEl.textContent = employees.length;
  if (deptsEl) deptsEl.textContent = new Set(employees.map(e => e.dept)).size;
  if (newEl) newEl.textContent = employees.filter(e => e.id > employees.length - 2).length;
}

// ── Bootstrap ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  seedIfEmpty();
  markActiveLink();
  initHome();
  initNewContact();
  initViewContacts();

  // Close modals on overlay click
  document.getElementById('detailModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
  document.getElementById('editModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeEditModal();
  });
});