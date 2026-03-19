import assert from 'node:assert';
import { describe, it } from 'node:test';

import { extract } from './extract.ts';

const resource = {
  title: 'Hello',
  subtitle: 'World',
} as const;

describe('extract', () => {
  it('returns the value for an existing key', () => {
    const key = 'title' as const;

    const actual = extract(resource, key);

    const expected: typeof actual = resource.title;

    assert.equal(expected, actual);
  });

  it('returns null for a missing key', () => {
    const key = 'missing' as const;

    const actual = extract(resource, key);

    const expected: typeof actual = null;

    assert.equal(expected, actual);
  });
});
