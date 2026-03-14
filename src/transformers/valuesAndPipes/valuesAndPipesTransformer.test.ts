import assert from 'node:assert';
import { describe, it } from 'node:test';
import type {
  DoubleMustache,
  FirstValue,
  SecondValue,
  SomeText,
  TemplateString,
} from './interpolatedValuesAndPipes.test.ts';
import type {
  InterpolateValuesAndPipes,
  Pipe,
} from './interpolatedValuesAndPipes.ts';
import { typedValuesAndPipesTransformer } from './valuesAndPipesTransformer.ts';

const firstValue: FirstValue = {
  name: 'first',
  value: 'first value',
};

const secondValue: SecondValue = {
  name: 'second',
  value: 'second value',
};

const someText: SomeText = 'Some text';

const doubleMustache: DoubleMustache = {
  prefix: '{{',
  postfix: '}}',
  pipesDelim: '|',
};

const templateString: TemplateString = {
  prefix: '${',
  postfix: '}',
  pipesDelim: '|>',
};

const firstPipe = {
  name: 'firstPipe',
  transform: ((value) => String(value).toUpperCase()) as Pipe,
} as const;

const secondPipe = {
  name: 'secondPipe',
  transform: ((value) => `[${String(value)}]`) as Pipe,
} as const;

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
const noValues = {} as const;

const firstPipeMap = { [firstPipe.name]: firstPipe.transform } as const;
const allPipesMap = {
  [firstPipe.name]: firstPipe.transform,
  [secondPipe.name]: secondPipe.transform,
} as const;
const noPipes = {} as const;

const applyPipe = (pipe: Pipe, value: string) => String(pipe(value));

type DoubleMustacheInterpolateValuesAndPipes<
  Template extends string,
  Values extends Record<string, any>,
  PipeNames extends string,
> = InterpolateValuesAndPipes<
  Template,
  typeof doubleMustache.prefix,
  typeof doubleMustache.postfix,
  typeof doubleMustache.pipesDelim,
  Values,
  PipeNames
>;

type TemplateStringInterpolateValuesAndPipes<
  Template extends string,
  Values extends Record<string, any>,
  PipeNames extends string,
> = InterpolateValuesAndPipes<
  Template,
  typeof templateString.prefix,
  typeof templateString.postfix,
  typeof templateString.pipesDelim,
  Values,
  PipeNames
>;

const transformDoubleMustacheValuesAndPipes = <
  Template extends string,
  Values extends Record<string, any>,
  Pipes extends Record<string, Pipe>,
>(
  template: Template,
  values: Values,
  pipes: Pipes,
) =>
  typedValuesAndPipesTransformer(
    template,
    values,
    pipes,
    doubleMustache.prefix,
    doubleMustache.postfix,
    doubleMustache.pipesDelim,
  );

const transformTemplateStringValuesAndPipes = <
  Template extends string,
  Values extends Record<string, any>,
  Pipes extends Record<string, Pipe>,
