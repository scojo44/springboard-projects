"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");

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

/************************************** POST /users */

describe("POST /users", function () {
  const newUser = {
    username: "u-new",
    firstName: "First-new",
    lastName: "Last-newL",
    password: "password-new",
    email: "new@email.com",
    isAdmin: false,
  };

  // Create a passwordless version for comparing responses
  const newUserNoPW = structuredClone(newUser);
  delete newUserNoPW.password;

  // Create admin versions of the above
  const newAdmin = structuredClone(newUser);
  const newAdminNoPW = structuredClone(newUserNoPW);
  newAdmin.isAdmin = true;
  newAdminNoPW.isAdmin = true;

  test("works for admins: create non-admin", async function () {
    const resp = await request(app)
        .post("/users")
        .send(newUser)
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: newUserNoPW,
      token: expect.any(String)
    });
  });

  test("works for admins: create admin", async function () {
    const resp = await request(app)
        .post("/users")
        .send(newAdmin)
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: newAdminNoPW,
      token: expect.any(String),
    });
  });

  test("unauth for non-admin users", async function () {
    const resp = await request(app)
        .post("/users")
        .send(newUser)
        .set("authorization", `Bearer ${tokenUser1}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .post("/users")
        .send(newUser);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if missing data", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
        })
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          firstName: "First-new",
          lastName: "Last-newL",
          password: "password-new",
          email: "not-an-email",
          isAdmin: true,
        })
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /users */

describe("GET /users", function () {
  test("works for admins", async function () {
    const resp = await request(app)
        .get("/users")
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.body).toEqual({
      users: [
        {
          username: "u1",
          firstName: "U1F",
          lastName: "U1L",
          email: "user1@user.com",
          isAdmin: false,
        },
        {
          username: "u2",
          firstName: "U2F",
          lastName: "U2L",
          email: "user2@user.com",
          isAdmin: true,
        },
        {
          username: "u3",
          firstName: "U3F",
          lastName: "U3L",
          email: "user3@user.com",
          isAdmin: false,
        },
      ],
    });
  });

  test("unauth for non-admin users", async function () {
    const resp = await request(app)
        .get("/users")
        .set("authorization", `Bearer ${tokenUser1}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get("/users");
    expect(resp.statusCode).toEqual(401);
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE users CASCADE");
    const resp = await request(app)
        .get("/users")
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /users/:username */

describe("GET /users/:username", function () {
  const expectedUser = {
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    isAdmin: false,
  };

  test("works for admins", async function () {
    const resp = await request(app)
        .get(`/users/u1`)
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.body).toEqual({ user: expectedUser });
  });

  test("works for self", async function () {
    const resp = await request(app)
        .get(`/users/u1`)
        .set("authorization", `Bearer ${tokenUser1}`);
    expect(resp.body).toEqual({ user: expectedUser });
  });

  test("unauth for other non-admin user", async function () {
    const resp = await request(app)
        .get(`/users/u3`)
        .set("authorization", `Bearer ${tokenUser1}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get(`/users/u1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user not found", async function () {
    const resp = await request(app)
        .get(`/users/nope`)
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /users/:username */

describe("PATCH /users/:username", () => {
  const expectedUser = {
    username: "u1",
    firstName: "New",
    lastName: "U1L",
    email: "user1@user.com",
    isAdmin: false,
  };

  test("works for admins", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({ firstName: "New" })
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.body).toEqual({ user: expectedUser });
  });

  test("works for self", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({ firstName: "New" })
        .set("authorization", `Bearer ${tokenUser1}`);
    expect(resp.body).toEqual({ user: expectedUser });
  });

  test("unauth for other non-admin user", async function () {
    const resp = await request(app)
        .patch(`/users/u3`)
        .send({ firstName: "New" })
        .set("authorization", `Bearer ${tokenUser1}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({ firstName: "New" });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such user", async function () {
    const resp = await request(app)
        .patch(`/users/nope`)
        .send({ firstName: "Nope" })
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({ firstName: 42 })
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if no data", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({})
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("works: set new password", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({ password: "new-password" })
        .set("authorization", `Bearer ${tokenUser1}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "user1@user.com",
        isAdmin: false,
      }
    });
    const isSuccessful = await User.authenticate("u1", "new-password");
    expect(isSuccessful).toBeTruthy();
  });
});

/************************************** DELETE /users/:username */

describe("DELETE /users/:username", function () {
  test("works for admins", async function () {
    const resp = await request(app)
        .delete(`/users/u1`)
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.body).toEqual({ deleted: "u1" });
  });

  test("works for self", async function () {
    const resp = await request(app)
        .delete(`/users/u1`)
        .set("authorization", `Bearer ${tokenUser1}`);
    expect(resp.body).toEqual({ deleted: "u1" });
  });

  test("unauth for other non-admin user", async function () {
    const resp = await request(app)
        .delete(`/users/u3`)
        .set("authorization", `Bearer ${tokenUser1}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/users/u1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user missing", async function () {
    const resp = await request(app)
        .delete(`/users/nope`)
        .set("authorization", `Bearer ${tokenUser2Admin}`);
    expect(resp.statusCode).toEqual(404);
  });
});
