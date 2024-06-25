const { BadRequestError } = require("../expressError");

/** Generate SQL UPDATE SET name=value pairs with data from a JavaScript object
 * 
 * dataToUpdate: JS object with updated data items
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
    setColumns: cols.join(", "),
    setValues: Object.values(dataToUpdate)
  };
}

/** Generate SQL WHERE clause seperated by AND with filters from a JavaScript object
 * 
 * filters: JS object with the desired filters
 * 
 * Returns {
 *   conditions, // String containing the SQL WHERE/AND clauses
 *   values      // Array of the values for $1, $2, etc.
 * }
 * 
 * Throws BadRequestError if no minimum employees is greater than maximum employees
 */

function sqlForWhereConditions(filters) {
  // Throw error if min employees is more than max employees
  if(filters.minEmployees && filters.maxEmployees && filters.minEmployees > filters.maxEmployees)
    throw new BadRequestError("minEmployees can't be more than maxEmployees");

  // Convert filters to WHERE conditions
  const conditions = Object.keys(filters).map((key, idx) => {
    switch(key) {
      // Company fields
      case 'nameLike':
        return `"name" ILIKE '%' || $${idx+1} || '%'`;
      case 'minEmployees':
        return `"num_employees" >= $${idx+1}`;
      case 'maxEmployees':
        return `"num_employees" <= $${idx+1}`;

      // Job fields
      case 'titleLike':
        return `"title" ILIKE '%' || $${idx+1} || '%'`;
      case 'minSalary':
        return `"salary" >= $${idx+1}`;
      case 'hasEquity':
        let equity = '';
        if(filters.hasEquity)
          equity = `"equity" IS NOT NULL AND "equity" > 0`;
        // else // Instructions say to show all jobs if hasEquity is false.  Normally should show only jobs without equity.
        //   equity = `"equity" IS NULL OR "equity" = 0`;
        delete filters.hasEquity; // Exclude from the values array
        return equity;
    }
  });

  let where = conditions.join(' AND ');

  // If any filters were provided, add the WHERE keyword
  if(where)
    where = 'WHERE ' + where;

  return {
    whereClause: where,
    whereValues: Object.values(filters)
  };
}

module.exports = {sqlForPartialUpdate, sqlForWhereConditions};
