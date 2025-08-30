import assert from 'node:assert';
import { describe, it } from 'node:test';
import type { InterpolateValues } from './interpolatedValues.ts';
import { valuesTransformer } from './valuesTransformer.ts';

const firstValue = {
  name: 'first',
  value: ['first value 1', 'first value 2'],
} as const;

const secondValue = {
  name: 'second',
  value: ['second value 1', 'second value 2'],
} as const;

const doubleMustache = {
  prefix: '{{',
  postfix: '}}',
} as const;

const templateString = {
  prefix: '${',
  postfix: '}',
} as const;

const someText = 'Some text' as const;

type TemplateSyntax<Prefix extends string, Postfix extends string> = {
  prefix: Prefix;
  postfix: Postfix;
};

describe('valuesTransformer tests', () => {
  describe('One value, value provided', () => {
    const getCase = <Prefix extends string, Postfix extends string>(
      templateSyntax: TemplateSyntax<Prefix, Postfix>
    ) => ({
      template: [
        `${templateSyntax.prefix}${firstValue.name}${templateSyntax.postfix}` as const,
        `${templateSyntax.prefix}  ${firstValue.name}  ${templateSyntax.postfix}` as const,
      ],
      values: [
        { [firstValue.name]: firstValue.value[0] },
        { [firstValue.name]: firstValue.value[1] },
      ],
      result: [firstValue.value[0], firstValue.value[1]],
    });

    const getActual = <Prefix extends string, Postfix extends string>(
      caseData: ReturnType<typeof getCase<Prefix, Postfix>>,
      templateSyntax: TemplateSyntax<Prefix, Postfix>
    ) => {
      return caseData.template.map((template) =>
        caseData.values.map((values) =>
          valuesTransformer(
            template,
            values,
            templateSyntax.prefix,
            templateSyntax.postfix
          )
        )
      );
    };

    it('Double Mustache', () => {
      const doubleMustacheCase = getCase(doubleMustache);

      const actual = getActual(doubleMustacheCase, doubleMustache);

      const expected: InterpolateValues<
        (typeof doubleMustacheCase.template)[number],
        (typeof doubleMustache)['prefix'],
        (typeof doubleMustache)['postfix'],
        (typeof doubleMustacheCase.values)[number]
      >[] = doubleMustacheCase.result;

      assert.deepEqual(actual, [expected, expected]);
    });

    it('Template String', () => {
      const templateStringCase = getCase(templateString);

      const actual = getActual(templateStringCase, templateString);

      const expected: InterpolateValues<
        (typeof templateStringCase.template)[number],
        (typeof templateString)['prefix'],
        (typeof templateString)['postfix'],
        (typeof templateStringCase.values)[number]
      >[] = templateStringCase.result;

      assert.deepEqual(actual, [expected, expected]);
    });
  });

  describe('One value, value not provided', () => {
    const getCase = <Prefix extends string, Postfix extends string>(
      templateSyntax: TemplateSyntax<Prefix, Postfix>
    ) => ({
      template: [
        `${templateSyntax.prefix}${firstValue.name}${templateSyntax.postfix}` as const,
        `${templateSyntax.prefix}  ${firstValue.name}  ${templateSyntax.postfix}` as const,
      ],
      values: {},
    });

    const getActual = <Prefix extends string, Postfix extends string>(
      caseData: ReturnType<typeof getCase<Prefix, Postfix>>,
      templateSyntax: TemplateSyntax<Prefix, Postfix>
    ) => {
      return caseData.template.map((template) =>
        valuesTransformer(
          template,
          caseData.values,
          templateSyntax.prefix,
          templateSyntax.postfix
        )
      );
    };

    it('Double Mustache', () => {
      const doubleMustacheCase = getCase(doubleMustache);

      const actual = getActual(doubleMustacheCase, doubleMustache);

      const expected: InterpolateValues<
        (typeof doubleMustacheCase.template)[number],
        (typeof doubleMustache)['prefix'],
        (typeof doubleMustache)['postfix'],
        typeof doubleMustacheCase.values
      >[] = doubleMustacheCase.template;

      assert.deepEqual(actual, expected);
    });

    it('Template String', () => {
      const templateStringCase = getCase(templateString);

      const actual = getActual(templateStringCase, templateString);

      const expected: InterpolateValues<
        (typeof templateStringCase.template)[number],
        (typeof templateString)['prefix'],
        (typeof templateString)['postfix'],
        typeof templateStringCase.values
      >[] = templateStringCase.template;

      assert.deepEqual(actual, expected);
    });
  });

  describe('To values, values provided', () => {
    const getCase = <Prefix extends string, Postfix extends string>(
      templateSyntax: TemplateSyntax<Prefix, Postfix>
    ) => ({
      template: [
        `${templateSyntax.prefix}${firstValue.name}${templateSyntax.postfix} ${templateSyntax.prefix}${secondValue.name}${templateSyntax.postfix}` as const,
        `${templateSyntax.prefix}  ${firstValue.name}  ${templateSyntax.postfix} ${templateSyntax.prefix}  ${secondValue.name}  ${templateSyntax.postfix}` as const,
      ],
      values: [
        {
          [firstValue.name]: firstValue.value[0],
          [secondValue.name]: secondValue.value[0],
        },
        {
          [firstValue.name]: firstValue.value[1],
          [secondValue.name]: secondValue.value[1],
        },
      ],
      result: [
        `${firstValue.value[0]} ${secondValue.value[0]}` as const,
        `${firstValue.value[1]} ${secondValue.value[1]}` as const,
      ],
    });

    const getActual = <Prefix extends string, Postfix extends string>(
      caseData: ReturnType<typeof getCase<Prefix, Postfix>>,
      templateSyntax: TemplateSyntax<Prefix, Postfix>
    ) => {
      return caseData.template.map((template) =>
        caseData.values.map((values) =>
          valuesTransformer(
            template,
            values,
            templateSyntax.prefix,
            templateSyntax.postfix
          )
        )
      );
    };

    it('Double Mustache', () => {
      const doubleMustacheCase = getCase(doubleMustache);

      const actual = getActual(doubleMustacheCase, doubleMustache);

      const expected: InterpolateValues<
        (typeof doubleMustacheCase.template)[number],
        (typeof doubleMustache)['prefix'],
        (typeof doubleMustache)['postfix'],
        (typeof doubleMustacheCase.values)[number]
      >[] = doubleMustacheCase.result;

      assert.deepEqual(actual, [expected, expected]);
    });

    it('Template String', () => {
      const templateStringCase = getCase(templateString);

      const actual = getActual(templateStringCase, templateString);

      const expected: InterpolateValues<
        (typeof templateStringCase.template)[number],
        (typeof templateString)['prefix'],
        (typeof templateString)['postfix'],
        (typeof templateStringCase.values)[number]
      >[] = templateStringCase.result;

      assert.deepEqual(actual, [expected, expected]);
    });
  });

  describe('One value twice, value provided', () => {
    const getCase = <Prefix extends string, Postfix extends string>(
      templateSyntax: TemplateSyntax<Prefix, Postfix>
    ) => ({
      template: [
        `${templateSyntax.prefix}${firstValue.name}${templateSyntax.postfix} ${templateSyntax.prefix}${firstValue.name}${templateSyntax.postfix}` as const,
        `${templateSyntax.prefix}  ${firstValue.name}  ${templateSyntax.postfix} ${templateSyntax.prefix}  ${firstValue.name}  ${templateSyntax.postfix}` as const,
      ],
      values: [
        { [firstValue.name]: firstValue.value[0] },
        { [firstValue.name]: firstValue.value[1] },
      ],
      result: [
        `${firstValue.value[0]} ${firstValue.value[0]}` as const,
        `${firstValue.value[1]} ${firstValue.value[1]}` as const,
      ],
    });

    const getActual = <Prefix extends string, Postfix extends string>(
      caseData: ReturnType<typeof getCase<Prefix, Postfix>>,
      templateSyntax: TemplateSyntax<Prefix, Postfix>
    ) => {
      return caseData.template.map((template) =>
        caseData.values.map((values) =>
          valuesTransformer(
            template,
            values,
            templateSyntax.prefix,
            templateSyntax.postfix
          )
        )
      );
    };

    it('Double Mustache', () => {
      const doubleMustacheCase = getCase(doubleMustache);

      const actual = getActual(doubleMustacheCase, doubleMustache);

      const expected: InterpolateValues<
        (typeof doubleMustacheCase.template)[number],
        (typeof doubleMustache)['prefix'],
        (typeof doubleMustache)['postfix'],
        (typeof doubleMustacheCase.values)[number]
      >[] = doubleMustacheCase.result;

      assert.deepEqual(actual, [expected, expected]);
    });

    it('Template String', () => {
      const templateStringCase = getCase(templateString);

      const actual = getActual(templateStringCase, templateString);

      const expected: InterpolateValues<
        (typeof templateStringCase.template)[number],
        (typeof templateString)['prefix'],
        (typeof templateString)['postfix'],
        (typeof templateStringCase.values)[number]
      >[] = templateStringCase.result;

      assert.deepEqual(actual, [expected, expected]);
    });
  });

  describe('No values or wrong template, value provided', () => {
    const getCase = <Prefix extends string, Postfix extends string>(
      templateSyntax: TemplateSyntax<Prefix, Postfix>
    ) => ({
      template: [
        `${templateSyntax.prefix} ${someText} ${templateSyntax.postfix}` as const,
        `${templateSyntax.prefix} ${templateSyntax.postfix}` as const,
        `${templateSyntax.prefix} ${firstValue.name}` as const,
        `${firstValue.name} ${templateSyntax.postfix}` as const,
        someText,
      ],
      values: { [firstValue.name]: firstValue.value[0] },
    });

    const getActual = <Prefix extends string, Postfix extends string>(
      caseData: ReturnType<typeof getCase<Prefix, Postfix>>,
      templateSyntax: TemplateSyntax<Prefix, Postfix>
    ) => {
      return caseData.template.map((template) =>
        valuesTransformer(
          template,
          caseData.values,
          templateSyntax.prefix,
          templateSyntax.postfix
        )
      );
    };

    it('Double Mustache', () => {
      const doubleMustacheCase = getCase(doubleMustache);

      const actual = getActual(doubleMustacheCase, doubleMustache);

      const expected: InterpolateValues<
        (typeof doubleMustacheCase.template)[number],
        (typeof doubleMustache)['prefix'],
        (typeof doubleMustache)['postfix'],
        typeof doubleMustacheCase.values
      >[] = doubleMustacheCase.template;

      assert.deepEqual(actual, expected);
    });

    it('Template String', () => {
      const templateStringCase = getCase(templateString);

      const actual = getActual(templateStringCase, templateString);

      const expected: InterpolateValues<
        (typeof templateStringCase.template)[number],
        (typeof templateString)['prefix'],
        (typeof templateString)['postfix'],
        typeof templateStringCase.values
      >[] = templateStringCase.template;

      assert.deepEqual(actual, expected);
    });
  });
});
