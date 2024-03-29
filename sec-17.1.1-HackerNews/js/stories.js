"use strict";

// This is the global list of the stories, an instance of StoryList
const storyList = new StoryList();

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  // build an instance of our own class using the new array of stories
  const response = await storyList.getStories();

  // Check for and show error messages
  if(response.message) {
    showError(response.message);
  }

  $storiesLoadingMsg.remove();
  showAllStories();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, isMyStories = false) {
  // console.debug("generateStoryMarkup", story);

  return $(`
      <li id="${story.storyId}">
        ${getStarIcon(story)}
        ${isMyStories? getEditIcon() : ""}
        ${isMyStories? getDeleteIcon() : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${story.getHostName()})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Generate the icon for favoriting a story.
 * Returns empty string if no user logged in
 */

function getStarIcon(story) {
  if(!currentUser) return "";
  const starClass = currentUser.isFavorite(story)? "fas":"far";
  return `<span class="star ${starClass} fa-star"></span>`;
}

/** Generate the icon for deleting a story.
 * Returns empty string if no user logged in
 */

function getDeleteIcon() {
  if(!currentUser) return "";
  return `<span class="trashcan fas fa-trash"></span>`;
}

/** Generate the icon for editing a story.
 * Returns empty string if no user logged in
 */

function getEditIcon() {
  if(!currentUser) return "";
  return `<span class="edit fas fa-wrench"></span>`;
}

function showAllStories() {
  const emptyMsg = "<h4>No stories available</h4><p>Check your Internet connection?</p>";
  putStoriesOnPage($allStoriesList, storyList.stories, emptyMsg);
  hidePageComponents();
  $allStoriesList.show();
}

function showFavoriteStories() {
  const emptyMsg = "<h4>No favorite stories</h4><p>Click the star to favorite a story.</p>";
  putStoriesOnPage($favoriteStoriesList, currentUser.favorites, emptyMsg);
  hidePageComponents();
  $favoriteStoriesList.show();
}

function showMyStories() {
  const emptyMsg = "<h4>You have no stories</h4><p>Click the Sumbit link above to create your own!</p>";
  putStoriesOnPage($myStoriesList, currentUser.ownStories, emptyMsg);
  hidePageComponents();
  $myStoriesList.show();
}

/** Generates HTML for stories and puts them on the given page.
 * - storyList:  HTML list element to fill in
 * - stories:  A list of Story instances to show
 * - emptyMessage:  A message for when there are no stories to show
 *
 * Returns the markup for the story.
 */

function putStoriesOnPage($storyList, stories, emptyMessage) {
  console.debug("putStoriesOnPage");
  $storyList.empty();

  if(stories.length === 0)
    $storyList.html(emptyMessage)

  // Loop through the stories and generate HTML for them
  for(let story of stories) {
    const $story = generateStoryMarkup(story, $storyList === $myStoriesList);
    $storyList.append($story);
  }

  $storyList.show();
}

/** Submits a new story */

async function submitStory(evt) {
  console.debug("submitStory", evt);
  evt.preventDefault();

  const formStoryID = $("#story-id").val(); // A hidden <input> tells us if we're editing a story.
  let story;

  if(formStoryID) {
    // Update existing story
    story = currentUser.ownStories.find(s => s.storyId === formStoryID);
    story.author = $("#story-author").val();
    story.title = $("#story-title").val();
    story.url = $("#story-url").val();

    if(story.update()) {
      // Update story in My Stories and the main stories list
      showMyStories();
      const storyIndex = storyList.stories.findIndex(s => s.storyId === story.storyId);
      storyList.stories[storyIndex] = story;
      $("#story-id").val(""); // Reset the hidden story ID
    }
  }
  else {
    // Sumbit a new story
    story = await storyList.addStory(currentUser, {
      author: $("#story-author").val(),
      title: $("#story-title").val(),
      url: $("#story-url").val()
    });
    $allStoriesList.prepend(generateStoryMarkup(story));
    $myStoriesList.prepend(generateStoryMarkup(story, true));
  }

  $newStoryForm.trigger("reset");
  $newStoryForm.hide();
}

$newStoryForm.on("submit", submitStory);

/** Cancels the story submission/edit form */

function cancelStorySubmit() {
  $newStoryForm.hide();
}

$("#add-story-cancel").on("click", cancelStorySubmit);

/** Edits a story in the new story form */

async function editStory(e) {
  const $storyLI = $(e.target).closest("li");
  const story = currentUser.ownStories.find(s => s.storyId === $storyLI.attr("id"));

  $("#story-author").val(story.author);
  $("#story-title").val(story.title);
  $("#story-url").val(story.url);
  $("#story-id").val(story.storyId);
  $newStoryForm.show();
}

$myStoriesList.on("click", ".edit", editStory);

/** Removes a story from the list */

async function removeStory(e) {
  const $storyLI = $(e.target).closest("li");
  const story = currentUser.ownStories.find(s => s.storyId === $storyLI.attr("id"));

  // Remove story from the story list pages unless there's a problem deleting it.
  if(await storyList.deleteStory(story)) {
    $myStoriesList.find("#" + story.storyId).remove();
  }
}

$myStoriesList.on("click", ".trashcan", removeStory);

/** Toggle the star icon to show favorited status */

async function toggleFavoritedStory(e) {
  console.debug("toggleFavoritedStory");
  const $star = $(e.target);
  const $storyLI = $star.closest("li");
  const storiesToSearch = [...storyList.stories, ...currentUser.favorites];
  const story = storiesToSearch.find(s => s.storyId === $storyLI.attr("id"));

  if(currentUser.isFavorite(story))
    await currentUser.removeFavorite(story);
  else
    await currentUser.addFavorite(story);

  $star.toggleClass("far fas");
}

$anyStoriesList.on("click", ".star", toggleFavoritedStory);

function whenScrollingStoryList(e) {
  const storyListBottom = $allStoriesList[0].getBoundingClientRect().bottom;
  const lastStoryTop = $("#all-stories-list li:last-child")[0].getBoundingClientRect().top;
  
  if(!storyList.isGettingStories && lastStoryTop < storyListBottom) {
    const response = storyList.getMoreStories();
    // Check for and show error messages
    if(response.message) {
      showError(response.message);
      return;
    }
    showAllStories();
  }
}

$allStoriesList.on("scroll", whenScrollingStoryList);