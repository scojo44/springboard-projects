"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {NotFoundError, BadRequestError, UnauthorizedError,} = require("../expressError");
const Job = require('./job');

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT username, password, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"
      FROM users
      WHERE username = $1`,
      [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({ username, password, firstName, lastName, email, isAdmin }) {
    const duplicateCheck = await db.query(
      `SELECT username FROM users
      WHERE username = $1`,
      [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
      (username, password, first_name, last_name, email, is_admin)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        username,
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        is_admin AS "isAdmin"`,
      [username, hashedPassword, firstName, lastName, email, isAdmin],
    );

    const user = result.rows[0];
    return user;
  }

  /** Add job to user's applications
   * 
   * Returns { jobID }
   * 
   * Throws NotFoundError if user not found.
   */

  static async applyToJob(username, jobID) {
    // Trigger 404 if job doesn't exist
    const job = await Job.get(jobID);
    const user = await User.get(username);

    if(user.jobs.map(j => j.id).includes(jobID))
      throw new BadRequestError(`${username} has already applied to job #${jobID}`, 400);

    const result = await db.query(
      `INSERT INTO applications (username, job_id)
      VALUES ($1, $2)
      RETURNING job_id as "jobID"`,
      [username, jobID]
    );

    return result.rows[0];
  }

  /** Find all users.
   *
   * Returns [{ username, first_name, last_name, email, is_admin }, ...]
   **/

  static async findAll() {
    const result = await db.query(
      `SELECT
        username,
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        is_admin AS "isAdmin"
      FROM users
      ORDER BY username`,
    );

    const users = result.rows;
    return users
  }

  /** Given a username, return data about user.
   *
   * Returns { username, first_name, last_name, is_admin, jobs }
   *   where jobs is { id, title, companyHandle, companyName, state }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const result = await db.query(
      `SELECT
        username,
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        is_admin AS "isAdmin"
      FROM users
      WHERE username = $1`,
      [username],
    );

    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
    user.jobs = await User.getAppliedJobs(username);
    return user;
  }

  /** Get user's applied jobs.
   *
   * Returns [{id, title, companyHandle, companyName}, ...]
   **/

  static async getAppliedJobs(username) {
    const result = await db.query(
      `SELECT j.id, j.title, c.handle as "companyHandle", c.name as "companyName", a.state
      FROM applications a
      JOIN jobs j on j.id = a.job_id
      JOIN companies c on c.handle = j.company_handle
      WHERE username = $1`,
      [username]
    );

    return result.rows;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, isAdmin }
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setColumns, setValues } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    });
    const usernameVarIdx = "$" + (setValues.length + 1);

    const result = await db.query(
      `UPDATE users 
      SET ${setColumns} 
      WHERE username = ${usernameVarIdx} 
      RETURNING
        username,
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        is_admin AS "isAdmin"`,
      [...setValues, username]
    );

    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
      `DELETE FROM users
      WHERE username = $1
      RETURNING username`,
      [username],
    );

    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }
}


module.exports = User;