>(
  template: Template,
  values: Values,
  pipes: Pipes,
) =>
  typedValuesAndPipesTransformer(
    template,
    values,
    pipes,
    templateString.prefix,
    templateString.postfix,
    templateString.pipesDelim,
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

const getDoubleMustachePipedTemplate = <
  Name extends string,
  PipeName extends string,
>({
  name,
  pipeName,
}: {
  name: Name;
  pipeName: PipeName;
}) =>
  `${doubleMustache.prefix}${name}${doubleMustache.pipesDelim}${pipeName}${doubleMustache.postfix}` as const;

const getDoubleMustacheTwoPipesTemplate = <
  Name extends string,
  FirstPipeName extends string,
  SecondPipeName extends string,
>({
  name,
  firstPipeName,
  secondPipeName,
}: {
  name: Name;
  firstPipeName: FirstPipeName;
  secondPipeName: SecondPipeName;
}) =>
  `${doubleMustache.prefix}${name}${doubleMustache.pipesDelim}${firstPipeName}${doubleMustache.pipesDelim}${secondPipeName}${doubleMustache.postfix}` as const;

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

const getTemplateStringPipedTemplate = <
  Name extends string,
  PipeName extends string,
>({
  name,
  pipeName,
}: {
  name: Name;
  pipeName: PipeName;
}) =>
  `${templateString.prefix}${name}${templateString.pipesDelim}${pipeName}${templateString.postfix}` as const;

const getTemplateStringTwoPipesTemplate = <
  Name extends string,
  FirstPipeName extends string,
  SecondPipeName extends string,
>({
  name,
  firstPipeName,
  secondPipeName,
}: {
  name: Name;
  firstPipeName: FirstPipeName;
  secondPipeName: SecondPipeName;
}) =>
  `${templateString.prefix}${name}${templateString.pipesDelim}${firstPipeName}${templateString.pipesDelim}${secondPipeName}${templateString.postfix}` as const;

describe('valuesAndPipesTransformer', () => {
  describe('Double Mustache', () => {
    it('valueWithoutSpaces', () => {
      const template = getDoubleMustacheTemplate(firstValue);
      const values = firstValueParams;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = firstValue.value;

      const actual = transformDoubleMustacheValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('withoutProvidedValue', () => {
      const template = getDoubleMustacheTemplate(firstValue);
      const values = noValues;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = template;

      const actual = transformDoubleMustacheValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('withSpacesWithoutProvidedValue', () => {
      const template = getDoubleMustacheSpacedTemplate(firstValue);
      const values = noValues;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = template;

      const actual = transformDoubleMustacheValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('valueWithSpaces', () => {
      const template = getDoubleMustacheSpacedTemplate(firstValue);
      const values = firstValueParams;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = firstValue.value;

      const actual = transformDoubleMustacheValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('twoValuesValuesInRow', () => {
      const template =
        `${getDoubleMustacheTemplate(firstValue)}${getDoubleMustacheTemplate(secondValue)}` as const;
      const values = firstAndSecondValues;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = `${firstValue.value}${secondValue.value}`;

      const actual = transformDoubleMustacheValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('valuesWithDivider', () => {
      const template =
        `${getDoubleMustacheTemplate(firstValue)} ${someText} ${getDoubleMustacheTemplate(secondValue)}` as const;
      const values = firstAndSecondValues;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = `${firstValue.value} ${someText} ${secondValue.value}`;

      const actual = transformDoubleMustacheValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('numberValueWithPipe', () => {
      const template = getDoubleMustachePipedTemplate({
        name: countValue.name,
        pipeName: secondPipe.name,
      });
      const values = countValueParams;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        typeof secondPipe.name
      > = applyPipe(secondPipe.transform, '42');

      const actual = transformDoubleMustacheValuesAndPipes(template, values, {
        [secondPipe.name]: secondPipe.transform,
      });

      assert.equal(expected, actual);
    });

    it('oneValueTwoTimeInRow', () => {
      const template =
        `${getDoubleMustacheTemplate(firstValue)} ${getDoubleMustacheTemplate(firstValue)}` as const;
      const values = firstValueParams;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = `${firstValue.value} ${firstValue.value}`;

      const actual = transformDoubleMustacheValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('onePipeNoSpaces', () => {
      const template = getDoubleMustachePipedTemplate({
        name: firstValue.name,
        pipeName: firstPipe.name,
      });
      const values = firstValueParams;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        typeof firstPipe.name
      > = applyPipe(firstPipe.transform, firstValue.value);

      const actual = transformDoubleMustacheValuesAndPipes(
        template,
        values,
        firstPipeMap,
      );

      assert.equal(expected, actual);
    });

    it('onePipeWithSpaces', () => {
      const template =
        `${doubleMustache.prefix}         ${firstValue.name}   ${doubleMustache.pipesDelim}   ${firstPipe.name}        ${doubleMustache.postfix}` as const;
      const values = firstValueParams;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        typeof firstPipe.name
      > = applyPipe(firstPipe.transform, firstValue.value);

      const actual = transformDoubleMustacheValuesAndPipes(
        template,
        values,
        firstPipeMap,
      );

      assert.equal(expected, actual);
    });

    it('multiplePipes', () => {
      const template = getDoubleMustacheTwoPipesTemplate({
        name: firstValue.name,
        firstPipeName: firstPipe.name,
        secondPipeName: secondPipe.name,
      });
      const values = firstValueParams;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        typeof firstPipe.name | typeof secondPipe.name
      > = applyPipe(
        secondPipe.transform,
        applyPipe(firstPipe.transform, firstValue.value),
      );

      const actual = transformDoubleMustacheValuesAndPipes(
        template,
        values,
        allPipesMap,
      );

      assert.equal(expected, actual);
    });

    it('multiplePipesWithUnknownPipe', () => {
      const template = getDoubleMustacheTwoPipesTemplate({
        name: firstValue.name,
        firstPipeName: firstPipe.name,
        secondPipeName: secondPipe.name,
      });
      const values = firstValueParams;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        typeof firstPipe.name
      > = template;

      const actual = transformDoubleMustacheValuesAndPipes(
        template,
        values,
        firstPipeMap,
      );

      assert.equal(expected, actual);
    });

    it('multiplePipesWithoutValue', () => {
      const template = getDoubleMustacheTwoPipesTemplate({
        name: firstValue.name,
        firstPipeName: firstPipe.name,
        secondPipeName: secondPipe.name,
      });
      const values = noValues;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        typeof firstPipe.name | typeof secondPipe.name
      > = template;

      const actual = transformDoubleMustacheValuesAndPipes(
        template,
        values,
        allPipesMap,
      );

      assert.equal(expected, actual);
    });

    it('mixedValueAndValueWithPipe', () => {
      const template =
        `${getDoubleMustacheTemplate(firstValue)} ${someText} ${getDoubleMustachePipedTemplate(
          {
            name: secondValue.name,
            pipeName: firstPipe.name,
          },
        )}` as const;
      const values = firstAndSecondValues;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        typeof firstPipe.name
      > =
        `${firstValue.value} ${someText} ${applyPipe(firstPipe.transform, secondValue.value)}`;

      const actual = transformDoubleMustacheValuesAndPipes(
        template,
        values,
        firstPipeMap,
      );

      assert.equal(expected, actual);
    });

    it('differentPipesForSameValue', () => {
      const template = `${getDoubleMustachePipedTemplate({
        name: firstValue.name,
        pipeName: firstPipe.name,
      })} ${getDoubleMustachePipedTemplate({
        name: firstValue.name,
        pipeName: secondPipe.name,
      })}` as const;
      const values = firstValueParams;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        typeof firstPipe.name | typeof secondPipe.name
      > =
        `${applyPipe(firstPipe.transform, firstValue.value)} ${applyPipe(secondPipe.transform, firstValue.value)}`;

      const actual = transformDoubleMustacheValuesAndPipes(
        template,
        values,
        allPipesMap,
      );

      assert.equal(expected, actual);
    });

    it('emptyString', () => {
      const template = 'Empty string' as const;
      const values = noValues;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = template;

      const actual = transformDoubleMustacheValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('missingPostfixWithoutPipe', () => {
      const template = `${doubleMustache.prefix}${firstValue.name}` as const;
      const values = firstValueParams;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = template;

      const actual = transformDoubleMustacheValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('missingPostfixWithPipe', () => {
      const template =
        `${doubleMustache.prefix}${firstValue.name}${doubleMustache.pipesDelim}${firstPipe.name}` as const;
      const values = firstValueParams;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        typeof firstPipe.name
      > = template;

      const actual = transformDoubleMustacheValuesAndPipes(
        template,
        values,
        firstPipeMap,
      );

      assert.equal(expected, actual);
    });

    it('emptyExpression', () => {
      const template =
        `${doubleMustache.prefix} ${doubleMustache.postfix}` as const;
      const values = noValues;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = template;

      const actual = transformDoubleMustacheValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('invalidValueName', () => {
      const template =
        `${doubleMustache.prefix}invalid name with spaces${doubleMustache.postfix}` as const;
      const values = noValues;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = template;

      const actual = transformDoubleMustacheValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('invalidPipeName', () => {
      const template =
        `${doubleMustache.prefix}${firstValue.name}${doubleMustache.pipesDelim}${someText}${doubleMustache.postfix}` as const;
      const values = firstValueParams;

      const expected: DoubleMustacheInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        SomeText
      > = template;

      const actual = transformDoubleMustacheValuesAndPipes(
        template,
        values,
        firstPipeMap,
      );

      assert.equal(expected, actual);
    });
  });

  describe('Template String', () => {
    it('valueWithoutSpaces', () => {
      const template = getTemplateStringTemplate(firstValue);
      const values = firstValueParams;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = firstValue.value;

      const actual = transformTemplateStringValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('withoutProvidedValue', () => {
      const template = getTemplateStringTemplate(firstValue);
      const values = noValues;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = template;

      const actual = transformTemplateStringValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('withSpacesWithoutProvidedValue', () => {
      const template = getTemplateStringSpacedTemplate(firstValue);
      const values = noValues;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = template;

      const actual = transformTemplateStringValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('valueWithSpaces', () => {
      const template = getTemplateStringSpacedTemplate(firstValue);
      const values = firstValueParams;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = firstValue.value;

      const actual = transformTemplateStringValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('twoValuesValuesInRow', () => {
      const template =
        `${getTemplateStringTemplate(firstValue)}${getTemplateStringTemplate(secondValue)}` as const;
      const values = firstAndSecondValues;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = `${firstValue.value}${secondValue.value}`;

      const actual = transformTemplateStringValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('valuesWithDivider', () => {
      const template =
        `${getTemplateStringTemplate(firstValue)} ${someText} ${getTemplateStringTemplate(secondValue)}` as const;
      const values = firstAndSecondValues;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = `${firstValue.value} ${someText} ${secondValue.value}`;

      const actual = transformTemplateStringValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('numberValueWithPipe', () => {
      const template = getTemplateStringPipedTemplate({
        name: countValue.name,
        pipeName: secondPipe.name,
      });
      const values = countValueParams;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        typeof secondPipe.name
      > = applyPipe(secondPipe.transform, '42');

      const actual = transformTemplateStringValuesAndPipes(template, values, {
        [secondPipe.name]: secondPipe.transform,
      });

      assert.equal(expected, actual);
    });

    it('oneValueTwoTimeInRow', () => {
      const template =
        `${getTemplateStringTemplate(firstValue)} ${getTemplateStringTemplate(firstValue)}` as const;
      const values = firstValueParams;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = `${firstValue.value} ${firstValue.value}`;

      const actual = transformTemplateStringValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('onePipeNoSpaces', () => {
      const template = getTemplateStringPipedTemplate({
        name: firstValue.name,
        pipeName: firstPipe.name,
      });
      const values = firstValueParams;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        typeof firstPipe.name
      > = applyPipe(firstPipe.transform, firstValue.value);

      const actual = transformTemplateStringValuesAndPipes(
        template,
        values,
        firstPipeMap,
      );

      assert.equal(expected, actual);
    });

    it('onePipeWithSpaces', () => {
      const template =
        `${templateString.prefix}         ${firstValue.name}   ${templateString.pipesDelim}   ${firstPipe.name}        ${templateString.postfix}` as const;
      const values = firstValueParams;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        typeof firstPipe.name
      > = applyPipe(firstPipe.transform, firstValue.value);

      const actual = transformTemplateStringValuesAndPipes(
        template,
        values,
        firstPipeMap,
      );

      assert.equal(expected, actual);
    });

    it('multiplePipes', () => {
      const template = getTemplateStringTwoPipesTemplate({
        name: firstValue.name,
        firstPipeName: firstPipe.name,
        secondPipeName: secondPipe.name,
      });
      const values = firstValueParams;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        typeof firstPipe.name | typeof secondPipe.name
      > = applyPipe(
        secondPipe.transform,
        applyPipe(firstPipe.transform, firstValue.value),
      );

      const actual = transformTemplateStringValuesAndPipes(
        template,
        values,
        allPipesMap,
      );

      assert.equal(expected, actual);
    });

    it('multiplePipesWithUnknownPipe', () => {
      const template = getTemplateStringTwoPipesTemplate({
        name: firstValue.name,
        firstPipeName: firstPipe.name,
        secondPipeName: secondPipe.name,
      });
      const values = firstValueParams;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        typeof firstPipe.name
      > = template;

      const actual = transformTemplateStringValuesAndPipes(
        template,
        values,
        firstPipeMap,
      );

      assert.equal(expected, actual);
    });

    it('multiplePipesWithoutValue', () => {
      const template = getTemplateStringTwoPipesTemplate({
        name: firstValue.name,
        firstPipeName: firstPipe.name,
        secondPipeName: secondPipe.name,
      });
      const values = noValues;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        typeof firstPipe.name | typeof secondPipe.name
      > = template;

      const actual = transformTemplateStringValuesAndPipes(
        template,
        values,
        allPipesMap,
      );

      assert.equal(expected, actual);
    });

    it('mixedValueAndValueWithPipe', () => {
      const template =
        `${getTemplateStringTemplate(firstValue)} ${someText} ${getTemplateStringPipedTemplate(
          {
            name: secondValue.name,
            pipeName: firstPipe.name,
          },
        )}` as const;
      const values = firstAndSecondValues;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        typeof firstPipe.name
      > =
        `${firstValue.value} ${someText} ${applyPipe(firstPipe.transform, secondValue.value)}`;

      const actual = transformTemplateStringValuesAndPipes(
        template,
        values,
        firstPipeMap,
      );

      assert.equal(expected, actual);
    });

    it('differentPipesForSameValue', () => {
      const template = `${getTemplateStringPipedTemplate({
        name: firstValue.name,
        pipeName: firstPipe.name,
      })} ${getTemplateStringPipedTemplate({
        name: firstValue.name,
        pipeName: secondPipe.name,
      })}` as const;
      const values = firstValueParams;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        typeof firstPipe.name | typeof secondPipe.name
      > =
        `${applyPipe(firstPipe.transform, firstValue.value)} ${applyPipe(secondPipe.transform, firstValue.value)}`;

      const actual = transformTemplateStringValuesAndPipes(
        template,
        values,
        allPipesMap,
      );

      assert.equal(expected, actual);
    });

    it('emptyString', () => {
      const template = 'Empty string' as const;
      const values = noValues;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = template;

      const actual = transformTemplateStringValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('missingPostfixWithoutPipe', () => {
      const template = `${templateString.prefix}${firstValue.name}` as const;
      const values = firstValueParams;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = template;

      const actual = transformTemplateStringValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('missingPostfixWithPipe', () => {
      const template =
        `${templateString.prefix}${firstValue.name}${templateString.pipesDelim}${firstPipe.name}` as const;
      const values = firstValueParams;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        typeof firstPipe.name
      > = template;

      const actual = transformTemplateStringValuesAndPipes(
        template,
        values,
        firstPipeMap,
      );

      assert.equal(expected, actual);
    });

    it('emptyExpression', () => {
      const template =
        `${templateString.prefix} ${templateString.postfix}` as const;
      const values = noValues;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = template;

      const actual = transformTemplateStringValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('invalidValueName', () => {
      const template =
        `${templateString.prefix}invalid name with spaces${templateString.postfix}` as const;
      const values = noValues;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        never
      > = template;

      const actual = transformTemplateStringValuesAndPipes(
        template,
        values,
        noPipes,
      );

      assert.equal(expected, actual);
    });

    it('invalidPipeName', () => {
      const template =
        `${templateString.prefix}${firstValue.name}${templateString.pipesDelim}${someText}${templateString.postfix}` as const;
      const values = firstValueParams;

      const expected: TemplateStringInterpolateValuesAndPipes<
        typeof template,
        typeof values,
        SomeText
      > = template;

      const actual = transformTemplateStringValuesAndPipes(
        template,
        values,
        firstPipeMap,
      );

      assert.equal(expected, actual);
    });
  });
});
