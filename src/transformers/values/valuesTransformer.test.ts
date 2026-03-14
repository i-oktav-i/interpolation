import assert from 'node:assert';
import { describe, it } from 'node:test';
import type {
  DoubleMustache,
  FirstValue,
  SecondValue,
  TemplateString,
} from './interpolatedValues.test.ts';
import type { InterpolateValues } from './interpolatedValues.ts';
import { typedValuesTransformer } from './valuesTransformer.ts';

const firstValue: FirstValue = {
  name: 'first',
  value: 'first value',
};

const secondValue: SecondValue = {
  name: 'second',
  value: 'second value',
};

const firstValueParams = { [firstValue.name]: firstValue.value } as const;
const firstAndSecondValues = {
  [firstValue.name]: firstValue.value,
  [secondValue.name]: secondValue.value,
} as const;
const countValue = {
  name: 'count',
  value: 42,
} as const;
const countValueParams = { [countValue.name]: countValue.value } as const;

const doubleMustache: DoubleMustache = {
  prefix: '{{',
  postfix: '}}',
};

const templateString: TemplateString = {
  prefix: '${',
  postfix: '}',
};

const stringWithoutTemplate = 'Empty string' as const;

type DoubleMustacheInterpolateValues<
  Template extends string,
  Values extends Record<string, string | number>,
> = InterpolateValues<
  Template,
  typeof doubleMustache.prefix,
  typeof doubleMustache.postfix,
  Values
>;

type TemplateStringInterpolateValues<
  Template extends string,
  Values extends Record<string, string | number>,
> = InterpolateValues<
  Template,
  typeof templateString.prefix,
  typeof templateString.postfix,
  Values
>;

const transformDoubleMustacheValues = <
  Template extends string,
  Values extends Record<string, string | number>,
>(
  template: Template,
  values: Values,
) =>
  typedValuesTransformer(
    template,
    values,
    doubleMustache.prefix,
    doubleMustache.postfix,
  );

const transformTemplateStringValues = <
  Template extends string,
  Values extends Record<string, string | number>,
>(
  template: Template,
  values: Values,
) =>
  typedValuesTransformer(
    template,
    values,
    templateString.prefix,
    templateString.postfix,
  );

const getDoubleMustacheTemplate = <Name extends string>({
  name,
}: {
  name: Name;
}) => `${doubleMustache.prefix}${name}${doubleMustache.postfix}` as const;

const getDoubleMustacheSpacedTemplate = <Name extends string>({
  name,
}: {
  name: Name;
}) => `${doubleMustache.prefix}   ${name}   ${doubleMustache.postfix}` as const;

const getTemplateStringTemplate = <Name extends string>({
  name,
}: {
  name: Name;
}) => `${templateString.prefix}${name}${templateString.postfix}` as const;

const getTemplateStringSpacedTemplate = <Name extends string>({
  name,
}: {
  name: Name;
}) => `${templateString.prefix}   ${name}   ${templateString.postfix}` as const;

