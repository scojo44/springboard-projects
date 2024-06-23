"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate, sqlForWhereConditions } = require("../helpers/sql");

/** Related functions for jobs. */

class Job {
  /** Create a job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, companyHandle }
   *
   * Returns { id, title, salary, equity, companyHandle }
   * */

  static async create({ title, salary, equity, companyHandle }) {
    const result = await db.query(
      `INSERT INTO jobs (title, salary, equity, company_handle)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, salary, equity, company_handle as "companyHandle"`,
      [title, salary, equity, companyHandle],
    );

    const job = result.rows[0];
    Job.fixStrings(job);
    return job;
  }

  /** Find all jobs.
   *
   * filters:  Optional object with the desired filters.  Find jobs with...
   * - title: ...this string in the job title
   * - minSalary: ...at least this much salary
   * - hasEquity: ...any amount of equity
   * 
   * Returns [{ id, title, salary, equity, company_handle }, ...]
   * */

  static async findAll(filter = {}) {
    const {whereClause, whereValues} = sqlForWhereConditions(filter);
    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle as "companyHandle"
      FROM jobs
      ${whereClause}
      ORDER BY company_handle, title, id`,
      whereValues
    );
    result.rows.forEach(job => Job.fixStrings(job));
    return result.rows;
  }

  /** Given a job ID, return data about job.
   *
   * Returns { id, title, salary, equity, company_handle }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle as "companyHandle"
      FROM jobs
      WHERE id = $1`,
      [id]
    );

    const job = result.rows[0];

    if(!job) throw new NotFoundError(`No job: ${id}`);

    Job.fixStrings(job);
    return job;
  }

  /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {title, salary, equity}
   *
   * Returns { id, title, salary, equity, company_handle }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setColumns, setValues } = sqlForPartialUpdate(data, {
      numEmployees: "num_employees",
      logoUrl: "logo_url",
    });
    const idVarIdx = "$" + (setValues.length + 1);

    const result = await db.query(
      `UPDATE jobs
      SET ${setColumns} 
      WHERE id = ${idVarIdx} 
      RETURNING id, title, salary, equity, company_handle as "companyHandle"`,
      [...setValues, id]);

    const job = result.rows[0];
    if(!job) throw new NotFoundError(`No job: ${id}`);
    Job.fixStrings(job);
    return job;
  }

  /** Delete given job from database; returns undefined.
   *
   * Throws NotFoundError if job not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE FROM jobs
      WHERE id = $1
      RETURNING id`,
      [id]
    );
    const job = result.rows[0];

    if(!job) throw new NotFoundError(`No job: ${id}`);
  }

  /** Convert some fields from strings to the expected data type.
   *  So far, dates and float numbers have this problem.
   */
  static async fixStrings(job) {
    if(job.equity !== null)
      job.equity = +job.equity;
  }
}


module.exports = Job;
