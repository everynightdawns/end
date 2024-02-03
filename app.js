let auth0 = null;

const configureClient = async () => {
  auth0 = await createAuth0Client({
    domain: "dev-8t5n46gy508lquxf.us.auth0.com",
    client_id: "SkZvNHKTNnL4eX1VGEziFbZYM5aFKlS8",
    redirect_uri: window.location.origin,
  });
};

window.onload = async () => {
  await configureClient();
  updateUI();
  // Check for the code and state parameters
  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    // Process the login state
    await auth0.handleRedirectCallback();
    // Use replaceState to redirect the user away and remove the querystring parameters
    window.history.replaceState({}, document.title, "/");
  }
  // Check if the user is authenticated
  await checkAuthentication();
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
    const idTokenClaims = await auth0.getIdTokenClaims();
    // Check if the registrationCompleted custom claim is present
    const registrationCompleted = idTokenClaims['https://end.xn--mk1bu44c/user_metadata/registrationCompleted'];
    
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
    console.log("User is not authenticated");
    // Show the login button or redirect to the login page
  } else {
    console.log("User is authenticated");
    // The user is authenticated, you can proceed with authenticated user flow
    updateUI(); // Call updateUI here to handle the authenticated user state.
  }
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
  logoutBtn.addEventListener('click', async () => {
    auth0.logout({
      returnTo: window.location.origin,
    });
  });
}
