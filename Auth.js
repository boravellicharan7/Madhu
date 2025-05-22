
// Tab switching functionality
document.addEventListener('DOMContentLoaded', function () {
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    const tabContents = document.querySelectorAll('.tab-content');

    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', function () {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all triggers and contents
            tabTriggers.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked trigger and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab + '-tab').classList.add('active');
        });
    });

    // Password strength indicator
    const passwordInput = document.getElementById('signup_password');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');

    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updatePasswordStrength(strength);
        });
    }

    function calculatePasswordStrength(password) {
        let score = 0;

        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[@$!%*?&]/.test(password)) score++;

        return score;
    }

    function updatePasswordStrength(strength) {
        const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        const colors = ['#ff4444', '#ff8800', '#ffaa00', '#88cc00', '#00cc44'];

        if (strengthBar && strengthText) {
            strengthBar.style.width = (strength * 20) + '%';
            strengthBar.style.backgroundColor = colors[strength - 1] || '#ff4444';
            strengthText.textContent = strengthLevels[strength - 1] || '';
        }
    }
});

// Event listener for login form submission
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    // Retrieve input values
    const email = document.getElementById("login_email").value.trim();
    const password = document.getElementById("login_password").value.trim();

    // Basic validation to check if fields are not empty
    if (!email || !password) {
        alert("Both fields are required!");
        return;
    }

    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if the provided email and password match a user in localStorage
    const user = users.find((user) => user.email === email && user.password === password);

    if (user) {
        alert(`Welcome back, ${user.name}!`);
        // Redirect the user to the dashboard or home page
        window.location.href = "loading.html";
    } else {
        // Show error if no match is found
        alert("Invalid email or password!");
    }
});

// Event listener for guest login button
document.getElementById("guestLoginBtn").addEventListener("click", function () {
    // Create a guest user object
    const guestUser = {
        name: "Guest User",
        email: "guest@example.com",
        isGuest: true
    };

    // Store guest user info in session storage (temporary, clears when browser closes)
    // Using sessionStorage instead of localStorage for guest users
    sessionStorage.setItem("currentUser", JSON.stringify(guestUser));

    alert("Welcome, Guest User! Some features may be limited.");

    // Redirect to the main content page
    window.location.href = "loading.html";
});

// Event listener for the signup form submission
document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get form input values
    const name = document.getElementById("signup_name").value.trim();
    const email = document.getElementById("signup_email").value.trim();
    const password = document.getElementById("signup_password").value.trim();
    const confirmPassword = document.getElementById("signup_confirm_password").value.trim();

    // Validation checks
    if (!validateName(name)) {
        alert("Name must be at least 3 characters long and contain only alphabets.");
        return;
    }

    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!validatePassword(password)) {
        alert(
            "Password must be at least 8 characters long and include at least:\n" +
            "- 1 uppercase letter\n" +
            "- 1 lowercase letter\n" +
            "- 1 number\n" +
            "- 1 special character"
        );
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Check for duplicate email and save user data
    const users = JSON.parse(localStorage.getItem("users")) || []; // Retrieve existing users from localStorage
    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
        alert("Email is already registered. Please log in.");
        return;
    }

    // Add new user to localStorage
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful! Please log in.");
    // Switch to login tab instead of redirecting
    document.querySelector('[data-tab="login"]').click();
});

// Helper function to validate name
function validateName(name) {
    const nameRegex = /^[A-Za-z\s]{3,}$/; // Name must be at least 3 characters long and only contain alphabets and spaces
    return nameRegex.test(name);
}

// Helper function to validate email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email format
    return emailRegex.test(email);
}

// Helper function to validate password strength
function validatePassword(password) {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // Password must be at least 8 characters long and include:
    // - 1 uppercase letter
    // - 1 lowercase letter
    // - 1 digit
    // - 1 special character
    return passwordRegex.test(password);
}