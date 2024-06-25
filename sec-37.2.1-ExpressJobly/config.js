"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
    ? "postgresql:///jobly_test"
    : process.env.DATABASE_URL || "postgresql:///jobly";
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;
const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = +process.env.PORT || 3001;

// Show the comfiguration in the console once per startup.  Avoids flooding the console while running tests.
if(!global.configShown) {
  global.configShown = true;
  console.log(
`===== Jobly Config ==================='
${"SECRET_KEY:".yellow} ${SECRET_KEY}
${"PORT:".yellow} ${PORT.toString()}
${"BCRYPT_WORK_FACTOR".yellow} ${BCRYPT_WORK_FACTOR}
${"Database:".yellow} ${getDatabaseUri()}
======================================`);
}

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri
};