describe('valuesTransformer', () => {
  describe('Double Mustache', () => {
    it('withoutSpaces', () => {
      const template = getDoubleMustacheTemplate(firstValue);
      const values = firstValueParams;

      const expected: DoubleMustacheInterpolateValues<
        typeof template,
        typeof values
      > = firstValue.value;

      const actual = transformDoubleMustacheValues(template, values);

      assert.equal(expected, actual);
    });

    it('withoutValue', () => {
      const template = getDoubleMustacheTemplate(firstValue);
      const values = {} as const;

      const expected: DoubleMustacheInterpolateValues<
        typeof template,
        typeof values
      > = template;

      const actual = transformDoubleMustacheValues(template, values);

      assert.equal(expected, actual);
    });

    it('withSpaces', () => {
      const template = getDoubleMustacheSpacedTemplate(firstValue);
      const values = firstValueParams;

      const expected: DoubleMustacheInterpolateValues<
        typeof template,
        typeof values
      > = firstValue.value;

      const actual = transformDoubleMustacheValues(template, values);

      assert.equal(expected, actual);
    });

    it('twoInRow', () => {
      const template =
        `${getDoubleMustacheTemplate(firstValue)}${getDoubleMustacheTemplate(secondValue)}` as const;
      const values = firstAndSecondValues;

      const expected: DoubleMustacheInterpolateValues<
        typeof template,
        typeof values
      > = `${firstValue.value}${secondValue.value}`;

      const actual = transformDoubleMustacheValues(template, values);

      assert.equal(expected, actual);
    });

    it('withAnd', () => {
      const template =
        `${getDoubleMustacheTemplate(firstValue)} and ${getDoubleMustacheTemplate(secondValue)}` as const;
      const values = firstAndSecondValues;

      const expected: DoubleMustacheInterpolateValues<
        typeof template,
        typeof values
      > = `${firstValue.value} and ${secondValue.value}`;

      const actual = transformDoubleMustacheValues(template, values);

      assert.equal(expected, actual);
    });

    it('numberValue', () => {
      const template = getDoubleMustacheTemplate(countValue);
      const values = countValueParams;

      const expected: DoubleMustacheInterpolateValues<
        typeof template,
        typeof values
      > = '42';

      const actual = transformDoubleMustacheValues(template, values);

      assert.equal(expected, actual);
    });

    it('sameInRow', () => {
      const template =
        `${getDoubleMustacheTemplate(firstValue)} ${getDoubleMustacheTemplate(firstValue)}` as const;
      const values = firstValueParams;

      const expected: DoubleMustacheInterpolateValues<
        typeof template,
        typeof values
      > = `${firstValue.value} ${firstValue.value}`;

      const actual = transformDoubleMustacheValues(template, values);

      assert.equal(expected, actual);
    });

    it('emptyString', () => {
      const template = stringWithoutTemplate;
      const values = {} as const;

      const expected: DoubleMustacheInterpolateValues<
        typeof template,
        typeof values
      > = template;

      const actual = transformDoubleMustacheValues(template, values);

      assert.equal(expected, actual);
    });

    it('noPostfix', () => {
      const template = `${doubleMustache.prefix}${firstValue.name}` as const;
      const values = firstValueParams;

      const expected: DoubleMustacheInterpolateValues<
        typeof template,
        typeof values
      > = template;

      const actual = transformDoubleMustacheValues(template, values);

      assert.equal(expected, actual);
    });

    it('noName', () => {
      const template =
        `${doubleMustache.prefix} ${doubleMustache.postfix}` as const;
      const values = firstValueParams;

      const expected: DoubleMustacheInterpolateValues<
        typeof template,
        typeof values
      > = template;

      const actual = transformDoubleMustacheValues(template, values);

      assert.equal(expected, actual);
    });
  });

  describe('Template String', () => {
    it('withoutSpaces', () => {
      const template = getTemplateStringTemplate(firstValue);
      const values = firstValueParams;

      const expected: TemplateStringInterpolateValues<
        typeof template,
        typeof values
      > = firstValue.value;

      const actual = transformTemplateStringValues(template, values);

      assert.equal(expected, actual);
    });

    it('withoutValue', () => {
      const template = getTemplateStringTemplate(firstValue);
      const values = {} as const;

      const expected: TemplateStringInterpolateValues<
        typeof template,
        typeof values
      > = template;

      const actual = transformTemplateStringValues(template, values);

      assert.equal(expected, actual);
    });

    it('withSpaces', () => {
      const template = getTemplateStringSpacedTemplate(firstValue);
      const values = firstValueParams;

      const expected: TemplateStringInterpolateValues<
        typeof template,
        typeof values
      > = firstValue.value;

      const actual = transformTemplateStringValues(template, values);

      assert.equal(expected, actual);
    });

    it('twoInRow', () => {
      const template =
        `${getTemplateStringTemplate(firstValue)}${getTemplateStringTemplate(secondValue)}` as const;
      const values = firstAndSecondValues;

      const expected: TemplateStringInterpolateValues<
        typeof template,
        typeof values
      > = `${firstValue.value}${secondValue.value}`;

      const actual = transformTemplateStringValues(template, values);

      assert.equal(expected, actual);
    });

    it('withAnd', () => {
      const template =
        `${getTemplateStringTemplate(firstValue)} and ${getTemplateStringTemplate(secondValue)}` as const;
      const values = firstAndSecondValues;

      const expected: TemplateStringInterpolateValues<
        typeof template,
        typeof values
      > = `${firstValue.value} and ${secondValue.value}`;

      const actual = transformTemplateStringValues(template, values);

      assert.equal(expected, actual);
    });

    it('numberValue', () => {
      const template = getTemplateStringTemplate(countValue);
      const values = countValueParams;

      const expected: TemplateStringInterpolateValues<
        typeof template,
        typeof values
      > = '42';

      const actual = transformTemplateStringValues(template, values);

      assert.equal(expected, actual);
    });

    it('sameInRow', () => {
      const template =
        `${getTemplateStringTemplate(firstValue)} ${getTemplateStringTemplate(firstValue)}` as const;
      const values = firstValueParams;

      const expected: TemplateStringInterpolateValues<
        typeof template,
        typeof values
      > = `${firstValue.value} ${firstValue.value}`;

      const actual = transformTemplateStringValues(template, values);

      assert.equal(expected, actual);
    });

    it('emptyString', () => {
      const template = stringWithoutTemplate;
      const values = {} as const;

      const expected: TemplateStringInterpolateValues<
        typeof template,
        typeof values
      > = template;

      const actual = transformTemplateStringValues(template, values);

      assert.equal(expected, actual);
    });

    it('noPostfix', () => {
      const template = `${templateString.prefix}${firstValue.name}` as const;
      const values = firstValueParams;

      const expected: TemplateStringInterpolateValues<
        typeof template,
        typeof values
      > = template;

      const actual = transformTemplateStringValues(template, values);

      assert.equal(expected, actual);
    });

    it('noName', () => {
      const template =
        `${templateString.prefix} ${templateString.postfix}` as const;
      const values = firstValueParams;

      const expected: TemplateStringInterpolateValues<
        typeof template,
        typeof values
      > = template;

      const actual = transformTemplateStringValues(template, values);

      assert.equal(expected, actual);
    });
  });
});
