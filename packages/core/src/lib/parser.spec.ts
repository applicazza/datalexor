import { lex, parse } from '../';

describe('Parser', () => {
  it('should parse "a eq 1"', () => {
    const result = parse(lex('a eq 1'));
    expect(result).toMatchInlineSnapshot(`
      {
        "children": {
          "condition": [
            {
              "children": {
                "EQ": [
                  {
                    "endColumn": 4,
                    "endLine": 1,
                    "endOffset": 3,
                    "image": "eq",
                    "startColumn": 3,
                    "startLine": 1,
                    "startOffset": 2,
                    "tokenType": {
                      "CATEGORIES": [],
                      "PATTERN": /eq/,
                      "categoryMatches": [],
                      "categoryMatchesMap": {},
                      "isParent": false,
                      "name": "EQ",
                      "tokenTypeIdx": 3,
                    },
                    "tokenTypeIdx": 3,
                  },
                ],
                "Field": [
                  {
                    "endColumn": 1,
                    "endLine": 1,
                    "endOffset": 0,
                    "image": "a",
                    "startColumn": 1,
                    "startLine": 1,
                    "startOffset": 0,
                    "tokenType": {
                      "CATEGORIES": [],
                      "PATTERN": /\\[a-zA-Z_\\]\\[a-zA-Z0-9_\\]\\*/,
                      "categoryMatches": [],
                      "categoryMatchesMap": {},
                      "isParent": false,
                      "name": "Field",
                      "tokenTypeIdx": 16,
                    },
                    "tokenTypeIdx": 16,
                  },
                ],
                "NumberLiteral": [
                  {
                    "endColumn": 6,
                    "endLine": 1,
                    "endOffset": 5,
                    "image": "1",
                    "startColumn": 6,
                    "startLine": 1,
                    "startOffset": 5,
                    "tokenType": {
                      "CATEGORIES": [],
                      "PATTERN": /\\\\d\\+/,
                      "categoryMatches": [],
                      "categoryMatchesMap": {},
                      "isParent": false,
                      "name": "NumberLiteral",
                      "tokenTypeIdx": 13,
                    },
                    "tokenTypeIdx": 13,
                  },
                ],
              },
              "name": "condition",
            },
          ],
        },
        "name": "expression",
      }
    `);
  });
  it('should throw error on invalid input', () => {
    expect(() => parse(lex('a eq ne 1'))).toThrowErrorMatchingInlineSnapshot(`
      [Error: Failed to parse input: Expecting: one of these possible Token sequences:
        1. [StringLiteral]
        2. [NumberLiteral]
      but found: 'ne']
    `);
  })
});
