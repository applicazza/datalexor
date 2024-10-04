import { toDrizzle } from '../';
import { and, eq } from 'drizzle-orm';
import {
  text,
  integer,
  sqliteTable,
  QueryBuilder,
} from 'drizzle-orm/sqlite-core';

const users = sqliteTable('users', {
  name: text('name').notNull(),
  age: integer('age'),
  tenantId: integer('tenant_id'),
});

describe('DrizzleVisitor', () => {
  it('should parse "name eq \\"Alice\\""', () => {
    const queryBuilder = new QueryBuilder();
    const input = 'name eq "Alice"';
    const query = queryBuilder
      .select()
      .from(users)
      .where(
        and(eq(users.tenantId, 1), toDrizzle(users, input, ['age', 'name'])),
      );
    expect(query.toSQL()).toMatchInlineSnapshot(`
      {
        "params": [
          1,
          "Alice",
        ],
        "sql": "select "name", "age", "tenant_id" from "users" where ("users"."tenant_id" = ? and "users"."name" = ?)",
      }
    `);
  });

  it('should parse "name eq \\"Alice\\"" and age gte 42"', () => {
    const queryBuilder = new QueryBuilder();
    const input = 'name eq "Alice" and age gte 42';
    const query = queryBuilder
      .select()
      .from(users)
      .where(
        and(eq(users.tenantId, 1), toDrizzle(users, input, ['age', 'name'])),
      );
    expect(query.toSQL()).toMatchInlineSnapshot(`
      {
        "params": [
          1,
          "Alice",
          42,
        ],
        "sql": "select "name", "age", "tenant_id" from "users" where ("users"."tenant_id" = ? and ("users"."name" = ? and "users"."age" >= ?))",
      }
    `);
  });

  it('should parse "name eq \\"Alice\\"" or age gte 42"', () => {
    const queryBuilder = new QueryBuilder();
    const input = 'name eq "Alice" or age gte 42';
    const query = queryBuilder
      .select()
      .from(users)
      .where(
        and(eq(users.tenantId, 1), toDrizzle(users, input, ['age', 'name'])),
      );
    expect(query.toSQL()).toMatchInlineSnapshot(`
      {
        "params": [
          1,
          "Alice",
          42,
        ],
        "sql": "select "name", "age", "tenant_id" from "users" where ("users"."tenant_id" = ? and ("users"."name" = ? or "users"."age" >= ?))",
      }
    `);
  });

  it('should parse "name ne \\"Alice\\""', () => {
    const queryBuilder = new QueryBuilder();
    const input = 'name ne "Alice"';
    const query = queryBuilder
      .select()
      .from(users)
      .where(
        and(eq(users.tenantId, 1), toDrizzle(users, input, ['age', 'name'])),
      );
    expect(query.toSQL()).toMatchInlineSnapshot(`
      {
        "params": [
          1,
          "Alice",
        ],
        "sql": "select "name", "age", "tenant_id" from "users" where ("users"."tenant_id" = ? and "users"."name" <> ?)",
      }
    `);
  });

  it('should parse "name contains \\"i\\""', () => {
    const queryBuilder = new QueryBuilder();
    const input = 'name contains "i"';
    const query = queryBuilder
      .select()
      .from(users)
      .where(
        and(eq(users.tenantId, 1), toDrizzle(users, input, ['age', 'name'])),
      );
    expect(query.toSQL()).toMatchInlineSnapshot(`
      {
        "params": [
          1,
          "%i%",
        ],
        "sql": "select "name", "age", "tenant_id" from "users" where ("users"."tenant_id" = ? and "users"."name" like ?)",
      }
    `);
  });

  it('should parse "name startsWith \\"A\\""', () => {
    const queryBuilder = new QueryBuilder();
    const input = 'name startsWith "A"';
    const query = queryBuilder
      .select()
      .from(users)
      .where(
        and(eq(users.tenantId, 1), toDrizzle(users, input, ['age', 'name'])),
      );
    expect(query.toSQL()).toMatchInlineSnapshot(`
      {
        "params": [
          1,
          "%A",
        ],
        "sql": "select "name", "age", "tenant_id" from "users" where ("users"."tenant_id" = ? and "users"."name" like ?)",
      }
    `);
  });

  it('should parse "name endsWith \\"e\\""', () => {
    const queryBuilder = new QueryBuilder();
    const input = 'name endsWith "e"';
    const query = queryBuilder
      .select()
      .from(users)
      .where(
        and(eq(users.tenantId, 1), toDrizzle(users, input, ['age', 'name'])),
      );
    expect(query.toSQL()).toMatchInlineSnapshot(`
      {
        "params": [
          1,
          "e%",
        ],
        "sql": "select "name", "age", "tenant_id" from "users" where ("users"."tenant_id" = ? and "users"."name" like ?)",
      }
    `);
  });

  it('should parse "age gt 18"', () => {
    const queryBuilder = new QueryBuilder();
    const input = 'age gt 18';
    const query = queryBuilder
      .select()
      .from(users)
      .where(
        and(eq(users.tenantId, 1), toDrizzle(users, input, ['age', 'name'])),
      );
    expect(query.toSQL()).toMatchInlineSnapshot(`
      {
        "params": [
          1,
          18,
        ],
        "sql": "select "name", "age", "tenant_id" from "users" where ("users"."tenant_id" = ? and "users"."age" > ?)",
      }
    `);
  });

  it('should parse "age gte 18"', () => {
    const queryBuilder = new QueryBuilder();
    const input = 'age gte 18';
    const query = queryBuilder
      .select()
      .from(users)
      .where(
        and(eq(users.tenantId, 1), toDrizzle(users, input, ['age', 'name'])),
      );
    expect(query.toSQL()).toMatchInlineSnapshot(`
      {
        "params": [
          1,
          18,
        ],
        "sql": "select "name", "age", "tenant_id" from "users" where ("users"."tenant_id" = ? and "users"."age" >= ?)",
      }
    `);
  });

  it('should parse "age lt 99"', () => {
    const queryBuilder = new QueryBuilder();
    const input = 'age lt 99';
    const query = queryBuilder
      .select()
      .from(users)
      .where(
        and(eq(users.tenantId, 1), toDrizzle(users, input, ['age', 'name'])),
      );
    expect(query.toSQL()).toMatchInlineSnapshot(`
      {
        "params": [
          1,
          99,
        ],
        "sql": "select "name", "age", "tenant_id" from "users" where ("users"."tenant_id" = ? and "users"."age" < ?)",
      }
    `);
  });

  it('should parse "age lte 99"', () => {
    const queryBuilder = new QueryBuilder();
    const input = 'age lte 99';
    const query = queryBuilder
      .select()
      .from(users)
      .where(
        and(eq(users.tenantId, 1), toDrizzle(users, input, ['age', 'name'])),
      );
    expect(query.toSQL()).toMatchInlineSnapshot(`
      {
        "params": [
          1,
          99,
        ],
        "sql": "select "name", "age", "tenant_id" from "users" where ("users"."tenant_id" = ? and "users"."age" <= ?)",
      }
    `);
  });

  it('should parse "mappedAge lte 99"', () => {
    const queryBuilder = new QueryBuilder();
    const input = 'mappedAge lte 99';
    const query = queryBuilder
      .select()
      .from(users)
      .where(
        and(
          eq(users.tenantId, 1),
          toDrizzle(users, input, ['age', 'name'], { mappedAge: 'age' }),
        ),
      );
    expect(query.toSQL()).toMatchInlineSnapshot(`
      {
        "params": [
          1,
          99,
        ],
        "sql": "select "name", "age", "tenant_id" from "users" where ("users"."tenant_id" = ? and "users"."age" <= ?)",
      }
    `);
  });

  it('should parse ""', () => {
    const queryBuilder = new QueryBuilder();
    const input = '';
    const query = queryBuilder
      .select()
      .from(users)
      .where(
        and(eq(users.tenantId, 1), toDrizzle(users, input, ['age', 'name'])),
      );
    expect(query.toSQL()).toMatchInlineSnapshot(`
      {
        "params": [
          1,
        ],
        "sql": "select "name", "age", "tenant_id" from "users" where "users"."tenant_id" = ?",
      }
    `);
  });

  it('should fail to parse "age lte 99" because age is not filterable', () => {
    const queryBuilder = new QueryBuilder();
    const input = 'age lte 99';
    expect(() =>
      queryBuilder
        .select()
        .from(users)
        .where(and(eq(users.tenantId, 1), toDrizzle(users, input, ['name']))),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: Field "age" is not filterable]`,
    );
  });
});
