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

  // Check for the code and state parameters indicating a redirect from Auth0
  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    // Process the login state
    try {
      await auth0.handleRedirectCallback();
      console.log("Authentication successful!");
      // Optionally, redirect the user or update the application state here
    } catch (err) {
      console.error("Error handling the redirect callback:", err);
    }
    // Clean the query parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Now check if the user is authenticated
  await checkAuthentication();
  updateUI();
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
    const registrationCompleted = userProfile['https://end.xn--mk1bu44c/user_metadata']?.registrationCompleted;

    if (registrationCompleted) {
      // User is authenticated and registration is completed
      window.location.href = 'https://end.xn--mk1bu44c/index.html';
    } else {
      // User is authenticated but registration is not completed
      window.location.href = 'https://end.xn--mk1bu44c/registration.html';
    }
  }
};

const checkAuthentication = async () => {
  const isAuthenticated = await auth0.isAuthenticated();
  if (!isAuthenticated) {
    // Handle unauthenticated user here. For example, redirect to login page or show a login button.
    console.log("User is not authenticated");
    // Optional: Redirect to login
    // window.location.href = 'https://end.xn--mk1bu44c/login.html'; // Adjust URL as needed
  } else {
    console.log("User is authenticated");
    // Optional: Proceed with authenticated user flow
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
