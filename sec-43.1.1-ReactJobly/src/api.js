import axios from "axios"

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

export default class JoblyApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${JoblyApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Login the user.
   * 
   * credentials: {username, password}
   */

  static async login(credentials) {
    const res = await JoblyApi.request(`auth/token`, credentials, 'post');
    return res.token;
  }

  /** Register the new user.
   * 
   * newUser: {username, password, firstName, lastName, email}
   */

  static async signup(newUser) {
    const res = await JoblyApi.request(`auth/register`, newUser, 'post');
    return res.token;
  }

  /** Register the new user.
   * 
   * newUser: {username, password, firstName, lastName, email}
   */

  static async updateUser(user) {
    const {username, ...userInfo} = user;
    const res = await JoblyApi.request(`users/${username}`, userInfo, 'patch');
    return res.user;
  }

  /** Get a list of companies.
   * 
   * query: Object with search filters:
   * - nameLike: string to find case-insensitive, partial matches
   * - minEmployees: number
   * - maxEmployees: number
   */

  static async getCompanies(query) {
    const res = await JoblyApi.request(`companies`, query);
    return res.companies;
  }

  /** Get details on a company by handle. */

  static async getCompany(handle) {
    const res = await JoblyApi.request(`companies/${handle}`);
    return res.company;
  }

  /** Get a list of jobs.
   * 
   * query: Object with search filters:
   * - titleLike: string to find case-insensitive, partial matches
   * - salary: number
   * - equity: float between 0 and 1
   */

  static async getJobs(query) {
    const res = await JoblyApi.request(`jobs`, query);
    return res.jobs;
  }

  /** Get details on a job by id. */

  static async getJob(id) {
    const res = await JoblyApi.request(`jobs/${id}`);
    return res.job;
  }

  /** Get details on a user by username. */

  static async getUser(username) {
    const res = await JoblyApi.request(`users/${username}`);
    return res.user;
  }

  /** Add a job to a user's applied jobs. */

  static async applyToJob(username, jobID) {
    const res = await JoblyApi.request(`users/${username}/jobs`, {jobID}, 'post');
    return res.applied;
  }
}
