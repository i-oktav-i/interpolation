import assert from 'node:assert';
import { describe, it } from 'node:test';
import type { IsUnion } from 'type-testing';
import { conditionsTransformer } from './conditionsTransformer.ts';
import type {
  AnyInterpolateConditionsCases,
  BashStyle,
  DoubleMustache,
  FirstCondition,
  InterpolateConditionsCases,
  SecondCondition,
} from './interpolatedConditions.test.ts';
import type { Negation } from './interpolatedConditions.ts';

const negation: Negation = '!';

const firstCondition: FirstCondition = {
  name: 'condition1',
  ifTrue: 'first condition is true',
  ifFalse: 'first condition is false',
} as const;

const secondCondition: SecondCondition = {
  name: 'condition2',
  ifTrue: 'second condition is true',
  ifFalse: 'second condition is false',
} as const;

const doubleMustache: DoubleMustache = {
  prefix: '{{?',
  postfix: '}}',
  delim: '::',
  quot: '"',
} as const;

const bashStyle: BashStyle = {
  prefix: '#if',
  postfix: '#endif',
  delim: '#else',
  quot: '`',
} as const;

type AllDoubleMustacheCases = InterpolateConditionsCases<
  DoubleMustache['prefix'],
  DoubleMustache['postfix'],
  DoubleMustache['delim'],
  DoubleMustache['quot']
>;

type DoubleMustacheCases = {
  [Case in keyof AllDoubleMustacheCases as IsUnion<
    AllDoubleMustacheCases[Case]['result']
  > extends true
    ? never
    : Case]: AllDoubleMustacheCases[Case];
};

type AllBashStyleCases = InterpolateConditionsCases<
  BashStyle['prefix'],
  BashStyle['postfix'],
  BashStyle['delim'],
  BashStyle['quot']
>;

type BashStyleCases = {
  [Case in keyof AllBashStyleCases as IsUnion<
    AllBashStyleCases[Case]['result']
  > extends true
    ? never
    : Case]: AllBashStyleCases[Case];
};

const getCases = <
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string
>(templateSyntax: {
  prefix: Prefix;
  postfix: Postfix;
  delim: Delim;
  quot: Quot;
}) => {
  const commonTemplate =
    `${templateSyntax.prefix}${firstCondition.name}${templateSyntax.quot}${firstCondition.ifTrue}${templateSyntax.quot}${templateSyntax.delim}${templateSyntax.quot}${firstCondition.ifFalse}${templateSyntax.quot}${templateSyntax.postfix}` as const;

  const unfinishedTemplate =
    `${firstCondition.name}${templateSyntax.quot}${firstCondition.ifTrue}${templateSyntax.quot}${templateSyntax.delim}${templateSyntax.quot}${firstCondition.ifFalse}${templateSyntax.quot}${templateSyntax.postfix}` as const;

  const TemplateWithExtraCharsAndSpaces =
    `${templateSyntax.prefix}    ${firstCondition.name}    ${templateSyntax.quot}${firstCondition.ifTrue}${templateSyntax.quot}${templateSyntax.delim}wrong${templateSyntax.quot}${firstCondition.ifFalse}${templateSyntax.quot}${templateSyntax.postfix}` as const;

  return {
    withoutNegationWithTrueCondition: {
      template: commonTemplate,
      values: { [firstCondition.name]: true },
      result: firstCondition.ifTrue,
    },
    withoutNegationWithFalseCondition: {
      template:
        `${templateSyntax.prefix}${firstCondition.name}${templateSyntax.quot}${firstCondition.ifTrue}${templateSyntax.quot}${templateSyntax.delim}${templateSyntax.quot}${firstCondition.ifFalse}${templateSyntax.quot}${templateSyntax.postfix}` as const,
      values: { [firstCondition.name]: false },
      result: firstCondition.ifFalse,
    },
    withNegationWithTrueCondition: {
      template:
        `${templateSyntax.prefix}${negation}${firstCondition.name}${templateSyntax.quot}${firstCondition.ifTrue}${templateSyntax.quot}${templateSyntax.delim}${templateSyntax.quot}${firstCondition.ifFalse}${templateSyntax.quot}${templateSyntax.postfix}` as const,
      values: { [firstCondition.name]: true },
      result: firstCondition.ifFalse,
    },
    withNegationWithFalseCondition: {
      template:
        `${templateSyntax.prefix}${negation}${firstCondition.name}${templateSyntax.quot}${firstCondition.ifTrue}${templateSyntax.quot}${templateSyntax.delim}${templateSyntax.quot}${firstCondition.ifFalse}${templateSyntax.quot}${templateSyntax.postfix}` as const,
      values: { [firstCondition.name]: false },
      result: firstCondition.ifTrue,
    },
    withoutPrefix: {
      template: unfinishedTemplate,
      values: { [firstCondition.name]: true },
      result: unfinishedTemplate,
    },
    withoutValues: {
      template: commonTemplate,
      values: {},
      result: commonTemplate,
    },
    withExtraChars: {
      template: TemplateWithExtraCharsAndSpaces,
      values: { [firstCondition.name]: true },
      result: TemplateWithExtraCharsAndSpaces,
    },
    twoConditions: {
      template:
        `${templateSyntax.prefix}${firstCondition.name}${templateSyntax.quot}${firstCondition.ifTrue}${templateSyntax.quot}${templateSyntax.delim}${templateSyntax.quot}${firstCondition.ifFalse}${templateSyntax.quot}${templateSyntax.postfix} ${templateSyntax.prefix}${secondCondition.name}${templateSyntax.quot}${secondCondition.ifTrue}${templateSyntax.quot}${templateSyntax.delim}${templateSyntax.quot}${secondCondition.ifFalse}${templateSyntax.quot}${templateSyntax.postfix}` as const,
      values: {
        [firstCondition.name]: true,
        [secondCondition.name]: true,
      },
      result: `${firstCondition.ifTrue} ${secondCondition.ifTrue}`,
    },
  } as const;
};

const getTests = (
  cases: AnyInterpolateConditionsCases,
  templateSyntax: DoubleMustache | BashStyle
) => {
  const entries = Object.entries(cases);

  for (const [caseName, { template, values, result }] of entries) {
    it(caseName, () => {
      const transformed = conditionsTransformer(
        template,
        values,
        templateSyntax.prefix,
        templateSyntax.postfix,
        templateSyntax.delim,
        templateSyntax.quot
      );

      assert.equal(transformed, result);
    });
  }
};

describe('conditionsTransformer', () => {
  describe('Double Mustache', () => {
    const doubleMustacheCases: DoubleMustacheCases = getCases(doubleMustache);

    getTests(doubleMustacheCases, doubleMustache);
  });

  describe('Bash Style', () => {
    const bashStyleCases: BashStyleCases = getCases(bashStyle);

    getTests(bashStyleCases, bashStyle);
  });
});
