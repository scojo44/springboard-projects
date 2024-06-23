"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: 'New',
    salary: 150000,
    equity: .1,
    companyHandle: 'c1'
  };

  test("works", async function () {
    const job = await Job.create(newJob);
    expect(job).toEqual({
      id: expect.any(Number),
      ...newJob
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle as "companyHandle"
      FROM jobs
      WHERE title = 'New'`
    );

    Job.fixStrings(result.rows[0]);
    expect(result.rows[0]).toEqual({
      id: expect.any(Number),
      ...newJob
    });
  });
});

/************************************** findAll */

describe("findAll", function () {
  const j1a = {
    id: expect.any(Number),
    title: "J1a",
    salary: 150000,
    equity: .1,
    companyHandle: "c1"
  };
  const j1b = {
    id: expect.any(Number),
    title: "J1b",
    salary: 120000,
    equity: 0,
    companyHandle: "c1"
  };
  const j3 = {
    id: expect.any(Number),
    title: "J3",
    salary: 300000,
    equity: null,
    companyHandle: "c3"
  };

  test("works: no filter", async function () {
    const jobs = await Job.findAll();
    expect(jobs).toEqual([j1a, j1b, j3]);
  });

  test("filter by title", async function () {
    const jobs = await Job.findAll({titleLike: 'J3'});
    expect(jobs).toEqual([j3]);
  });

  test("filter by minSalary", async function () {
    const jobs = await Job.findAll({minSalary: 150000});
    expect(jobs).toEqual([j1a, j3]);
  });

  test("filter by hasEquity:true", async function () {
    const jobs = await Job.findAll({hasEquity: true});
    expect(jobs).toEqual([j1a]);
  });

  test("filter by hasEquity:false", async function () {
    const jobs = await Job.findAll({hasEquity: false});
    expect(jobs).toEqual([j1a, j1b, j3]); // Exercise says to show all jobs in this case
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    const job = await Job.get(1);
    expect(job).toEqual({
      id: expect.any(Number),
      title: "J1a",
      salary: 150000,
      equity: .1,
      companyHandle: "c1"
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get(999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title: "New",
    salary: 159999,
    equity: .09
  };

  test("works", async function () {
    const job = await Job.update(1, updateData);
    expect(job).toEqual({
      id: expect.any(Number),
      companyHandle: 'c1',
      ...updateData
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle as "companyHandle"
      FROM jobs
      WHERE id = $1`, [1]
    );

    Job.fixStrings(result.rows[0]);
    expect(result.rows[0]).toEqual({
      id: expect.any(Number),
      companyHandle: 'c1',
      ...updateData
    });
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      title: "New",
      salary: null,
      equity: null
    };

    const job = await Job.update(1, updateDataSetNulls);
    expect(job).toEqual({
      id: expect.any(Number),
      companyHandle: 'c1',
      ...updateDataSetNulls
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle as "companyHandle"
      FROM jobs
      WHERE id = $1`, [1]
    );

    expect(result.rows).toEqual([{
      id: expect.any(Number),
      companyHandle: 'c1',
      ...updateDataSetNulls
    }]);
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(999, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update("c1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(3);
    const res = await db.query("SELECT id FROM jobs WHERE id=$1", [3]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** fixStrings */

describe("remove", function () {
  test("works with .1", async function () {
    const job = {equity: ".1"};
    Job.fixStrings(job);
    expect(job).toEqual({equity: .1})
  });

  test("works with .01", async function () {
    const job = {equity: ".01"};
    Job.fixStrings(job);
    expect(job).toEqual({equity: .01})
  });

  test("works with 0.01", async function () {
    const job = {equity: "0.01"};
    Job.fixStrings(job);
    expect(job).toEqual({equity: .01})
  });
});
