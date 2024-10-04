import { lex } from '../';

describe('Lexer', () => {
  it('should tokenize "a eq 1"', () => {
    const result = lex('a eq 1');
    expect(result.tokens.map(token => token.image)).toMatchInlineSnapshot(`
      [
        "a",
        "eq",
        "1",
      ]
    `);
  });
  it('should throw error on invalid input', () => {
    expect(() => lex('a == 1')).toThrowErrorMatchingInlineSnapshot(`[Error: Failed to lex input: unexpected character: ->=<- at offset: 2, skipped 2 characters.]`);
  })
});
