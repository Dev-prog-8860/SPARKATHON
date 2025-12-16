// Simple client-side auth for demo purposes only.
// Stores users in localStorage under 'smortmart_users' as [{id, hash}]

async function hashString(str) {
    const enc = new TextEncoder();
    const data = enc.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function loadUsers() {
    try {
        return JSON.parse(localStorage.getItem('smortmart_users') || '[]');
    } catch (e) {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem('smortmart_users', JSON.stringify(users));
}

function showMessage(text, isError = true) {
    const el = document.getElementById('auth-message');
    if (!el) return;
    el.textContent = text;
    el.style.color = isError ? '#900' : '#080';
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('auth-form');
    const signinBtn = document.getElementById('signin-btn');
    const signupBtn = document.getElementById('signup-btn');

    const identifierInput = document.getElementById('identifier');
    const passwordInput = document.getElementById('password');

    if (!form || !signinBtn || !signupBtn) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        showMessage('Signing in...', false);
        const id = identifierInput.value.trim();
        const pw = passwordInput.value;
        if (!id || !pw) { showMessage('Please enter identifier and password.'); return; }

        const users = loadUsers();
        const user = users.find(u => u.id.toLowerCase() === id.toLowerCase());
        if (!user) { showMessage('No account found. Create one first or check your details.'); return; }

        const hashed = await hashString(pw);
        if (hashed === user.hash) {
            localStorage.setItem('smortmart_current', JSON.stringify({ id: user.id, loggedAt: Date.now() }));
            showMessage('Signed in — redirecting...', false);
            setTimeout(() => window.location.href = 'index.html', 700);
        } else {
            showMessage('Incorrect password.');
        }
    });

    signupBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const id = identifierInput.value.trim();
        const pw = passwordInput.value;
        if (!id || !pw) { showMessage('Please enter identifier and password to create an account.'); return; }

        // basic validation
        if (pw.length < 6) { showMessage('Password should be at least 6 characters.'); return; }

        const users = loadUsers();
        if (users.find(u => u.id.toLowerCase() === id.toLowerCase())) {
            showMessage('An account with that identifier already exists. Try signing in.');
            return;
        }

        showMessage('Creating account...', false);
        const hashed = await hashString(pw);
        users.push({ id, hash: hashed });
        saveUsers(users);
        localStorage.setItem('smortmart_current', JSON.stringify({ id, loggedAt: Date.now() }));
        showMessage('Account created — signed in. Redirecting...', false);
        setTimeout(() => window.location.href = 'index.html', 700);
    });
});
