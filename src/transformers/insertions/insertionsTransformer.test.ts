import assert from 'node:assert';
import { describe, it } from 'node:test';
import { typedInsertionsTransformer } from './insertionsTransformer.ts';
import type {
  DoubleMustache,
  FirstPath,
  SecondPath,
  SomeText,
  TemplateStyle,
} from './interpolatedInsertions.test.ts';
import type { InterpolateInsertion } from './interpolatedInsertions.ts';

const firstPath: FirstPath = 'path1';
const secondPath: SecondPath = 'path2';
const someText: SomeText = 'Some text';

const firstInsertion = {
  path: firstPath,
  value: 'insertion1',
} as const;

const secondInsertion = {
  path: secondPath,
  value: 'insertion2',
} as const;

const firstInsertionValues = {
  [firstInsertion.path]: firstInsertion.value,
} as const;
const secondInsertionValues = {
  [secondInsertion.path]: secondInsertion.value,
} as const;
const allInsertionsValues = {
  [firstInsertion.path]: firstInsertion.value,
  [secondInsertion.path]: secondInsertion.value,
} as const;

const doubleMustache: DoubleMustache = {
  prefix: '{{>',
  postfix: '}}',
};

const templateStyle: TemplateStyle = {
  prefix: '<%=',
  postfix: '%>',
};

type DoubleMustacheInterpolateInsertion<
  Template extends string,
  Values extends Record<string, string>,
> = InterpolateInsertion<
  Template,
  typeof doubleMustache.prefix,
  typeof doubleMustache.postfix,
  Values
>;

type TemplateStyleInterpolateInsertion<
  Template extends string,
  Values extends Record<string, string>,
> = InterpolateInsertion<
  Template,
  typeof templateStyle.prefix,
  typeof templateStyle.postfix,
  Values
>;

const transformDoubleMustacheInsertions = <
  Template extends string,
  Values extends Record<string, string>,
>(
  template: Template,
  values: Values,
) =>
  typedInsertionsTransformer(
    template,
    values,
    doubleMustache.prefix,
    doubleMustache.postfix,
  );

const transformTemplateStyleInsertions = <
  Template extends string,
  Values extends Record<string, string>,
>(
  template: Template,
  values: Values,
) =>
  typedInsertionsTransformer(
    template,
    values,
    templateStyle.prefix,
    templateStyle.postfix,
  );

const getDoubleMustacheTemplate = <Path extends string>({
  path,
}: {
  path: Path;
}) => `${doubleMustache.prefix}${path}${doubleMustache.postfix}` as const;

const getDoubleMustacheSpacedTemplate = <Path extends string>({
  path,
}: {
  path: Path;
}) => `${doubleMustache.prefix}   ${path}   ${doubleMustache.postfix}` as const;

const getTemplateStyleTemplate = <Path extends string>({
  path,
}: {
  path: Path;
}) => `${templateStyle.prefix}${path}${templateStyle.postfix}` as const;

const getTemplateStyleSpacedTemplate = <Path extends string>({
  path,
}: {
  path: Path;
}) => `${templateStyle.prefix}   ${path}   ${templateStyle.postfix}` as const;

