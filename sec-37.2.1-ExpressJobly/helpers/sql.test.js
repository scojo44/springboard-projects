const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate, sqlForWhereConditions } = require("./sql");

describe("sqlForPartialUpdate", function () {
  test("generates column=value pairs", function () {
    const data = {
      magicWord: "xyzzy",
      cave: true,
      lampBattery: 95
    };
    const names = {
      magicWord: 'magic_word',
      lampBattery: 'lamp_battery'
    };
    const set = sqlForPartialUpdate(data, names);
    expect(set.setColumns).toEqual('"magic_word"=$1, "cave"=$2, "lamp_battery"=$3');
    expect(set.setValues).toEqual(['xyzzy', true, 95]);
  });

  test("throws bad request if no data given", function () {
    expect(() => sqlForPartialUpdate({})).toThrow(BadRequestError);
  });
});

describe("sqlForWhereConditions", function () {
  test("generates where conditions for all three filters", function () {
    const filters = {
      name: "xyzzy",
      minEmployees: 10,
      maxEmployees: 100
    };
    const where = sqlForWhereConditions(filters);
    expect(where.whereClause).toEqual(`WHERE "name" ILIKE '%' || $1 || '%' AND "num_employees" >= $2 AND "num_employees" <= $3`);
    expect(where.whereValues).toEqual(['xyzzy', 10, 100]);
  });

  test("generates where conditions for name and maxEmployees", function () {
    const filters = {
      name: "xyzzy",
      maxEmployees: 100
    };
    const where = sqlForWhereConditions(filters);
    expect(where.whereClause).toEqual(`WHERE "name" ILIKE '%' || $1 || '%' AND "num_employees" <= $2`);
    expect(where.whereValues).toEqual(['xyzzy', 100]);
  });

  test("generates where condition for name only", function () {
    const filters = {name: "xyzzy"};
    const where = sqlForWhereConditions(filters);
    expect(where.whereClause).toEqual(`WHERE "name" ILIKE '%' || $1 || '%'`);
    expect(where.whereValues).toEqual(['xyzzy']);
  });

  test("generates where condition for minEmployees only", function () {
    const filters = {minEmployees: 10};
    const where = sqlForWhereConditions(filters);
    expect(where.whereClause).toEqual('WHERE "num_employees" >= $1');
    expect(where.whereValues).toEqual([10]);
  });

  test("returns empty if no filters given", function () {
    const where = sqlForWhereConditions({});
    expect(where.whereClause).toEqual('');
    expect(where.whereValues).toEqual([]);
  });

  test("throws bad request if minEmployees > max", function () {
    const filters = {
      minEmployees: 999,
      maxEmployees: 100
    };
    expect(() => sqlForWhereConditions(filters)).toThrow(BadRequestError);
  });
});
