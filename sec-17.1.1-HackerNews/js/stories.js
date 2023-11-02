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

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${getStarIcon(currentUser, story)}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Generate the star for favoriting a story.
 * Returns empty string if no user logged in
 */

function getStarIcon(user, story){
  if(!user) return "";

  const starClass = user.isFavorite(story)? "fas":"far";
  return `<span class="star ${starClass} fa-star"></span>`;
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
  console.log($storyList, stories, emptyMessage);
  $storyList.empty();

  if(stories.length === 0)
    $storyList.html(emptyMessage)

  // Loop through the stories and generate HTML for them
  for(let story of stories) {
    const $story = generateStoryMarkup(story);
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

  $newStoryForm.trigger("reset");
  $newStoryForm.hide();
  $allStoriesList.prepend(generateStoryMarkup(newStory));
}

$newStoryForm.on("submit", submitStory);

/** Toggle the star icon to show favorited status */

async function toggleFavoritedStory(e) {
  console.debug("toggleFavoritedStory");
  const $star = $(e.target);
  const $storyLI = $star.closest("li");
  const storiesToSearch = [...storyList.stories, ...currentUser.favorites];
  const story = storiesToSearch.find(s => s.storyId === $storyLI.attr("id"))
  const favorited = currentUser.isFavorite(story);

  await favorited? currentUser.removeFavorite(story) : currentUser.addFavorite(story);
  $star.toggleClass("far fas");
}

$anyStoriesList.on("click", ".star", toggleFavoritedStory);