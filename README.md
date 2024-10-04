# Custom Filter DSL for Datatables

In applications such as admin panels with numerous pages containing data tables, efficient data filtering is critical for usability. Without the ability to filter data by users dynamically, presenting large datasets loses its value.

This project introduces a solution by implementing a **custom Domain-Specific Language (DSL)** that allows complex filtering logic to be passed from the frontend to the backend. This DSL is passed as a string and can be converted into a query that applies the necessary filtering conditions in a database.

## Problem

When dealing with large datasets in an admin panel, filters need to be flexible. Users should be able to filter data based on different conditions, including **dynamic combinations of “AND” and “OR” clauses**. Moreover, the filter logic must be passed from the frontend to the backend and converted into a query that can be executed efficiently by the database.

## Solution

This project proposes a **Custom DSL** for handling complex filters on the backend, which is inspired by SQL-like syntax. The filter expression is passed as a string from the frontend, where it can be parsed and converted into a Drizzle `where` clause to apply to a query.

### Example DSL

```
fieldA eq "foo" and fieldB contains "bar"
```


In this example:
- `fieldA eq "foo"` filters for records where the value of `fieldA` equals `"foo"`.
- `fieldB contains "bar"` filters for records where `fieldB` contains the substring `"bar"`.
- The `and` operator combines both filters, ensuring both conditions must be true.

### Key Features
- **Dynamic Filters**: Allows dynamic filtering logic such as combining multiple conditions using `and` and `or`.
- **SQL-like Syntax**: Familiar SQL-like syntax for expressing filtering conditions.
- **Simple Integration**: The filter string is passed as a query parameter from the frontend and can be easily parsed into a Drizzle `where` clause in the backend.
  
## Usage

1. **Frontend**: The frontend constructs a filter string using the custom DSL. This string is then sent to the backend as a query parameter.

    ```
    /api/data?filter=fieldA eq "foo" and fieldB contains "bar"
    ```

2. **Backend**: The backend receives the filter string, parses it, and converts it into a Drizzle `where` clause to be applied to the query.

    ```javascript
    const filterString = req.query.filter;
    const data = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.tenantId, 1),
          toDrizzle(users, input, ['age', 'name'], { mappedAge: 'age' }),
        ),
      );
    ```

3. **Supported Operations**:
    - `eq`: Match where the field equals a value.
    - `ne`: Match where the field not equals a value.
    - `gt`/`gte`: Match where the field is greater than/or equal a value.
    - `lt`/`lte`: Match where the field is less than/or equal a value.
    - `contains`: Match where a field contains a substring.
    - `startsWith`: Match where a field starts with a substring.
    - `endsWith`: Match where a field ends with a substring.
    - **AND/OR Combinations**: Combine multiple filters using `and` and `or` operators.
    
    Example:
    
    ```
    fieldA eq "value" or fieldB contains "part"
    ```

## Installation

Install the package:

```bash
yarn add @datalexor/core @datalexor/drizzle
```

