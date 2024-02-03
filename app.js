let auth0 = null;

const configureClient = async () => {
  auth0 = await createAuth0Client({
    domain: "dev-8t5n46gy508lquxf.us.auth0.com",
    client_id: "SkZvNHKTNnL4eX1VGEziFbZYM5aFKlS8",
    redirect_uri: 'https://end.xn--mk1bu44c',
  });
};

window.onload = async () => {
  await configureClient();
  
  // New: Check the authentication state before handling the redirect callback
  let isAuthenticated = await auth0.isAuthenticated();
  const query = window.location.search;
  
  if (query.includes("code=") && query.includes("state=")) {
    // Process the login state
    await auth0.handleRedirectCallback();
    isAuthenticated = await auth0.isAuthenticated(); // Update the isAuthenticated variable
    window.history.replaceState({}, document.title, window.location.pathname); // Use pathname to maintain the base path
  }

  updateUI(isAuthenticated); // Pass isAuthenticated as a parameter to updateUI
};

const updateUI = async (isAuthenticated) => {
  const loginBtn = document.getElementById('login');
  const logoutBtn = document.getElementById('logout');

  if (loginBtn && logoutBtn) {
    loginBtn.style.display = isAuthenticated ? 'none' : 'block';
    logoutBtn.style.display = isAuthenticated ? 'block' : 'none';
  }

  if (isAuthenticated) {
    // Fetch the user profile to check for registrationCompleted status
    const userProfile = await auth0.getUser();
    const registrationCompleted = userProfile['https://end.xn--mk1bu44c/user_metadata']?.registrationCompleted;

    if (registrationCompleted) {
      window.location.href = 'https://end.xn--mk1bu44c/index.html';
    } else {
      window.location.href = 'https://end.xn--mk1bu44c/registration.html';
    }
  }
};

// Removed the redundant checkAuthentication function, as its logic is now integrated into window.onload

const loginBtn = document.getElementById('login');
if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    await auth0.loginWithRedirect({
      redirect_uri: 'https://end.xn--mk1bu44c',
    });
  });
}

const logoutBtn = document.getElementById('logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    auth0.logout({
      returnTo: 'https://end.xn--mk1bu44c',
    });
  });
}
