"use strict";

const request = require("supertest");

const app = require("../app");
const db = require("../db");
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

/************************************** POST /jobs */

describe("POST /jobs", function () {
  const newJob = {
    title: 'New',
    salary: 150000,
    equity: .1,
    companyHandle: 'c1'
  };

  test("ok for admins", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body.job).toEqual({
      id: expect.any(Number),
      ...newJob
    });
  });

  test("unauth for non-admin users", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${tokenUser1}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send({companyHandle: "c1"}) // title is only missing required value
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send({
          ...newJob,
          equity: 1 // You hire someone and give them the entire company as compensation?
        })
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /jobs */

describe("GET /jobs", function () {
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

  test("ok for anon", async function () {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({jobs: [j1a, j1b, j3]});
  });

  test("filter by title", async function () {
    const resp = await request(app)
      .get("/jobs")
      .query({titleLike: 'b'});
    expect(resp.body).toEqual({jobs: [j1b]});
  });

  test("filter by minimum salary", async function () {
    const resp = await request(app)
      .get("/jobs")
      .query({minSalary: 200000});
    expect(resp.body).toEqual({jobs: [j3]});
  });

  test("filter by hasEquity:true", async function () {
    const resp = await request(app)
      .get("/jobs")
      .query({hasEquity: true});
    expect(resp.body).toEqual({jobs: [j1a]});
  });

  test("filter by hasEquity:false", async function () {
    const resp = await request(app)
      .get("/jobs")
      .query({hasEquity: false});
    expect(resp.body).toEqual({jobs: [j1a, j1b, j3]}); // Exercise says to show all jobs in this case
  });

  test("filter by title and miniumum salary", async function () {
    const resp = await request(app)
      .get("/jobs")
      .query({
        titleLike: 1,
        minSalary: 144000
      });
    expect(resp.body).toEqual({jobs: [j1a]});
  });

  test("bad request if titleLike is too long", async function () {
    const resp = await request(app)
      .get("/jobs")
      .query({titleLike: 'abcdefghijklmnopqrstuvwxyz0123456789'});
    expect(resp.status).toBe(400);
  });

  test("bad request if filtering by unavailable option", async function () {
    const resp = await request(app)
      .get("/jobs")
      .query({xyzzy: 'Nothing happens.'});
    expect(resp.status).toBe(400);
  });

  test("bad request if filtering by available and unavailable options", async function () {
    const resp = await request(app)
      .get("/jobs")
      .query({
        xyzzy: 'Nothing happens.',
        minSalary: 100000
      });
    expect(resp.status).toBe(400);
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE jobs CASCADE");
    const resp = await request(app)
        .get("/jobs")
        .set("authorization", `Bearer ${tokenUser1}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /jobs/:id */

describe("GET /jobs/:id", function () {
  test("works for anon", async function () {
    const resp = await request(app).get(`/jobs/1`);
    expect(resp.body.job).toEqual({
      id: 1,
      title: "J1a",
      salary: 150000,
      equity: .1,
      companyHandle: "c1"
    });
  });

  test("not found for no such company", async function () {
    const resp = await request(app).get(`/jobs/999`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /jobs/:id */

describe("PATCH /jobs/:id", function () {
  test("works for admins", async function () {
    const resp = await request(app)
        .patch(`/jobs/1`)
        .send({title: "J1a-new"})
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.body.job).toEqual({
      id: 1,
      title: "J1a-new",
      salary: 150000,
      equity: .1,
      companyHandle: "c1"
    });
  });

  test("unauth for non-admin users", async function () {
    const resp = await request(app)
        .patch(`/jobs/1`)
        .send({title: "J1-new"})
        .set("authorization", `Bearer ${tokenUser1}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/jobs/1`)
        .send({title: "J1-new"});
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such job", async function () {
    const resp = await request(app)
        .patch(`/jobs/999`)
        .send({title: "new nope"})
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on companyHandle change attempt", async function () {
    const resp = await request(app)
        .patch(`/jobs/1`)
        .send({companyHandle: "c2"})
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on invalid data", async function () {
    const resp = await request(app)
        .patch(`/jobs/1`)
        .send({salary: -120000}) // Your company is so good, they pay you to work there!
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on no data", async function () {
    const resp = await request(app)
        .patch(`/jobs/1`)
        .send({})
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /jobs/:id */

describe("DELETE /jobs/:id", function () {
  test("works for admins", async function () {
    const resp = await request(app)
        .delete(`/jobs/3`)
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.body).toEqual({ deleted: "3" });
  });

  test("unauth for non-admin users", async function () {
    const resp = await request(app)
        .delete(`/jobs/3`)
        .set("authorization", `Bearer ${tokenUser1}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/jobs/3`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such company", async function () {
    const resp = await request(app)
        .delete(`/jobs/999`)
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(404);
  });
});
