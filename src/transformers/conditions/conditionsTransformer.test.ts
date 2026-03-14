import assert from 'node:assert';
import { describe, it } from 'node:test';
import { typedConditionsTransformer } from './conditionsTransformer.ts';
import type {
  BashStyle,
  DoubleMustache,
  FirstCondition,
  SecondCondition,
} from './interpolatedConditions.test.ts';
import type {
  InterpolateConditions,
  Negation,
} from './interpolatedConditions.ts';

const negation: Negation = '!';

const firstCondition: FirstCondition = {
  name: 'condition1',
  ifTrue: 'first condition is true',
  ifFalse: 'first condition is false',
};

const secondCondition: SecondCondition = {
  name: 'condition2',
  ifTrue: 'second condition is true',
  ifFalse: 'second condition is false',
};

const firstConditionTrue = { [firstCondition.name]: true } as const;
const firstConditionFalse = { [firstCondition.name]: false } as const;
const firstConditionZero = { [firstCondition.name]: 0 } as const;
const firstConditionEmptyString = { [firstCondition.name]: '' } as const;
const firstConditionNull = { [firstCondition.name]: null } as const;
const firstConditionUndefined = { [firstCondition.name]: undefined } as const;
const firstConditionTruthyString = {
  [firstCondition.name]: 'enabled',
} as const;
const twoConditionsTrue = {
  [firstCondition.name]: true,
  [secondCondition.name]: true,
} as const;

const doubleMustache: DoubleMustache = {
  prefix: '{{?',
  postfix: '}}',
  delim: '::',
  quot: '"',
};

const bashStyle: BashStyle = {
  prefix: '#if',
  postfix: '#endif',
  delim: '#else',
  quot: '`',
};

type DoubleMustacheInterpolateConditions<
  Template extends string,
  Values extends Record<string, unknown>,
> = InterpolateConditions<
  Template,
  typeof doubleMustache.prefix,
  typeof doubleMustache.postfix,
  typeof doubleMustache.delim,
  typeof doubleMustache.quot,
  Values
>;

type BashStyleInterpolateConditions<
  Template extends string,
  Values extends Record<string, unknown>,
> = InterpolateConditions<
  Template,
  typeof bashStyle.prefix,
  typeof bashStyle.postfix,
  typeof bashStyle.delim,
  typeof bashStyle.quot,
  Values
>;

const transformDoubleMustacheConditions = <
  Template extends string,
  Values extends Record<string, unknown>,
>(
  template: Template,
  values: Values,
) =>
  typedConditionsTransformer(
    template,
    values,
    doubleMustache.prefix,
    doubleMustache.postfix,
    doubleMustache.delim,
    doubleMustache.quot,
  );

const transformBashStyleConditions = <
  Template extends string,
  Values extends Record<string, unknown>,
>(
  template: Template,
  values: Values,
) =>
  typedConditionsTransformer(
    template,
    values,
    bashStyle.prefix,
    bashStyle.postfix,
    bashStyle.delim,
    bashStyle.quot,
  );

const getDoubleMustacheTemplate = <
  Name extends string,
  IfTrue extends string,
  IfFalse extends string,
>({
  name,
  ifTrue,
  ifFalse,
}: {
  name: Name;
  ifTrue: IfTrue;
  ifFalse: IfFalse;
}): `{{?${Name}"${IfTrue}"::"${IfFalse}"}}` =>
  `${doubleMustache.prefix}${name}${doubleMustache.quot}${ifTrue}${doubleMustache.quot}${doubleMustache.delim}${doubleMustache.quot}${ifFalse}${doubleMustache.quot}${doubleMustache.postfix}` as never;

const getDoubleMustacheSpacedTemplate = <
  Name extends string,
  IfTrue extends string,
  IfFalse extends string,
>({
  name,
  ifTrue,
  ifFalse,
}: {
  name: Name;
  ifTrue: IfTrue;
  ifFalse: IfFalse;
}): `{{?      ${Name}           "${IfTrue}"     ::"${IfFalse}"     }}` =>
  `${doubleMustache.prefix}      ${name}           ${doubleMustache.quot}${ifTrue}${doubleMustache.quot}     ${doubleMustache.delim}${doubleMustache.quot}${ifFalse}${doubleMustache.quot}     ${doubleMustache.postfix}` as never;

