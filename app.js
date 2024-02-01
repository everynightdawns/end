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
  document.getElementById('login').style.display = isAuthenticated ? 'none' : 'block';
  document.getElementById('logout').style.display = isAuthenticated ? 'block' : 'none';
};

document.getElementById('login').addEventListener('click', async () => {
  await auth0.loginWithRedirect({
    redirect_uri: window.location.origin
  });
});

document.getElementById('logout').addEventListener('click', async () => {
  auth0.logout({
    returnTo: window.location.origin
  });
});
