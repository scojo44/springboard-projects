"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:
const $body = $("body");
const $errorContainer = $(".error-container");

const $storiesContainer = $(".stories-container");
const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");
const $favoriteStoriesList = $("#favorite-stories-list");
const $myStoriesList = $("#my-stories-list");
const $anyStoriesList = $(".stories-list");
const $newStoryForm = $("#new-story-form");

const $accountFormsContainer = $(".account-forms-container");
const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");

/** Array helper function to remove an element */

function removeFromArray(array, thingToRemove) {
  array.splice(array.indexOf(thingToRemove),1);
}

/** Displays error messages on top */

function showError(msg) {
  $("#error-message").html(msg);
  $errorContainer.show();
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