const getDoubleMustacheNegatedTemplate = <
  Name extends string,
  IfTrue extends string,
  IfFalse extends string,
>({
  name,
  ifTrue,
  ifFalse,
}: {
  name: Name;
  ifTrue: IfTrue;
  ifFalse: IfFalse;
}): `{{?!${Name}"${IfTrue}"::"${IfFalse}"}}` =>
  `${doubleMustache.prefix}${negation}${name}${doubleMustache.quot}${ifTrue}${doubleMustache.quot}${doubleMustache.delim}${doubleMustache.quot}${ifFalse}${doubleMustache.quot}${doubleMustache.postfix}` as never;

const getDoubleMustacheSpacedNegatedTemplate = <
  Name extends string,
  IfTrue extends string,
  IfFalse extends string,
>({
  name,
  ifTrue,
  ifFalse,
}: {
  name: Name;
  ifTrue: IfTrue;
  ifFalse: IfFalse;
}): `{{?      !${Name}           "${IfTrue}"     ::"${IfFalse}"     }}` =>
  `${doubleMustache.prefix}      ${negation}${name}           ${doubleMustache.quot}${ifTrue}${doubleMustache.quot}     ${doubleMustache.delim}${doubleMustache.quot}${ifFalse}${doubleMustache.quot}     ${doubleMustache.postfix}` as never;

const getBashStyleTemplate = <
  Name extends string,
  IfTrue extends string,
  IfFalse extends string,
>({
  name,
  ifTrue,
  ifFalse,
}: {
  name: Name;
  ifTrue: IfTrue;
  ifFalse: IfFalse;
}): `#if${Name}\`${IfTrue}\`#else\`${IfFalse}\`#endif` =>
  `${bashStyle.prefix}${name}${bashStyle.quot}${ifTrue}${bashStyle.quot}${bashStyle.delim}${bashStyle.quot}${ifFalse}${bashStyle.quot}${bashStyle.postfix}` as never;

const getBashStyleSpacedTemplate = <
  Name extends string,
  IfTrue extends string,
  IfFalse extends string,
>({
  name,
  ifTrue,
  ifFalse,
}: {
  name: Name;
  ifTrue: IfTrue;
  ifFalse: IfFalse;
}): `#if      ${Name}           \`${IfTrue}\`     #else\`${IfFalse}\`     #endif` =>
  `${bashStyle.prefix}      ${name}           ${bashStyle.quot}${ifTrue}${bashStyle.quot}     ${bashStyle.delim}${bashStyle.quot}${ifFalse}${bashStyle.quot}     ${bashStyle.postfix}` as never;

const getBashStyleNegatedTemplate = <
  Name extends string,
  IfTrue extends string,
  IfFalse extends string,
>({
  name,
  ifTrue,
  ifFalse,
}: {
  name: Name;
  ifTrue: IfTrue;
  ifFalse: IfFalse;
}): `#if!${Name}\`${IfTrue}\`#else\`${IfFalse}\`#endif` =>
  `${bashStyle.prefix}${negation}${name}${bashStyle.quot}${ifTrue}${bashStyle.quot}${bashStyle.delim}${bashStyle.quot}${ifFalse}${bashStyle.quot}${bashStyle.postfix}` as never;

const getBashStyleSpacedNegatedTemplate = <
  Name extends string,
  IfTrue extends string,
  IfFalse extends string,
>({
  name,
  ifTrue,
  ifFalse,
}: {
  name: Name;
  ifTrue: IfTrue;
  ifFalse: IfFalse;
}): `#if      !${Name}           \`${IfTrue}\`     #else\`${IfFalse}\`     #endif` =>
  `${bashStyle.prefix}      ${negation}${name}           ${bashStyle.quot}${ifTrue}${bashStyle.quot}     ${bashStyle.delim}${bashStyle.quot}${ifFalse}${bashStyle.quot}     ${bashStyle.postfix}` as never;

