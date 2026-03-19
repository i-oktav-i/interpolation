import type { Equal, TrueCases } from 'type-testing';

import type { FlattenResource, ValidateResource } from './types.ts';

type FlattenResourceTest = TrueCases<
  [
    Equal<
      keyof FlattenResource<{
        title: 'Hello';
        home: {
          subtitle: 'World';
        };
      }>,
      'title' | 'home.subtitle'
    >,
    Equal<
      FlattenResource<{
        title: 'Hello';
        home: {
          subtitle: 'World';
        };
      }>['title'],
      'Hello'
    >,
    Equal<
      FlattenResource<{
        title: 'Hello';
        home: {
          subtitle: 'World';
        };
      }>['home.subtitle'],
      'World'
    >,
    Equal<
      keyof FlattenResource<{
        sections: [
          'Intro',
          {
            title: 'Chapter';
            actions: ['read', 'share'];
          },
        ];
      }>,
      | 'sections.0'
      | 'sections.1.title'
      | 'sections.1.actions.0'
      | 'sections.1.actions.1'
    >,
    Equal<
      FlattenResource<{
        sections: [
          'Intro',
          {
            title: 'Chapter';
            actions: ['read', 'share'];
          },
        ];
      }>['sections.1.actions.1'],
      'share'
    >,
  ]
>;

type ValidateResourceTest = TrueCases<
  [
    Equal<
      ValidateResource<{
        title: 'Hello';
        dynamicTitle: string;
        sections: [
          'Intro',
          string,
          string[],
          {
            subtitle: 'World';
            dynamicSubtitle: string;
          },
        ];
        dynamicItems: string[];
      }>,
      {
        title: 'Hello';
        dynamicTitle: never;
        sections: [
          'Intro',
          never,
          never,
          {
            subtitle: 'World';
            dynamicSubtitle: never;
          },
        ];
        dynamicItems: never;
      }
    >,
    Equal<
      ValidateResource<
        {
          title: 'Hello';
          dynamicTitle: string;
          sections: string[];
        },
        true
      >,
      {
        title: 'Hello';
        dynamicTitle: string;
        sections: never;
      }
    >,
  ]
>;
