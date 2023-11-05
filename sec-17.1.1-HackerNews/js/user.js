"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  // Check for and show error messages
  if(!currentUser.username) {
    showError(currentUser.message);
    return;
  }

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
  $loginForm.trigger("reset");
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  // Check for and show error messages
  if(!currentUser.username) {
    showError(currentUser.message);
    return;
  }

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");
  $accountFormsContainer.hide();
  $userProfileContainer.hide();
  $storiesContainer.show();
  $errorMessage.hide();
  showAllStories();
  updateNavOnLogin();
}

/** Fill in user profile form */

function showUserProfileForm() {
  $storiesContainer.hide();
  $userListContainer.hide();
  $userProfileContainer.show();
  $("#profile-name").val(currentUser.name);
  $("#profile-username").val(currentUser.username);
  $("#profile-password").val(currentUser.password);
}

/** Cancel the user profile update */

function hideUserProfileForm() {
  $profileForm.trigger("reset");
  $userProfileContainer.hide();
  $storiesContainer.show();
}

$("#profile-cancel").on("click", hideUserProfileForm);

/** Prepares user profile update to be submitted */

async function updateProfile(e) {
  e.preventDefault();
  const inputName = $("#profile-name").val();
  const inputUser = $("#profile-username").val();
  const inputPass = $("#profile-password").val();
  const newUser = { password: inputPass };

  // Send only the changed items, except password which isn't clientside
  if(inputName !== currentUser.name) newUser.name = inputName;
  if(inputUser !== currentUser.username) newUser.username = inputUser;
  const updatedUser = await User.update(newUser);

  // Check for and show error messages
  if(!updatedUser.username) {
    showError(updatedUser.message);
    return;
  }
  
  // Make changes only if there was no error
  $profileForm.trigger("reset");
  currentUser = updatedUser;
  updateUIOnUserLogin();
  showSuccess("Your profile was successfully updated");
}

$profileForm.on("submit", updateProfile)

/** Show the User List page */

async function showUserList() {
  await getUserList();
  $storiesContainer.hide();
  $userProfileContainer.hide();
  $userListContainer.show();
}

/** Generates the listitems for the user list */

async function getUserList() {
  const skip = $("#user-list-skip").val();
  if(!skip || +skip === NaN)
    skip = 0;

  const users = await User.getUsers(skip);
  
  // Check for and show error messages
  if(users.message) {
    showError(users.message);
    return false;
  }

  $userList.empty();

  // Fill in the users
  for(let user of users) {
    const userLI = $(`<li><strong>${user.username}</strong> - ${user.name}</li>`);
    $userList.append(userLI);
  }
}

$("#user-list-form").on("submit", getUserList)