import assert from 'node:assert';
import { describe, it } from 'node:test';

import { flattenResource } from './flattenResource.ts';

describe('flattenResource', () => {
  it('keeps a flat object unchanged', () => {
    const expected = {
      title: 'Hello',
      subtitle: 'World',
    } as const;

    const actual = flattenResource(expected);

    assert.deepEqual(expected, actual);
  });

  it('flattens nested objects', () => {
    const actual = flattenResource({
      home: {
        title: 'Hello',
        description: 'World',
      },
      footer: {
        copyright: '2026',
      },
    });

    const expected: typeof actual = {
      'home.title': 'Hello',
      'home.description': 'World',
      'footer.copyright': '2026',
    };

    assert.deepEqual(expected, actual);
  });

  it('flattens arrays using numeric indexes', () => {
    const actual = flattenResource({
      items: ['first', 'second'],
    });

    const expected: typeof actual = {
      'items.0': 'first',
      'items.1': 'second',
    };

    assert.deepEqual(expected, actual);
  });

  it('flattens mixed object and array nesting', () => {
    const actual = flattenResource({
      sections: [
        {
          title: 'Intro',
          actions: ['read', 'share'],
        },
        {
          title: 'Outro',
        },
      ],
    });

    const expected: typeof actual = {
      'sections.0.title': 'Intro',
      'sections.0.actions.0': 'read',
      'sections.0.actions.1': 'share',
      'sections.1.title': 'Outro',
    };

    assert.deepEqual(expected, actual);
  });

  it('skips empty nested objects and arrays', () => {
    const actual = flattenResource({
      content: {},
      sections: [],
      title: 'Hello',
    });

    const expected: typeof actual = {
      title: 'Hello',
    };

    assert.deepEqual(expected, actual);
  });
});
