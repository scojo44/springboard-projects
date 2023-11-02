"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage($allStoriesList, storyList.stories, NO_STORIES_AVAILABLE_HTML);
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, addDeleteButton = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${addDeleteButton? getDeleteIcon():""}
        ${getStarIcon(story)}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Generate the star icon for favoriting a story.
 * Returns empty string if no user logged in
 */

function getStarIcon(story){
  if(!currentUser) return "";

  const starClass = currentUser.isFavorite(story)? "fas":"far";
  return `<span class="star ${starClass} fa-star"></span>`;
}

/** Generate the trash icon for deleting a story.
 * Returns empty string if no user logged in
 */

function getDeleteIcon(){
  if(!currentUser) return "";

  return `<span class="trashcan fas fa-trash"></span>`;
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

  // StoryList.addStory submits a new story to the API and returns the story with more detalis.
  const newStory = await storyList.addStory(currentUser, {
    author: $("#new-story-author").val(),
    title: $("#new-story-title").val(),
    url: $("#new-story-url").val()
  });

  $allStoriesList.prepend(generateStoryMarkup(newStory));
  $myStoriesList.prepend(generateStoryMarkup(newStory, true));
  $newStoryForm.trigger("reset");
  $newStoryForm.hide();
}

$newStoryForm.on("submit", submitStory);

/** Removes a story from the list */

async function removeStory(e) {
  const $trashcan = $(e.target);
  const $storyLI = $trashcan.closest("li");
  const story = currentUser.ownStories.find(s => s.storyId === $storyLI.attr("id"));

  // Rmove story from each page it might be on.
  if(await storyList.deleteStory(story)) {
    $myStoriesList.find("#" + story.storyId).remove();
  }
}

$anyStoriesList.on("click", ".trashcan", removeStory);

/** Toggle the star icon to show favorited status */

async function toggleFavoritedStory(e) {
  console.debug("toggleFavoritedStory");
  const $star = $(e.target);
  const $storyLI = $star.closest("li");
  const storiesToSearch = [...storyList.stories, ...currentUser.favorites];
  const story = storiesToSearch.find(s => s.storyId === $storyLI.attr("id"));
  const favorited = currentUser.isFavorite(story);

  await favorited? currentUser.removeFavorite(story) : currentUser.addFavorite(story);
  $star.toggleClass("far fas");
}

$anyStoriesList.on("click", ".star", toggleFavoritedStory);