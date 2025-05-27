import assert from 'node:assert';
import { describe, it } from 'node:test';
import type { IsUnion } from 'type-testing';
import type {
  AnyInterpolateValuesCases,
  DoubleMustache,
  InterpolateValuesCases,
  TemplateString,
} from './interpolatedValues.test.ts';
import { valuesTransformer } from './valuesTransformer.ts';

const firstValue = { name: 'first', value: 'first value' } as const;
const secondValue = { name: 'second', value: 'second value' } as const;

const doubleMustache: DoubleMustache = {
  prefix: '{{',
  postfix: '}}',
};

const templateString: TemplateString = {
  prefix: '${',
  postfix: '}',
};

type AllDoubleMustacheCases = InterpolateValuesCases<
  DoubleMustache['prefix'],
  DoubleMustache['postfix']
>;

type DoubleMustacheCases = {
  [Case in keyof AllDoubleMustacheCases as IsUnion<
    AllDoubleMustacheCases[Case]['result']
  > extends true
    ? never
    : Case]: AllDoubleMustacheCases[Case];
};

type AllTemplateStringCases = InterpolateValuesCases<
  TemplateString['prefix'],
  TemplateString['postfix']
>;

type TemplateStringCases = {
  [Case in keyof AllTemplateStringCases as IsUnion<
    AllTemplateStringCases[Case]['result']
  > extends true
    ? never
    : Case]: AllTemplateStringCases[Case];
};

const getCases = <
  Prefix extends string,
  Postfix extends string
>(templateSyntax: {
  prefix: Prefix;
  postfix: Postfix;
}) => {
  const commonTemplate =
    `${templateSyntax.prefix}${firstValue.name}${templateSyntax.postfix}` as const;
  const withSpaces =
    `${templateSyntax.prefix}   ${firstValue.name}   ${templateSyntax.postfix}` as const;
  const twoInRow =
    `${templateSyntax.prefix}${firstValue.name}${templateSyntax.postfix}${templateSyntax.prefix}${secondValue.name}${templateSyntax.postfix}` as const;
  const withAnd =
    `${templateSyntax.prefix}${firstValue.name}${templateSyntax.postfix} and ${templateSyntax.prefix}${secondValue.name}${templateSyntax.postfix}` as const;
  const sameInRow =
    `${templateSyntax.prefix}${firstValue.name}${templateSyntax.postfix} ${templateSyntax.prefix}${firstValue.name}${templateSyntax.postfix}` as const;
  const emptyString = 'Empty string' as const;
  const noPostfix = `${templateSyntax.prefix}${firstValue.name}` as const;
  const noName = `${templateSyntax.prefix} ${templateSyntax.postfix}` as const;

  return {
    withoutSpaces: {
      template: commonTemplate,
      values: { [firstValue.name]: firstValue.value },
      result: firstValue.value,
    },
    withoutValue: {
      template: commonTemplate,
      values: {},
      result: commonTemplate,
    },
    withSpaces: {
      template: withSpaces,
      values: { [firstValue.name]: firstValue.value },
      result: firstValue.value,
    },
    twoInRow: {
      template: twoInRow,
      values: {
        [firstValue.name]: firstValue.value,
        [secondValue.name]: secondValue.value,
      },
      result: `${firstValue.value}${secondValue.value}` as const,
    },
    withAnd: {
      template: withAnd,
      values: {
        [firstValue.name]: firstValue.value,
        [secondValue.name]: secondValue.value,
      },
      result: `${firstValue.value} and ${secondValue.value}` as const,
    },
    sameInRow: {
      template: sameInRow,
      values: { [firstValue.name]: firstValue.value },
      result: `${firstValue.value} ${firstValue.value}` as const,
    },
    emptyString: {
      template: emptyString,
      values: {},
      result: emptyString,
    },
    noPostfix: {
      template: noPostfix,
      values: { [firstValue.name]: firstValue.value },
      result: noPostfix,
    },
    noName: {
      template: noName,
      values: { [firstValue.name]: firstValue.value },
      result: noName,
    },
  };
};

const getTests = (
  cases: AnyInterpolateValuesCases,
  templateSyntax: DoubleMustache | TemplateString
) => {
  const entries = Object.entries(cases);

  for (const [caseName, { template, values, result }] of entries) {
    it(caseName, () => {
      const transformed = valuesTransformer(
        template,
        values,
        templateSyntax.prefix,
        templateSyntax.postfix
      );
      assert.equal(transformed, result);
    });
  }
};

describe('valuesTransformer', () => {
  describe('Double Mustache', () => {
    const doubleMustacheCases: DoubleMustacheCases = getCases(doubleMustache);
    getTests(doubleMustacheCases, doubleMustache);
  });

  describe('Template String', () => {
    const templateStringCases: TemplateStringCases = getCases(templateString);
    getTests(templateStringCases, templateString);
  });
});