describe('insertionsTransformer', () => {
  describe('Double Mustache', () => {
    it('basicInsertion', () => {
      const template = getDoubleMustacheTemplate(firstInsertion);
      const values = firstInsertionValues;

      const expected: DoubleMustacheInterpolateInsertion<
        typeof template,
        typeof values
      > = firstInsertion.value;

      const actual = transformDoubleMustacheInsertions(template, values);

      assert.equal(expected, actual);
    });

    it('withSpaces', () => {
      const template = getDoubleMustacheSpacedTemplate(firstInsertion);
      const values = firstInsertionValues;

      const expected: DoubleMustacheInterpolateInsertion<
        typeof template,
        typeof values
      > = firstInsertion.value;

      const actual = transformDoubleMustacheInsertions(template, values);

      assert.equal(expected, actual);
    });

    it('twoInRow', () => {
      const template =
        `${getDoubleMustacheTemplate(firstInsertion)}${getDoubleMustacheTemplate(secondInsertion)}` as const;
      const values = allInsertionsValues;

      const expected: DoubleMustacheInterpolateInsertion<
        typeof template,
        typeof values
      > = `${firstInsertion.value}${secondInsertion.value}`;

      const actual = transformDoubleMustacheInsertions(template, values);

      assert.equal(expected, actual);
    });

    it('withText', () => {
      const template =
        `${someText}${getDoubleMustacheTemplate(firstInsertion)}${someText}${getDoubleMustacheTemplate(secondInsertion)}${someText}` as const;
      const values = allInsertionsValues;

      const expected: DoubleMustacheInterpolateInsertion<
        typeof template,
        typeof values
      > =
        `${someText}${firstInsertion.value}${someText}${secondInsertion.value}${someText}`;

      const actual = transformDoubleMustacheInsertions(template, values);

      assert.equal(expected, actual);
    });

    it('nestedInsertion', () => {
      const template = getDoubleMustacheTemplate(secondInsertion);
      const values = {
        [firstInsertion.path]: firstInsertion.value,
        [secondInsertion.path]: `${someText} ${getDoubleMustacheTemplate(firstInsertion)}`,
      } as const;

      const expected: DoubleMustacheInterpolateInsertion<
        typeof template,
        typeof values
      > = `${someText} ${firstInsertion.value}`;

      const actual = transformDoubleMustacheInsertions(template, values);

      assert.equal(expected, actual);
    });

    it('missingInsertion', () => {
      const template = getDoubleMustacheTemplate(firstInsertion);
      const values = secondInsertionValues;

      const expected: DoubleMustacheInterpolateInsertion<
        typeof template,
        typeof values
      > = template;

      const actual = transformDoubleMustacheInsertions(template, values);

      assert.equal(expected, actual);
    });

    it('invalidPathWithSpaces', () => {
      const template =
        `${doubleMustache.prefix}invalid path with spaces${doubleMustache.postfix}` as const;
      const values = firstInsertionValues;

      const expected: DoubleMustacheInterpolateInsertion<
        typeof template,
        typeof values
      > = template;

      const actual = transformDoubleMustacheInsertions(template, values);

      assert.equal(expected, actual);
    });

    it('noPostfix', () => {
      const template =
        `${doubleMustache.prefix}${firstInsertion.path}` as const;
      const values = firstInsertionValues;

      const expected: DoubleMustacheInterpolateInsertion<
        typeof template,
        typeof values
      > = template;

      const actual = transformDoubleMustacheInsertions(template, values);

      assert.equal(expected, actual);
    });

    it('noName', () => {
      const template =
        `${doubleMustache.prefix} ${doubleMustache.postfix}` as const;
      const values = firstInsertionValues;

      const expected: DoubleMustacheInterpolateInsertion<
        typeof template,
        typeof values
      > = template;

      const actual = transformDoubleMustacheInsertions(template, values);

      assert.equal(expected, actual);
    });

    it('onlyText', () => {
      const template = someText;
      const values = firstInsertionValues;

      const expected: DoubleMustacheInterpolateInsertion<
        typeof template,
        typeof values
      > = template;

      const actual = transformDoubleMustacheInsertions(template, values);

      assert.equal(expected, actual);
    });

    it('emptyString', () => {
      const template = '' as const;
      const values = firstInsertionValues;

      const expected: DoubleMustacheInterpolateInsertion<
        typeof template,
        typeof values
      > = template;

      const actual = transformDoubleMustacheInsertions(template, values);

      assert.equal(expected, actual);
    });
  });

  describe('Template Style', () => {
    it('basicInsertion', () => {
      const template = getTemplateStyleTemplate(firstInsertion);
      const values = firstInsertionValues;

      const expected: TemplateStyleInterpolateInsertion<
        typeof template,
        typeof values
      > = firstInsertion.value;

      const actual = transformTemplateStyleInsertions(template, values);

      assert.equal(expected, actual);
    });

    it('withSpaces', () => {
      const template = getTemplateStyleSpacedTemplate(firstInsertion);
      const values = firstInsertionValues;

      const expected: TemplateStyleInterpolateInsertion<
        typeof template,
        typeof values
      > = firstInsertion.value;

      const actual = transformTemplateStyleInsertions(template, values);

      assert.equal(expected, actual);
    });

    it('twoInRow', () => {
      const template =
        `${getTemplateStyleTemplate(firstInsertion)}${getTemplateStyleTemplate(secondInsertion)}` as const;
      const values = allInsertionsValues;

      const expected: TemplateStyleInterpolateInsertion<
        typeof template,
        typeof values
      > = `${firstInsertion.value}${secondInsertion.value}`;

      const actual = transformTemplateStyleInsertions(template, values);

      assert.equal(expected, actual);
    });

    it('withText', () => {
      const template =
        `${someText}${getTemplateStyleTemplate(firstInsertion)}${someText}${getTemplateStyleTemplate(secondInsertion)}${someText}` as const;
      const values = allInsertionsValues;

      const expected: TemplateStyleInterpolateInsertion<
        typeof template,
        typeof values
      > =
        `${someText}${firstInsertion.value}${someText}${secondInsertion.value}${someText}`;

      const actual = transformTemplateStyleInsertions(template, values);

      assert.equal(expected, actual);
    });

    it('nestedInsertion', () => {
      const template = getTemplateStyleTemplate(secondInsertion);
      const values = {
        [firstInsertion.path]: firstInsertion.value,
        [secondInsertion.path]: `${someText} ${getTemplateStyleTemplate(firstInsertion)}`,
      } as const;

      const expected: TemplateStyleInterpolateInsertion<
        typeof template,
        typeof values
      > = `${someText} ${firstInsertion.value}`;

      const actual = transformTemplateStyleInsertions(template, values);

      assert.equal(expected, actual);
    });

    it('missingInsertion', () => {
      const template = getTemplateStyleTemplate(firstInsertion);
      const values = secondInsertionValues;

      const expected: TemplateStyleInterpolateInsertion<
        typeof template,
        typeof values
      > = template;

      const actual = transformTemplateStyleInsertions(template, values);

      assert.equal(expected, actual);
    });

    it('invalidPathWithSpaces', () => {
      const template =
        `${templateStyle.prefix}invalid path with spaces${templateStyle.postfix}` as const;
      const values = firstInsertionValues;

      const expected: TemplateStyleInterpolateInsertion<
        typeof template,
        typeof values
      > = template;

      const actual = transformTemplateStyleInsertions(template, values);

      assert.equal(expected, actual);
    });

    it('noPostfix', () => {
      const template = `${templateStyle.prefix}${firstInsertion.path}` as const;
      const values = firstInsertionValues;

      const expected: TemplateStyleInterpolateInsertion<
        typeof template,
        typeof values
      > = template;

      const actual = transformTemplateStyleInsertions(template, values);

      assert.equal(expected, actual);
    });

    it('noName', () => {
      const template =
        `${templateStyle.prefix} ${templateStyle.postfix}` as const;
      const values = firstInsertionValues;

      const expected: TemplateStyleInterpolateInsertion<
        typeof template,
        typeof values
      > = template;

      const actual = transformTemplateStyleInsertions(template, values);

      assert.equal(expected, actual);
    });

    it('onlyText', () => {
      const template = someText;
      const values = firstInsertionValues;

      const expected: TemplateStyleInterpolateInsertion<
        typeof template,
        typeof values
      > = template;

      const actual = transformTemplateStyleInsertions(template, values);

      assert.equal(expected, actual);
    });

    it('emptyString', () => {
      const template = '' as const;
      const values = firstInsertionValues;

      const expected: TemplateStyleInterpolateInsertion<
        typeof template,
        typeof values
      > = template;

      const actual = transformTemplateStyleInsertions(template, values);

      assert.equal(expected, actual);
    });
  });
});
