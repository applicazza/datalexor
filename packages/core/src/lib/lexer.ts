import { createToken, ILexingResult, Lexer } from 'chevrotain';

export const EQ = createToken({ name: 'EQ', pattern: /eq/ });
export const CONTAINS = createToken({ name: 'CONTAINS', pattern: /contains/ });
export const STARTS_WITH = createToken({
  name: 'STARTS_WITH',
  pattern: /startsWith/,
});
export const ENDS_WITH = createToken({
  name: 'ENDS_WITH',
  pattern: /endsWith/,
});
export const GT = createToken({ name: 'GT', pattern: /gt/ });
export const GTE = createToken({ name: 'GTE', pattern: /gte/ });
export const LT = createToken({ name: 'LT', pattern: /lt/ });
export const LTE = createToken({ name: 'LTE', pattern: /lte/ });
export const NE = createToken({ name: 'NE', pattern: /ne/ });
export const StringLiteral = createToken({
  name: 'StringLiteral',
  pattern: /"[^"]*"/,
});
export const NumberLiteral = createToken({
  name: 'NumberLiteral',
  pattern: /\d+/,
});
export const OR = createToken({ name: 'OR', pattern: /or/ });
export const AND = createToken({ name: 'AND', pattern: /and/ });
export const Field = createToken({
  name: 'Field',
  pattern: /[a-zA-Z_][a-zA-Z0-9_]*/,
});
export const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const allTokens = [
  WhiteSpace,
  EQ,
  CONTAINS,
  STARTS_WITH,
  ENDS_WITH,
  GTE,
  GT,
  LTE,
  LT,
  NE,
  StringLiteral,
  NumberLiteral,
  OR,
  AND,
  Field,
];

const LexerInstance = new Lexer(allTokens);

export const lex: (inputText: string) => ILexingResult = (inputText) => {
  const result = LexerInstance.tokenize(inputText);

  if (result.errors.length > 0) {
    throw new Error(`Failed to lex input: ${result.errors[0].message}`);
  }

  return result;
};
