let auth0 = null;

const configureClient = async () => {
  auth0 = await createAuth0Client({
    domain: "dev-8t5n46gy508lquxf.us.auth0.com",
    client_id: "SkZvNHKTNnL4eX1VGEziFbZYM5aFKlS8",
    redirect_uri: window.location.origin,
  });
};

const updateUI = async () => {
  const isAuthenticated = await auth0.isAuthenticated();
  const loginBtn = document.getElementById('login');
  const logoutBtn = document.getElementById('logout');
  
  if (isAuthenticated) {
    const userProfile = await auth0.getUser();
    const registrationCompleted = userProfile['https://end.xn--mk1bu44c/user_metadata']?.registrationCompleted;

    if (!registrationCompleted && window.location.pathname !== "/registration.html") {
      // Redirect to registration if not completed, but not if already on registration page
      window.location.href = 'https://end.xn--mk1bu44c/registration.html';
      return; // Exit function to avoid further UI updates until redirection completes
    }

    if (registrationCompleted) {
      // Redirect to the main page if registration is completed
      window.location.href = 'https://end.xn--mk1bu44c/index.html';
      return; // Exit function to avoid further UI updates until redirection completes
    }
  }

  // Update UI elements based on authentication status
  if (loginBtn && logoutBtn) {
    loginBtn.style.display = isAuthenticated ? 'none' : 'block';
    logoutBtn.style.display = isAuthenticated ? 'block' : 'none';
  }
};

window.onload = async () => {
  await configureClient();
  const query = window.location.search;
  
  if (query.includes("code=") && query.includes("state=")) {
    // Process the login state
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  await updateUI();
};

const loginBtn = document.getElementById('login');
if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    await auth0.loginWithRedirect({
      redirect_uri: window.location.origin,
    });
  });
}

const logoutBtn = document.getElementById('logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    auth0.logout({
      returnTo: window.location.origin,
    });
  });
}

// Global function to check if the user is authenticated
window.checkUserAuthentication = async () => {
  return await auth0.isAuthenticated();
};
