const { BadRequestError } = require("../expressError");

/** Generate SQL UPDATE SET name=value pairs from a JS object
 * 
 * dataToUpdate: Javascript object with updated data items
 * jsToSql: An object to convert JS camelCase key names to SQL snake_case column names, if necessary
 * 
 * Returns {
 *   setCols, // A string of column=$x for the SQL SET statement for each item needing updated
 *   values   // An array of the values for $1, $2, etc.
 * }
 * 
 * Throws BadRequestError if no items given to update
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
