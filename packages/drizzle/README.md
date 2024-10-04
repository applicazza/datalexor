# Datalexor Drizzle

This library converts data filtering DSL to drizzle where clause.

## Installation

```shell
yarn add @datalexor/core @datalexor/drizzle
```

## Usage

```typescript
import { toDrizzle } from '@datalexor/drizzle';

const query = 'field eq "A"';

const rows = await db.select().from(users).where(toDrizzle(users, query, ['field']))
```

```typescript
import { toDrizzle } from '@datalexor/drizzle';

const query = 'field eq "A"';

const rows = await db.select().from(users).where(
    and(
        eq(users.tenantId, 1), 
        toDrizzle(users, query, ['field'])
    )
)
```
