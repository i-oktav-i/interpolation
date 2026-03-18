import assert from 'node:assert';
import { describe, it } from 'node:test';

import { create } from './create.ts';

describe('create', () => {
  it('runs the default interpolation pipeline', () => {
    const interpolation = create({
      resource: {
        title: 'Hello, {{ name | upper }}',
        message:
          '{{> title }} {{? isAdmin "Access granted" :: "Access denied" }}',
      } as const,
      pipes: {
        upper: (value) => String(value).toUpperCase(),
      },
    });

    const actual = interpolation.interpolate('message', {
      values: {
        name: 'Alice',
        isAdmin: true,
      },
    });

    const expected: typeof actual = 'Hello, ALICE Access granted';

    assert.equal(expected, actual);
  });

  it('supports custom delimiters in the default factory', () => {
    const interpolation = create({
      resource: {
        title: 'Hello, ${ name |> upper }',
        message: '<%= title %> #if isAdmin `enabled` #else `disabled` #endif',
      } as const,
      valuesPrefix: '${',
      valuesPostfix: '}',
      pipesDelim: '|>',
      conditionsPrefix: '#if',
      conditionsPostfix: '#endif',
      conditionsDelim: '#else',
      conditionsQuot: '`',
      insertionsPrefix: '<%=',
      insertionsPostfix: '%>',
      pipes: {
        upper: (value) => String(value).toUpperCase(),
      },
    });

    const actual = interpolation.interpolate('message', {
      values: {
        name: 'Bob',
        isAdmin: false,
      },
    });

    const expected: typeof actual = 'Hello, BOB disabled';

    assert.equal(expected, actual);
  });
});
