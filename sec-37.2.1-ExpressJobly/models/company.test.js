"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("./_testCommon");
const Company = require("./company.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newCompany = {
    handle: "new",
    name: "New",
    description: "New Description",
    numEmployees: 1,
    logoUrl: "http://new.img"
  };

  test("works", async function () {
    let company = await Company.create(newCompany);
    expect(company).toEqual(newCompany);

    const result = await db.query(
      `SELECT handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"
      FROM companies
      WHERE handle = 'new'`
    );

    expect(result.rows).toEqual([newCompany]);
  });

  test("bad request with dupe", async function () {
    try {
      await Company.create(newCompany);
      await Company.create(newCompany);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  const c1 = {
    handle: "c1",
    name: "C1",
    description: "Desc1",
    numEmployees: 1,
    logoUrl: "http://c1.img"
  };
  const c2 = {
    handle: "c2",
    name: "C2",
    description: "Desc2",
    numEmployees: 2,
    logoUrl: "http://c2.img"
  };
  const c3 = {
    handle: "c3",
    name: "C3",
    description: "Desc3",
    numEmployees: 3,
    logoUrl: "http://c3.img"
  };

  test("works: no filter", async function () {
    const companies = await Company.findAll();
    expect(companies).toEqual([c1, c2, c3]);
  });

  test("filter by name", async function () {
    const companies = await Company.findAll({nameLike: 'C3'});
    expect(companies).toEqual([c3]);
  });

  test("filter by minimum employees", async function () {
    const companies = await Company.findAll({minEmployees: 2});
    expect(companies).toEqual([c2, c3]);
  });

  test("filter by maximum employees", async function () {
    const companies = await Company.findAll({maxEmployees: 2});
    expect(companies).toEqual([c1, c2]);
  });

  test("filter by minimum and maximum employees", async function () {
    const companies = await Company.findAll({minEmployees: 2, maxEmployees: 2});
    expect(companies).toEqual([c2]);
  });
});

/************************************** get */

describe("get", function () {
  test("works with jobs", async function () {
    let company = await Company.get("c1");
    expect(company).toEqual({
      handle: "c1",
      name: "C1",
      description: "Desc1",
      numEmployees: 1,
      logoUrl: "http://c1.img",
      jobs: [
        {
          id: expect.any(Number),
          title: "J1a",
          salary: 150000,
          equity: .1
        },
        {
          id: expect.any(Number),
          title: "J1b",
          salary: 120000,
          equity: 0
        }
      ]
    });
  });

  test("works without jobs", async function () {
    let company = await Company.get("c2");
    expect(company).toEqual({
      handle: "c2",
      name: "C2",
      description: "Desc2",
      numEmployees: 2,
      logoUrl: "http://c2.img",
      jobs: []
    });
  });

  test("not found if no such company", async function () {
    try {
      await Company.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    name: "New",
    description: "New Description",
    numEmployees: 10,
    logoUrl: "http://new.img"
  };

  test("works", async function () {
    let company = await Company.update("c1", updateData);
    expect(company).toEqual({
      handle: "c1",
      ...updateData
    });

    const result = await db.query(
      `SELECT handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"
      FROM companies
      WHERE handle = 'c1'`
    );

    expect(result.rows).toEqual([{
      handle: "c1",
      ...updateData
    }]);
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      name: "New",
      description: "New Description",
      numEmployees: null,
      logoUrl: null
    };

    let company = await Company.update("c1", updateDataSetNulls);
    expect(company).toEqual({
      handle: "c1",
      ...updateDataSetNulls
    });

    const result = await db.query(
      `SELECT handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"
      FROM companies
      WHERE handle = 'c1'`
    );

    expect(result.rows).toEqual([{
      handle: "c1",
      ...updateDataSetNulls
    }]);
  });

  test("not found if no such company", async function () {
    try {
      await Company.update("nope", updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Company.update("c1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Company.remove("c1");
    const res = await db.query("SELECT handle FROM companies WHERE handle='c1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such company", async function () {
    try {
      await Company.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
