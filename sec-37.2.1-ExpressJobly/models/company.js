"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate, sqlForWhereConditions } = require("../helpers/sql");
const Job = require('./job');

/** Related functions for companies. */

class Company {
  /** Create a company (from data), update db, return new company data.
   *
   * data should be { handle, name, description, numEmployees, logoUrl }
   *
   * Returns { handle, name, description, numEmployees, logoUrl }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create({ handle, name, description, numEmployees, logoUrl }) {
    const duplicateCheck = await db.query(
      `SELECT handle FROM companies
      WHERE handle = $1`,
      [handle]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate company: ${handle}`);

    const result = await db.query(
      `INSERT INTO companies (handle, name, description, num_employees, logo_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"`,
      [handle, name, description, numEmployees, logoUrl],
    );
    const company = result.rows[0];

    return company;
  }

  /** Find all companies.
   *
   * filters:  Optional object with the desired filters.  Find companies with...
   * - name: ...this string in the company name
   * - minEmployees: ...at least this number of employees
   * - maxEmployees: ...at most this number of employees
   * 
   * Returns [{ handle, name, description, numEmployees, logoUrl }, ...]
   * */

  static async findAll(filter = {}) {
    const {whereClause, whereValues} = sqlForWhereConditions(filter);
    const result = await db.query(
      `SELECT handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"
      FROM companies
      ${whereClause}
      ORDER BY name`,
      whereValues
    );
    return result.rows;
  }

  /** Given a company handle, return data about company.
   *
   * Returns { handle, name, description, numEmployees, logoUrl, jobs }
   *   where jobs is [{ id, title, salary, equity }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(handle) {
    const resCompany = await db.query(
      `SELECT handle, name, description,
        num_employees AS "numEmployees",
        logo_url AS "logoUrl"
      FROM companies
      WHERE handle = $1`,
      [handle]
    );

    const company = resCompany.rows[0];

    if(!company) throw new NotFoundError(`No company: ${handle}`);

    // Add the jobs
    const resJobs = await db.query(
      `SELECT id, title, salary, equity
      FROM jobs
      WHERE company_handle = $1`,
      [handle]
    );

    company.jobs = resJobs.rows;
    company.jobs.forEach(job => Job.fixStrings(job));
    return company;
  }

  /** Update company data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {name, description, numEmployees, logoUrl}
   *
   * Returns {handle, name, description, numEmployees, logoUrl}
   *
   * Throws NotFoundError if not found.
   */

  static async update(handle, data) {
    const { setColumns, setValues } = sqlForPartialUpdate(data, {
      numEmployees: "num_employees",
      logoUrl: "logo_url",
    });
    const handleVarIdx = "$" + (setValues.length + 1);

    const result = await db.query(
      `UPDATE companies
      SET ${setColumns} 
      WHERE handle = ${handleVarIdx} 
      RETURNING handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"`,
      [...setValues, handle]
    );

    const company = result.rows[0];
    if(!company) throw new NotFoundError(`No company: ${handle}`);
    return company;
  }

  /** Delete given company from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(handle) {
    const result = await db.query(
      `DELETE FROM companies
      WHERE handle = $1
      RETURNING handle`,
      [handle]
    );
    const company = result.rows[0];

    if(!company) throw new NotFoundError(`No company: ${handle}`);
  }
}


module.exports = Company;
