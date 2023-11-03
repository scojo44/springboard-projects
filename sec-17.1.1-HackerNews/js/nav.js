"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  showAllStories();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  $storiesContainer.hide();
  $accountFormsContainer.show();
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

function navSubmitStory(evt) {
  console.debug("navSubmitStory", evt);
  $newStoryForm.show();
}

$("#nav-new-story").on("click", navSubmitStory);
$("#add-story-cancel").on("click", e => $newStoryForm.hide());

/** Show new story form when click on "Add Story" */

function navFavorites(evt) {
  console.debug("navFavorites", evt);
  showFavoriteStories();
}

$("#nav-favorites").on("click", navFavorites);

function navMyStories(evt) {
  console.debug("navMyStories", evt);
  showMyStories();
}

$("#nav-my-stories").on("click", navMyStories);

