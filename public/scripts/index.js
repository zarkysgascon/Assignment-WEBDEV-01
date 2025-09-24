// Utility function to get elements by ID
const $ = (id) => document.getElementById(id);

// Show message function
function showMessage(type, message, isModal = false) {
    const container = isModal ? $('modalMessageContainer') : $('messageContainer');
    
    container.className = `alert alert-${type}`;
    container.textContent = message;
    container.classList.remove('d-none');
    
    // Auto-hide after 4 seconds 
    setTimeout(() => {
        container.classList.add('d-none');
    }, 4000);
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength
function isStrongPassword(password) {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password); // length greater than 8 and at the elast one number mah nigga
}

// Handle signup form submission
$('signupSubmitBtn').onclick = async () => {
    // Get form values
    const firstname = $('signupFirstname').value.trim();
    const lastname = $('signupLastname').value.trim();
    const email = $('signupEmail').value.trim();
    const birthdate = $('signupBirthdate').value;
    const password = $('signupPassword').value;
    const repassword = $('signupRepassword').value;

    // Validate all fields are filled
    if (!firstname || !lastname || !email || !birthdate || !password || !repassword) {
        showMessage('warning', 'Please fill in all fields', true);
        return;
    }

    // Email format warning
    if (!isValidEmail(email)) {
        showMessage('warning', 'Please enter a valid email address', true);
        return;
    }

    // Password format warning
    if (!isStrongPassword(password)) {
        showMessage('warning', 'Password must be at least 8 characters with letters and numbers', true);
        return;
    }

    // Check if passwords match
    if (password !== repassword) {
        showMessage('warning', 'Passwords do not match', true);
        return;
    }

    try {
        // Send signup request to server
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstname,
                lastname,
                email,
                birthdate,
                password,
                repassword
            })
        });

        const data = await response.json();

        if (data.success) {
            showMessage('success', data.message, true);
            // Close modal and reset form after success
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance($('signupModal'));
                modal.hide();
                $('signupForm').reset();
            }, 2000);
        } else {
            showMessage('danger', data.message, true);
        }
    } catch (error) {
        showMessage('danger', 'Network error. Please try again.', true);
    }
};

// Handle login form submission :>
$('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    
    const email = $('email').value.trim();
    const password = $('password').value;

    // Basic validation stuff
    if (!email || !password) {
        showMessage('warning', 'Please enter both email and password');
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            // Store user data in session storage
            sessionStorage.setItem('user', JSON.stringify(data.user));
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            showMessage('danger', data.message);
        }
    } catch (error) {
        showMessage('danger', 'Cannot connect to server. Please try again.');
    }
};

// Prevent Enter key from submitting forms accidentally
$('email').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') e.preventDefault();
});

$('password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') e.preventDefault();
});