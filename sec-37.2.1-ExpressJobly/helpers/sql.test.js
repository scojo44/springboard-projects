const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate: sqlFPU } = require("./sql");

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
    const result = sqlFPU(data, names);
    expect(result.setCols).toEqual('"magic_word"=$1, "cave"=$2, "lamp_battery"=$3');
    expect(result.values).toEqual(['xyzzy', true, 95]);
  });

  test("throws bad request if no data", function () {
    expect(() => sqlFPU({})).toThrow(BadRequestError);
  });
});
