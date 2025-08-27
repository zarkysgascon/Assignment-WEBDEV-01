// We don't have TypeScript here, so no type annotations

const userCountInput = document.getElementById('userCount');
const nameTypeSelect = document.getElementById('nameType');
const generateBtn = document.getElementById('generateBtn');
const userList = document.getElementById('userList');
const errorAlert = document.getElementById('errorAlert');
const loading = document.getElementById('loading');

let currentUsers = [];

generateBtn.addEventListener('click', fetchUsers);
nameTypeSelect.addEventListener('change', updateNameDisplay);

async function fetchUsers() {
  const count = parseInt(userCountInput.value);
  if (isNaN(count) || count < 1 || count > 1000) {
    showError("Enter a number between 1 and 1000");
    return;
  }

  showLoading();
  hideError();
  userList.innerHTML = '';

  try {
    const res = await fetch(`https://randomuser.me/api/?results=${count}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    currentUsers = data.results;
    displayUsers(currentUsers);
  } catch (error) {
    showError("Failed to fetch users. Try again.");
  } finally {
    hideLoading();
  }
}

function displayUsers(users) {
  userList.innerHTML = '';
  const nameType = nameTypeSelect.value;

  users.forEach(user => {
    const displayName = nameType === 'first' ? user.name.first : user.name.last;

    const row = document.createElement('div');
    row.className = 'row user-row text-center align-items-center';

    row.innerHTML = `
      <div class="col-md-3">${displayName}</div>
      <div class="col-md-2">${capitalize(user.gender)}</div>
      <div class="col-md-4 text-truncate" title="${user.email}">${user.email}</div>
      <div class="col-md-3">${user.location.country}</div>
    `;

    userList.appendChild(row);
  });
}

function updateNameDisplay() {
  if (currentUsers.length) displayUsers(currentUsers);
}

function showError(msg) {
  errorAlert.textContent = msg;
  errorAlert.style.display = 'block';
}

function hideError() {
  errorAlert.style.display = 'none';
}

function showLoading() {
  loading.style.display = 'block';
  generateBtn.disabled = true;
}

function hideLoading() {
  loading.style.display = 'none';
  generateBtn.disabled = false;
}

function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Fetch users on page load
fetchUsers();
