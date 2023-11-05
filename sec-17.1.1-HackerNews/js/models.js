"use strict";

const API_BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {

  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }
  
  /** Generates an API story object */

  forAPI() {
    return {
      author: this.author,
      title: this.title,
      url: this.url
    };
  }

  /** Updates the story on the API. */

  async update() {
    try {
      const response = await axios.patch(API_BASE_URL + "/stories/" + this.storyId, {
        token: currentUser.loginToken,
        story: this.forAPI()
      });
      return new Story(response.data.story);
    }
    catch(error) {
      console.error("Story.update failed", error);
      return false;
    }
  }

  /** Parses hostname out of URL and returns it. */

  getHostName() {
    return new URL(this.url).hostname;
  }
}

/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  /** Make instance of StoryList from an array of Story instances */
  constructor() {
    this.stories = [];
    this.listOffset = 0;
  }

  /** Get the latest stories. It:
   *  - calls the API
   *  - builds an array of Story instances
   *  - adds the new stories to the stories array
   *  - returns any error
   * (Sorry, it's no longer a static method)
   */

  async getStories(skip = 0) {
    this.isGettingStories = true;

    try {
      // query the /stories endpoint (no auth required)
      const response = await axios.get(API_BASE_URL + "/stories", {
        params: { skip }
      });

      // turn plain old story objects from API into instances of Story class
      const newStories = response.data.stories.map(story => new Story(story));
      this.stories = [...this.stories, ...newStories];
      this.listOffset += newStories.length;
      this.isGettingStories = false;
      return true;
    }
    catch(error) {
      console.error("StoryList.getStories failed", error);
      this.isGettingStories = false;
      return error.response.data.error;
    }
  }

  /** Gets more stories */

  async getMoreStories() {
    return await this.getStories(this.listOffset);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

  async addStory(user, newStory) {
    let response;

    try {
      response = await axios.post(API_BASE_URL + "/stories", {
        token: user.loginToken,
        story: newStory
      });
    }
    catch(error) {
      console.error("StoryList.addStory failed", error);
      return null;
    }

    const story = new Story(response.data.story);
    this.stories.unshift(story);
    currentUser.ownStories.unshift(story);
    return story;
  }

  /** Deletes a story off the server
   * - story: The story to be deleted
   */

  async deleteStory(story) {
    try {
      const response = await axios.delete(API_BASE_URL + "/stories/" + story.storyId, {
        params: { token: currentUser.loginToken }
      });
      removeFromArray(this.stories, story);
      removeFromArray(currentUser.ownStories, story);
      removeFromArray(currentUser.favorites, story);
      return true;
    }
    catch(error) {
      console.error("StoryList.deleteStory failed", error);
      return false;
    }
  }
}

/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - apiUser: {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor(apiUser, token) {
    this.username = apiUser.username;
    this.name = apiUser.name;
    this.createdAt = apiUser.createdAt;
    this.loginToken = token;
    // Create Story instances for the user's favorites and ownStories
    this.favorites = apiUser.favorites? apiUser.favorites.map(s => new Story(s)) : [];
    this.ownStories = apiUser.stories? apiUser.stories.map(s => new Story(s)) : [];
  }

  /** Register new user in API, make User instance & return it.
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    try {
      const response = await axios.post(API_BASE_URL + "/signup", { user: { username, password, name } });
      return new User(response.data.user, response.data.token);
    }
    catch(error) {
      console.error("StoryList.signup failed", error);
      return error.response.data.error;
    }
  }

  /** Updates the user's profile on the API.
   * - newUser: { name, username, password }
   */

  static async update(updatedUser) {
    try {
      const response = await axios.patch(API_BASE_URL + "/users/" + currentUser.username, {
        token: currentUser.loginToken,
        user: updatedUser
      });
      return new User(response.data.user, currentUser.loginToken);
    }
    catch(error) {
      console.error("User.update failed", error);
      return error.response.data.error;
    }
  }

  /** Login in user with API, make User instance & return it.
   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    try {
      const response = await axios.post(API_BASE_URL + "/login", { user: { username, password } });
      return new User(response.data.user, response.data.token);
    }
    catch(error) {
      console.error("StoryList.login failed", error);
      return error.response.data.error;
    }
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios.get(API_BASE_URL + "/users/" + username, {
        params: { token }
      });
      return new User(response.data.user, token);
    }
    catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

  /** Add a story to user's favorites.
   * - story: A story instance to favorite
   */

  async addFavorite(story) {
    if(this.tryFavoriteAction(story, "add"))
      this.favorites.unshift(story);
  }

  /** Remove a story from the user's favorites.
   * - story: The story instance to unfavorite
   */

  async removeFavorite(story) {
    if(this.tryFavoriteAction(story, "remove"))
      removeFromArray(this.favorites, story);
  }

  /** Add or remove a story from the user's favorites using the API.
   * - story: The story instance
   * - action: Set to "add" or "remove"
   * 
   * Returns true or false whether the API call was successful
   */

  async tryFavoriteAction(story, action) {
    const method = action.toLowerCase() === "add"? "POST" : "DELETE";

    try {
      const response = await axios({
        url: `${API_BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
        method: method,
        data: {token: this.loginToken}
      });
      return true;
    }
    catch (err) {
      console.error(action + "Favorite failed", err);
      return false;
    }
  }

  /** Return true or false if a story is favorited by the user. */

  isFavorite(story) {
    return currentUser.favorites.some(s => s.storyId === story.storyId);
  }
}