describe('conditionsTransformer', () => {
  describe('Double Mustache', () => {
    it('withoutNegationWithTrueCondition', () => {
      const template = getDoubleMustacheTemplate(firstCondition);
      const values = firstConditionTrue;

      const expected: DoubleMustacheInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifTrue;

      const actual = transformDoubleMustacheConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withoutNegationWithFalseCondition', () => {
      const template = getDoubleMustacheTemplate(firstCondition);
      const values = firstConditionFalse;

      const expected: DoubleMustacheInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifFalse;

      const actual = transformDoubleMustacheConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withNegationWithTrueCondition', () => {
      const template = getDoubleMustacheNegatedTemplate(firstCondition);
      const values = firstConditionTrue;

      const expected: DoubleMustacheInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifFalse;

      const actual = transformDoubleMustacheConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withNegationWithFalseCondition', () => {
      const template = getDoubleMustacheNegatedTemplate(firstCondition);
      const values = firstConditionFalse;

      const expected: DoubleMustacheInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifTrue;

      const actual = transformDoubleMustacheConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withSpacesWithoutNegation', () => {
      const template = getDoubleMustacheSpacedTemplate(firstCondition);
      const values = firstConditionTrue;

      const expected: DoubleMustacheInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifTrue;

      const actual = transformDoubleMustacheConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withSpacesWithNegation', () => {
      const template = getDoubleMustacheSpacedNegatedTemplate(firstCondition);
      const values = firstConditionFalse;

      const expected: DoubleMustacheInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifTrue;

      const actual = transformDoubleMustacheConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withZeroCondition', () => {
      const template = getDoubleMustacheTemplate(firstCondition);
      const values = firstConditionZero;

      const expected: DoubleMustacheInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifFalse;

      const actual = transformDoubleMustacheConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withEmptyStringCondition', () => {
      const template = getDoubleMustacheTemplate(firstCondition);
      const values = firstConditionEmptyString;

      const expected: DoubleMustacheInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifFalse;

      const actual = transformDoubleMustacheConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withNullCondition', () => {
      const template = getDoubleMustacheTemplate(firstCondition);
      const values = firstConditionNull;

      const expected: DoubleMustacheInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifFalse;

      const actual = transformDoubleMustacheConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withUndefinedCondition', () => {
      const template = getDoubleMustacheTemplate(firstCondition);
      const values = firstConditionUndefined;

      const expected: DoubleMustacheInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifFalse;

      const actual = transformDoubleMustacheConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withTruthyStringCondition', () => {
      const template = getDoubleMustacheTemplate(firstCondition);
      const values = firstConditionTruthyString;

      const expected: DoubleMustacheInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifTrue;

      const actual = transformDoubleMustacheConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withoutPrefix', () => {
      const template =
        `${firstCondition.name}${doubleMustache.quot}${firstCondition.ifTrue}${doubleMustache.quot}${doubleMustache.delim}${doubleMustache.quot}${firstCondition.ifFalse}${doubleMustache.quot}${doubleMustache.postfix}` as const;

      const values = firstConditionTrue;

      const expected: DoubleMustacheInterpolateConditions<
        typeof template,
        typeof values
      > = template;

      const actual = transformDoubleMustacheConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withoutPostfix', () => {
      const template =
        `${doubleMustache.prefix}${firstCondition.name}${doubleMustache.quot}${firstCondition.ifTrue}${doubleMustache.quot}${doubleMustache.delim}${doubleMustache.quot}${firstCondition.ifFalse}${doubleMustache.quot}` as const;

      const values = firstConditionTrue;

      const expected: DoubleMustacheInterpolateConditions<
        typeof template,
        typeof values
      > = template;

      const actual = transformDoubleMustacheConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withoutDelim', () => {
      const template =
        `${doubleMustache.prefix}${firstCondition.name}${doubleMustache.quot}${firstCondition.ifTrue}${doubleMustache.quot}${doubleMustache.quot}${firstCondition.ifFalse}${doubleMustache.quot}${doubleMustache.postfix}` as const;

      const values = firstConditionTrue;

      const expected: DoubleMustacheInterpolateConditions<
        typeof template,
        typeof values
      > = template;

      const actual = transformDoubleMustacheConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withSpacesWithWrongNegation', () => {
      const template =
        `${doubleMustache.prefix}${negation}      ${firstCondition.name}           ${doubleMustache.quot}${firstCondition.ifTrue}${doubleMustache.quot}     ${doubleMustache.delim}     ${doubleMustache.quot}${firstCondition.ifFalse}${doubleMustache.quot}     ${doubleMustache.postfix}` as const;

      const values = firstConditionTrue;

      const expected: DoubleMustacheInterpolateConditions<
        typeof template,
        typeof values
      > = template;

      const actual = transformDoubleMustacheConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withoutValues', () => {
      const template = getDoubleMustacheTemplate(firstCondition);

      const values = {} as const;

      const expected: DoubleMustacheInterpolateConditions<
        typeof template,
        typeof values
      > = template;

      const actual = transformDoubleMustacheConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withExtraChars', () => {
      const template =
        `${doubleMustache.prefix}    ${firstCondition.name}    ${doubleMustache.quot}${firstCondition.ifTrue}${doubleMustache.quot}${doubleMustache.delim}wrong${doubleMustache.quot}${firstCondition.ifFalse}${doubleMustache.quot}${doubleMustache.postfix}` as const;

      const values = firstConditionTrue;

      const expected: DoubleMustacheInterpolateConditions<
        typeof template,
        typeof values
      > = template;

      const actual = transformDoubleMustacheConditions(template, values);

      assert.equal(expected, actual);
    });

    it('twoConditions', () => {
      const template =
        `${getDoubleMustacheTemplate(firstCondition)} ${getDoubleMustacheTemplate(secondCondition)}` as const;

      const values = twoConditionsTrue;

      const expected: DoubleMustacheInterpolateConditions<
        typeof template,
        typeof values
      > = `${firstCondition.ifTrue} ${secondCondition.ifTrue}`;

      const actual = transformDoubleMustacheConditions(template, values);

      assert.equal(expected, actual);
    });
  });

  describe('Bash Style', () => {
    it('withoutNegationWithTrueCondition', () => {
      const template = getBashStyleTemplate(firstCondition);
      const values = firstConditionTrue;

      const expected: BashStyleInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifTrue;

      const actual = transformBashStyleConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withoutNegationWithFalseCondition', () => {
      const template = getBashStyleTemplate(firstCondition);
      const values = firstConditionFalse;

      const expected: BashStyleInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifFalse;

      const actual = transformBashStyleConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withNegationWithTrueCondition', () => {
      const template = getBashStyleNegatedTemplate(firstCondition);
      const values = firstConditionTrue;

      const expected: BashStyleInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifFalse;

      const actual = transformBashStyleConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withNegationWithFalseCondition', () => {
      const template = getBashStyleNegatedTemplate(firstCondition);
      const values = firstConditionFalse;

      const expected: BashStyleInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifTrue;

      const actual = transformBashStyleConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withSpacesWithoutNegation', () => {
      const template = getBashStyleSpacedTemplate(firstCondition);
      const values = firstConditionTrue;

      const expected: BashStyleInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifTrue;

      const actual = transformBashStyleConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withSpacesWithNegation', () => {
      const template = getBashStyleSpacedNegatedTemplate(firstCondition);
      const values = firstConditionFalse;

      const expected: BashStyleInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifTrue;

      const actual = transformBashStyleConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withZeroCondition', () => {
      const template = getBashStyleTemplate(firstCondition);
      const values = firstConditionZero;

      const expected: BashStyleInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifFalse;

      const actual = transformBashStyleConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withEmptyStringCondition', () => {
      const template = getBashStyleTemplate(firstCondition);
      const values = firstConditionEmptyString;

      const expected: BashStyleInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifFalse;

      const actual = transformBashStyleConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withNullCondition', () => {
      const template = getBashStyleTemplate(firstCondition);
      const values = firstConditionNull;

      const expected: BashStyleInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifFalse;

      const actual = transformBashStyleConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withUndefinedCondition', () => {
      const template = getBashStyleTemplate(firstCondition);
      const values = firstConditionUndefined;

      const expected: BashStyleInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifFalse;

      const actual = transformBashStyleConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withTruthyStringCondition', () => {
      const template = getBashStyleTemplate(firstCondition);
      const values = firstConditionTruthyString;

      const expected: BashStyleInterpolateConditions<
        typeof template,
        typeof values
      > = firstCondition.ifTrue;

      const actual = transformBashStyleConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withoutPrefix', () => {
      const template =
        `${firstCondition.name}${bashStyle.quot}${firstCondition.ifTrue}${bashStyle.quot}${bashStyle.delim}${bashStyle.quot}${firstCondition.ifFalse}${bashStyle.quot}${bashStyle.postfix}` as const;

      const values = firstConditionTrue;

      const expected: BashStyleInterpolateConditions<
        typeof template,
        typeof values
      > = template;

      const actual = transformBashStyleConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withoutPostfix', () => {
      const template =
        `${bashStyle.prefix}${firstCondition.name}${bashStyle.quot}${firstCondition.ifTrue}${bashStyle.quot}${bashStyle.delim}${bashStyle.quot}${firstCondition.ifFalse}${bashStyle.quot}` as const;

      const values = firstConditionTrue;

      const expected: BashStyleInterpolateConditions<
        typeof template,
        typeof values
      > = template;

      const actual = transformBashStyleConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withoutDelim', () => {
      const template =
        `${bashStyle.prefix}${firstCondition.name}${bashStyle.quot}${firstCondition.ifTrue}${bashStyle.quot}${bashStyle.quot}${firstCondition.ifFalse}${bashStyle.quot}${bashStyle.postfix}` as const;

      const values = firstConditionTrue;

      const expected: BashStyleInterpolateConditions<
        typeof template,
        typeof values
      > = template;

      const actual = transformBashStyleConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withSpacesWithWrongNegation', () => {
      const template =
        `${bashStyle.prefix}${negation}      ${firstCondition.name}           ${bashStyle.quot}${firstCondition.ifTrue}${bashStyle.quot}     ${bashStyle.delim}     ${bashStyle.quot}${firstCondition.ifFalse}${bashStyle.quot}     ${bashStyle.postfix}` as const;

      const values = firstConditionTrue;

      const expected: BashStyleInterpolateConditions<
        typeof template,
        typeof values
      > = template;

      const actual = transformBashStyleConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withoutValues', () => {
      const template = getBashStyleTemplate(firstCondition);

      const values = {} as const;

      const expected: BashStyleInterpolateConditions<
        typeof template,
        typeof values
      > = template;

      const actual = transformBashStyleConditions(template, values);

      assert.equal(expected, actual);
    });

    it('withExtraChars', () => {
      const template =
        `${bashStyle.prefix}    ${firstCondition.name}    ${bashStyle.quot}${firstCondition.ifTrue}${bashStyle.quot}${bashStyle.delim}wrong${bashStyle.quot}${firstCondition.ifFalse}${bashStyle.quot}${bashStyle.postfix}` as const;

      const values = firstConditionTrue;

      const expected: BashStyleInterpolateConditions<
        typeof template,
        typeof values
      > = template;

      const actual = transformBashStyleConditions(template, values);

      assert.equal(expected, actual);
    });

    it('twoConditions', () => {
      const template =
        `${getBashStyleTemplate(firstCondition)} ${getBashStyleTemplate(secondCondition)}` as const;

      const values = twoConditionsTrue;

      const expected: BashStyleInterpolateConditions<
        typeof template,
        typeof values
      > = `${firstCondition.ifTrue} ${secondCondition.ifTrue}`;

      const actual = transformBashStyleConditions(template, values);

      assert.equal(expected, actual);
    });
  });
});
