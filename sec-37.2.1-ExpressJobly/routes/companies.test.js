"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");
const { BadRequestError } = require('../expressError');

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  tokenUser1,
  tokenUser2Admin
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /companies */

describe("POST /companies", function () {
  const newCompany = {
    handle: "new",
    name: "New",
    logoUrl: "http://new.img",
    description: "DescNew",
    numEmployees: 10,
  };

  test("ok for admins", async function () {
    const resp = await request(app)
        .post("/companies")
        .send(newCompany)
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({company: newCompany});
  });

  test("unauth for non-admin users", async function () {
    const resp = await request(app)
        .post("/companies")
        .send(newCompany)
        .set("authorization", `Bearer ${tokenUser1}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/companies")
        .send({
          handle: "new",
          numEmployees: 10,
        })
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/companies")
        .send({
          ...newCompany,
          logoUrl: "not-a-url",
        })
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /companies */

describe("GET /companies", function () {
  const c1 = {
    handle: "c1",
    name: "C1",
    description: "Desc1",
    numEmployees: 1,
    logoUrl: "http://c1.img",
  };
  const c2 = {
    handle: "c2",
    name: "C2",
    description: "Desc2",
    numEmployees: 2,
    logoUrl: "http://c2.img",
  };
  const c3 = {
    handle: "c3",
    name: "C3",
    description: "Desc3",
    numEmployees: 3,
    logoUrl: "http://c3.img",
  };

  test("ok for anon", async function () {
    const resp = await request(app).get("/companies");
    expect(resp.body).toEqual({companies: [c1, c2, c3]});
  });

  test("filter by name", async function () {
    const resp = await request(app)
      .get("/companies")
      .query({nameLike: 2});
    expect(resp.body).toEqual({companies: [c2]});
  });

  test("filter by minimum employees", async function () {
    const resp = await request(app)
      .get("/companies")
      .query({minEmployees: 2});
    expect(resp.body).toEqual({companies: [c2, c3]});
  });

  test("filter by maximum employees", async function () {
    const resp = await request(app)
      .get("/companies")
      .query({maxEmployees: 2});
    expect(resp.body).toEqual({companies: [c1, c2]});
  });

  test("filter by miniumum and maximum employees", async function () {
    const resp = await request(app)
      .get("/companies")
      .query({
        minEmployees: 2,
        maxEmployees: 2
      });
    expect(resp.body).toEqual({companies: [c2]});
  });

  test("bad request if miniumum employees more than maximum", async function () {
    const resp = await request(app)
      .get("/companies")
      .query({
        minEmployees: 1000,
        maxEmployees: 2
      });
    expect(resp.status).toBe(400);
  });

  test("bad request if filtering by unavailable option", async function () {
    const resp = await request(app)
      .get("/companies")
      .query({xyzzy: 'Nothing happens.'});
    expect(resp.status).toBe(400);
  });

  test("bad request if filtering by available and unavailable options", async function () {
    const resp = await request(app)
      .get("/companies")
      .query({
        xyzzy: 'Nothing happens.',
        maxEmployees: 2
      });
    expect(resp.status).toBe(400);
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE companies CASCADE");
    const resp = await request(app)
        .get("/companies")
        .set("authorization", `Bearer ${tokenUser1}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /companies/:handle */

describe("GET /companies/:handle", function () {
  test("works for anon", async function () {
    const resp = await request(app).get(`/companies/c1`);
    expect(resp.body.company).toEqual({
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

  test("works for anon: company w/o jobs", async function () {
    const resp = await request(app).get(`/companies/c2`);
    expect(resp.body.company).toEqual({
      handle: "c2",
      name: "C2",
      description: "Desc2",
      numEmployees: 2,
      logoUrl: "http://c2.img",
      jobs: []
    });
  });

  test("not found for no such company", async function () {
    const resp = await request(app).get(`/companies/nope`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /companies/:handle */

describe("PATCH /companies/:handle", function () {
  test("works for admins", async function () {
    const resp = await request(app)
        .patch(`/companies/c1`)
        .send({name: "C1-new"})
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.body.company).toEqual({
      handle: "c1",
      name: "C1-new",
      description: "Desc1",
      numEmployees: 1,
      logoUrl: "http://c1.img"
    });
  });

  test("unauth for non-admin users", async function () {
    const resp = await request(app)
        .patch(`/companies/c1`)
        .send({name: "C1-new"})
        .set("authorization", `Bearer ${tokenUser1}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/companies/c1`)
        .send({name: "C1-new"});
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such company", async function () {
    const resp = await request(app)
        .patch(`/companies/nope`)
        .send({name: "new nope"})
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on handle change attempt", async function () {
    const resp = await request(app)
        .patch(`/companies/c1`)
        .send({handle: "c1-new"})
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on invalid data", async function () {
    const resp = await request(app)
        .patch(`/companies/c1`)
        .send({logoUrl: "not-a-url"})
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on no data", async function () {
    const resp = await request(app)
        .patch(`/companies/c1`)
        .send({})
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /companies/:handle */

describe("DELETE /companies/:handle", function () {
  test("works for admins", async function () {
    const resp = await request(app)
        .delete(`/companies/c1`)
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.body).toEqual({ deleted: "c1" });
  });

  test("unauth for non-admin users", async function () {
    const resp = await request(app)
        .delete(`/companies/c1`)
        .set("authorization", `Bearer ${tokenUser1}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/companies/c1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such company", async function () {
    const resp = await request(app)
        .delete(`/companies/nope`)
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(404);
  });
});
