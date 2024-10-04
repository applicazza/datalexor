import { CstNode, CstParser, ILexingResult, IToken } from 'chevrotain';
import {
  allTokens,
  Field,
  EQ,
  CONTAINS,
  STARTS_WITH,
  ENDS_WITH,
  GT,
  GTE,
  LT,
  LTE,
  NE,
  StringLiteral,
  NumberLiteral,
  OR,
  AND,
} from './lexer';

class FilterParser extends CstParser {
  constructor() {
    super(allTokens);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const $ = this;

    $.RULE('expression', () => {
      $.OPTION(() => {
        $.SUBRULE($.condition);
        $.MANY(() => {
          $.OR([{ ALT: () => $.CONSUME(OR) }, { ALT: () => $.CONSUME(AND) }]);
          $.SUBRULE2($.condition);
        });
      });
    });

    $.RULE('condition', () => {
      $.CONSUME(Field);
      $.OR([
        { ALT: () => $.CONSUME(EQ) },
        { ALT: () => $.CONSUME(CONTAINS) },
        { ALT: () => $.CONSUME(STARTS_WITH) },
        { ALT: () => $.CONSUME(ENDS_WITH) },
        { ALT: () => $.CONSUME(GT) },
        { ALT: () => $.CONSUME(GTE) },
        { ALT: () => $.CONSUME(LT) },
        { ALT: () => $.CONSUME(LTE) },
        { ALT: () => $.CONSUME(NE) },
      ]);
      $.OR2([
        { ALT: () => $.CONSUME(StringLiteral) },
        { ALT: () => $.CONSUME(NumberLiteral) },
      ]);
    });

    this.performSelfAnalysis();
  }

  public expression!: (idxInCallingRule?: number, ...args: IToken[]) => CstNode;
  public condition!: (idxInCallingRule?: number, ...args: IToken[]) => CstNode;
}

const parserInstance = new FilterParser();

export const parse: (lexingResult: ILexingResult) => CstNode = (
  lexingResult,
) => {
  parserInstance.input = lexingResult.tokens;

  const result = parserInstance.expression();

  if (parserInstance.errors.length > 0) {
    throw new Error(
      `Failed to parse input: ${parserInstance.errors[0].message}`,
    );
  }

  return result;
};

export const BaseVisitor = parserInstance.getBaseCstVisitorConstructor();

export const BaseVisitorWithDefault =
  parserInstance.getBaseCstVisitorConstructorWithDefaults();
