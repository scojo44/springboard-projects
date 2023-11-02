"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage($allStoriesList, storyList.stories, NO_STORIES_AVAILABLE_HTML);
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show new story form when click on "Add Story" */

function navNewStory(evt) {
  console.debug("navNewStory", evt);
  $newStoryForm.show();
}

$body.on("click", "#nav-new-story", navNewStory);

/** Show new story form when click on "Add Story" */

function navFavorites(evt) {
  console.debug("navFavorites", evt);
  hidePageComponents();
  putStoriesOnPage($favoriteStoriesList, currentUser.favorites, NO_STORIES_FAVORITED_HTML);
}

$("#nav-favorites").on("click", navFavorites);

function navMyStories(evt) {
  console.log("navMyStories this", this);
  console.debug("navMyStories", evt);
  hidePageComponents();
  putStoriesOnPage($myStoriesList, currentUser.ownStories, NO_STORIES_BY_USER_HTML);
}

$("#nav-my-stories").on("click", navMyStories);

