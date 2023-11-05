"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:
const $body = $("body");
const $successMessage = $("#success-message");
const $errorMessage = $("#error-message");

const $storiesContainer = $(".stories-container");
const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");
const $favoriteStoriesList = $("#favorite-stories-list");
const $myStoriesList = $("#my-stories-list");
const $anyStoriesList = $(".stories-list");
const $newStoryForm = $("#story-form");

const $accountFormsContainer = $(".account-forms-container");
const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");

const $userProfileContainer = $(".user-profile-container");
const $profileForm = $("#profile-form");

const $userListContainer = $(".user-list-container");
const $userList = $("#user-list");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [
    $allStoriesList,
    $favoriteStoriesList,
    $myStoriesList,
    $userListContainer,
    $successMessage
  ];
  components.forEach(c => c.hide());
  hideUserProfileForm();
}

/** Array helper function to remove an element */

function removeFromArray(array, thingToRemove) {
  array.splice(array.indexOf(thingToRemove),1);
}

/** Displays positive messages on top */

function showSuccess(msg) {
  $successMessage.html(msg);
  $successMessage.show();
}

/** Displays error messages on top */

function showError(msg) {
  $errorMessage.html(msg);
  $errorMessage.show();
}

/** Cleans up the error/success messages */

function hideMessages() {
  $errorMessage.hide();
  $successMessage.hide();
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app

console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);
