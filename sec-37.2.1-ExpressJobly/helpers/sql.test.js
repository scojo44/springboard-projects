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

describe("sqlForWhereConditions - Company filters", function () {
  test("generates where conditions for all three filters", function () {
    const filters = {
      nameLike: "xyzzy",
      minEmployees: 10,
      maxEmployees: 100
    };
    const where = sqlForWhereConditions(filters);
    expect(where.whereClause).toEqual(`WHERE "name" ILIKE '%' || $1 || '%' AND "num_employees" >= $2 AND "num_employees" <= $3`);
    expect(where.whereValues).toEqual(['xyzzy', 10, 100]);
  });

  test("generates where conditions for name and maxEmployees", function () {
    const filters = {
      nameLike: "xyzzy",
      maxEmployees: 100
    };
    const where = sqlForWhereConditions(filters);
    expect(where.whereClause).toEqual(`WHERE "name" ILIKE '%' || $1 || '%' AND "num_employees" <= $2`);
    expect(where.whereValues).toEqual(['xyzzy', 100]);
  });

  test("generates where condition for name only", function () {
    const filters = {nameLike: "xyzzy"};
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

describe("sqlForWhereConditions - Job filters", function () {
  test("generates where conditions for all three filters", function () {
    const filters = {
      titleLike: "xyzzy",
      minSalary: 150000,
      hasEquity: true
    };
    const where = sqlForWhereConditions(filters);
    expect(where.whereClause).toEqual(`WHERE "title" ILIKE '%' || $1 || '%' AND "salary" >= $2 AND "equity" IS NOT NULL AND "equity" > 0`);
    expect(where.whereValues).toEqual(['xyzzy', 150000]);
  });

  test("generates where conditions for title and salary", function () {
    const filters = {
      titleLike: "xyzzy",
      minSalary: 150000
    };
    const where = sqlForWhereConditions(filters);
    expect(where.whereClause).toEqual(`WHERE "title" ILIKE '%' || $1 || '%' AND "salary" >= $2`);
    expect(where.whereValues).toEqual(['xyzzy', 150000]);
  });

  test("generates where condition for title only", function () {
    const filters = {titleLike: "xyzzy"};
    const where = sqlForWhereConditions(filters);
    expect(where.whereClause).toEqual(`WHERE "title" ILIKE '%' || $1 || '%'`);
    expect(where.whereValues).toEqual(['xyzzy']);
  });

  test("generates where condition for minEmployees only", function () {
    const filters = {minSalary: 150000};
    const where = sqlForWhereConditions(filters);
    expect(where.whereClause).toEqual('WHERE "salary" >= $1');
    expect(where.whereValues).toEqual([150000]);
  });

  test("generates where condition for hasEquity only - true", function () {
    const filters = {hasEquity: true};
    const where = sqlForWhereConditions(filters);
    expect(where.whereClause).toEqual('WHERE "equity" IS NOT NULL AND "equity" > 0');
    expect(where.whereValues).toEqual([]);
  });

  test("generates where condition for hasEquity only - false", function () {
    const filters = {hasEquity: false};
    const where = sqlForWhereConditions(filters);
    // Should be the below but exercise said to return all jobs if hasEquity is false
    // expect(where.whereClause).toEqual('WHERE "equity" IS NULL OR "equity" = 0');
    expect(where.whereClause).toEqual('');
    expect(where.whereValues).toEqual([]);
  });

  test("returns empty if no filters given", function () {
    const where = sqlForWhereConditions({});
    expect(where.whereClause).toEqual('');
    expect(where.whereValues).toEqual([]);
  });
});
