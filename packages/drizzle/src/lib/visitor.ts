import { BaseVisitor, lex, parse } from '@datalexor/core';
import { CstNode, IToken } from 'chevrotain';
import {
  Table,
  and,
  eq,
  like,
  ne,
  lt,
  gt,
  lte,
  gte,
  or,
  getTableColumns,
  SQLWrapper,
  InferSelectModel,
} from 'drizzle-orm';

type ExpressionContext = { condition: CstNode[]; OR: IToken[]; AND: IToken[] };
type ExpressionParams = {
  columnMappings?: Record<string, string>;
  filterableColumns: string[];
  table: Table;
};
type ConditionContext = {
  Field: IToken[];
  EQ: IToken[];
  CONTAINS: IToken[];
  ENDS_WITH: IToken[];
  STARTS_WITH: IToken[];
  GT: IToken[];
  GTE: IToken[];
  LT: IToken[];
  LTE: IToken[];
  NE: IToken[];
  StringLiteral: IToken[];
  NumberLiteral: IToken[];
};
type ConditionParams = {
  columns: ReturnType<typeof getTableColumns>;
  columnMappings?: Record<string, string>;
  filterableColumns: string[];
};

class DrizzleVisitor extends BaseVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  expression(ctx: ExpressionContext, params: ExpressionParams) {
    if (!ctx.condition) {
      return undefined;
    }

    const { columnMappings, filterableColumns, table } = params;

    const conditions = ctx.condition.map((conditionNode) =>
      this.visit(conditionNode, {
        columnMappings,
        columns: getTableColumns(table),
        filterableColumns,
      }),
    );
    if (ctx.OR) {
      return or(...conditions);
    }

    if (ctx.AND) {
      return and(...conditions);
    }

    return conditions[0];
  }

  condition(
    ctx: ConditionContext,
    { columnMappings, columns, filterableColumns }: ConditionParams,
  ) {
    const inputField = ctx.Field[0].image;

    const field = columnMappings?.[inputField] || inputField;

    if (!filterableColumns.includes(field)) {
      throw new Error(`Field "${field}" is not filterable`);
    }

    const value = ctx.StringLiteral
      ? ctx.StringLiteral[0].image.slice(1, -1)
      : ~~ctx.NumberLiteral[0].image;

    const column = columns[field];

    switch (true) {
      case !!ctx.EQ:
        return eq(column, value);
      case !!ctx.NE:
        return ne(column, value);
      case !!ctx.GT:
        return gt(column, value);
      case !!ctx.GTE:
        return gte(column, value);
      case !!ctx.LT:
        return lt(column, value);
      case !!ctx.LTE:
        return lte(column, value);
      case !!ctx.CONTAINS:
        return like(column, `%${value}%`);
      case !!ctx.STARTS_WITH:
        return like(column, `${value}%`);
      case !!ctx.ENDS_WITH:
        return like(column, `%${value}`);
    }
  }
}

const visitorInstance = new DrizzleVisitor();

export const toDrizzle: <T extends Table>(
  table: T,
  input: string,
  filterableColumns: Array<keyof InferSelectModel<T>>,
  columnMappings?: Record<string, keyof InferSelectModel<T>>,
) => SQLWrapper | undefined = (
  table,
  input,
  filterableColumns,
  columnMappings,
) =>
    visitorInstance.visit(parse(lex(input)), {
      columnMappings,
      filterableColumns,
      table,
    });
