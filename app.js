let auth0 = null;

const configureClient = async () => {
  auth0 = await createAuth0Client({
    domain: "dev-8t5n46gy508lquxf.us.auth0.com",
    client_id: "SkZvNHKTNnL4eX1VGEziFbZYM5aFKlS8",
    redirect_uri: window.location.origin
  });
};

window.onload = async () => {
  await configureClient();
  // Update UI state based on user authentication
  updateUI();
  const isAuthenticated = await auth0.isAuthenticated();
  if (isAuthenticated) {
    // show the gated content
    return;
  }
  // Check for the code and state parameters
  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    // Process the login state
    await auth0.handleRedirectCallback();
    updateUI();
    // Use replaceState to redirect the user away and remove the querystring parameters
    window.history.replaceState({}, document.title, "/");
  }
};

const updateUI = async () => {
  const isAuthenticated = await auth0.isAuthenticated();
  const loginBtn = document.getElementById('login');
  const logoutBtn = document.getElementById('logout');

  if (loginBtn && logoutBtn) {
      loginBtn.style.display = isAuthenticated ? 'none' : 'block';
      logoutBtn.style.display = isAuthenticated ? 'block' : 'none';
  }

  if (isAuthenticated) {
    // Fetch the user profile
    const userProfile = await auth0.getUser();
    // Check if the registration is completed
    const registrationCompleted = userProfile['https://end.xn--mk1bu44c/user_metadata'].registrationCompleted;

    if (registrationCompleted) {
      // User is authenticated and registration is completed
      // Show the main content or redirect to the main page
      window.location.href = 'https://end.xn--mk1bu44c/main.html'; // Replace with the path to your main content
    } else {
      // User is authenticated but registration is not completed
      // Redirect to the registration page
      window.location.href = 'https://end.xn--mk1bu44c/registration.html';
    }
  }
};

const loginBtn = document.getElementById('login');
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        await auth0.loginWithRedirect({
            redirect_uri: window.location.origin
        });
    });
}

const logoutBtn = document.getElementById('logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        auth0.logout({
            returnTo: window.location.origin
        });
    });
}