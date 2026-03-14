import type { Equal, TrueCases } from 'type-testing';
import type {
  InterpolatedPipesNames,
  InterpolatedValuesNames,
  InterpolateValuesAndPipes,
  Value,
} from './interpolatedValuesAndPipes.ts';

export type FirstValue = { name: 'first'; value: 'first value' };
export type SecondValue = { name: 'second'; value: 'second value' };

export type DoubleMustache = {
  prefix: '{{';
  postfix: '}}';
  pipesDelim: '|';
};
export type TemplateString = {
  prefix: '${';
  postfix: '}';
  pipesDelim: '|>';
};

export type StringWithoutTemplate = 'Empty string';

export type FirstPipeName = 'firstPipe';
export type SecondPipeName = 'secondPipe';

export type SomeText = 'Some text';

type AnyInterpolatedValesAndPipesCases = Record<
  string,
  { template: string; valueNames: string; pipeNames: string }
>;

type InterpolatedValuesAndPipesNamesCases<
  Prefix extends string,
  Postfix extends string,
  PipesDelim extends string,
> = {
  simpleValue: {
    template: `${Prefix}${FirstValue['name']}${Postfix}`;
    valueNames: FirstValue['name'];
    pipeNames: never;
  };
  valueWithSpaces: {
    template: `${Prefix}   ${FirstValue['name']}   ${Postfix}`;
    valueNames: FirstValue['name'];
    pipeNames: never;
  };
  twoValues: {
    template: `${Prefix}${FirstValue['name']}${Postfix}${Prefix}${SecondValue['name']}${Postfix}`;
    valueNames: FirstValue['name'] | SecondValue['name'];
    pipeNames: never;

    result: `${FirstValue['value']}${SecondValue['value']}`;
  };
  valuesWithAnd: {
    template: `${Prefix}${FirstValue['name']}${Postfix} and ${Prefix}${SecondValue['name']}${Postfix}`;
    valueNames: FirstValue['name'] | SecondValue['name'];
    pipeNames: never;

    result: `${FirstValue['value']} and ${SecondValue['value']}`;
  };
  duplicateValues: {
    template: `${Prefix}${FirstValue['name']}${Postfix} ${Prefix}${FirstValue['name']}${Postfix}`;
    valueNames: FirstValue['name'];
    pipeNames: never;
  };
  onePipeNoSpaces: {
    template: `${Prefix}${FirstValue['name']}${PipesDelim}${FirstPipeName}${Postfix}`;
    valueNames: FirstValue['name'];
    pipeNames: FirstPipeName;
  };
  onePipeWithSpaces: {
    template: `${Prefix}         ${FirstValue['name']}   ${PipesDelim}   ${FirstPipeName}        ${Postfix}`;
    valueNames: FirstValue['name'];
    pipeNames: FirstPipeName;
  };
  multiplePipes: {
    template: `${Prefix}${FirstValue['name']}${PipesDelim}${FirstPipeName}${PipesDelim}${SecondPipeName}${Postfix}`;
    valueNames: FirstValue['name'];
    pipeNames: FirstPipeName | SecondPipeName;
  };
  mixedValueAndValueWithPipe: {
    template: `${Prefix}${FirstValue['name']}${Postfix} ${SomeText} ${Prefix}${SecondValue['name']}${PipesDelim}${FirstPipeName}${Postfix}`;
    valueNames: FirstValue['name'] | SecondValue['name'];
    pipeNames: FirstPipeName;
  };
  differentPipesForSameValue: {
    template: `${Prefix}${FirstValue['name']}${PipesDelim}${FirstPipeName}${Postfix} ${Prefix}${FirstValue['name']}${PipesDelim}${SecondPipeName}${Postfix}`;
    valueNames: FirstValue['name'];
    pipeNames: FirstPipeName | SecondPipeName;
  };
  emptyString: {
    template: StringWithoutTemplate;
    valueNames: never;
    pipeNames: never;
  };
  missingPostfixWithoutPipe: {
    template: `${Prefix}${FirstValue['name']}`;
    valueNames: never;
    pipeNames: never;
  };
  missingPostfixWithPipe: {
    template: `${Prefix}${FirstValue['name']}${PipesDelim}${FirstPipeName}`;
    valueNames: never;
    pipeNames: never;
  };
  emptyExpression: {
    template: `${Prefix} ${Postfix}`;
    valueNames: never;
    pipeNames: never;
  };
  invalidValueName: {
    template: `${Prefix}invalid name with spaces${Postfix}`;
    valueNames: never;
    pipeNames: never;
  };
  invalidPipeName: {
    template: `${Prefix}${FirstValue['name']}${PipesDelim}invalid pipe with spaces${Postfix}`;
    valueNames: never;
    pipeNames: never;
  };
};

type InterpolatedValuesNamesCheck<
  Prefix extends string,
  Postfix extends string,
  PipesDelim extends string,
  Cases extends AnyInterpolatedValesAndPipesCases =
    InterpolatedValuesAndPipesNamesCases<Prefix, Postfix, PipesDelim>,
  CaseName = keyof Cases,
> = CaseName extends keyof Cases
  ? Equal<
      InterpolatedValuesNames<
        Cases[CaseName]['template'],
        Prefix,
        Postfix,
        PipesDelim
      >,
      Cases[CaseName]['valueNames']
    >
  : never;

type InterpolatedPipesNamesCheck<
  Prefix extends string,
  Postfix extends string,
  PipesDelim extends string,
  Cases extends AnyInterpolatedValesAndPipesCases =
    InterpolatedValuesAndPipesNamesCases<Prefix, Postfix, PipesDelim>,
  CaseName = keyof Cases,
> = CaseName extends keyof Cases
  ? Equal<
      InterpolatedPipesNames<
        Cases[CaseName]['template'],
        Prefix,
        Postfix,
        PipesDelim
      >,
      Cases[CaseName]['pipeNames']
    >
  : never;

type InterpolatedValesAndPipesTests = TrueCases<
  [
    InterpolatedValuesNamesCheck<
      DoubleMustache['prefix'],
      DoubleMustache['postfix'],
      DoubleMustache['pipesDelim']
    >,
    InterpolatedValuesNamesCheck<
      TemplateString['prefix'],
      TemplateString['postfix'],
      TemplateString['pipesDelim']
    >,

    InterpolatedPipesNamesCheck<
      DoubleMustache['prefix'],
      DoubleMustache['postfix'],
      DoubleMustache['pipesDelim']
    >,
    InterpolatedPipesNamesCheck<
      TemplateString['prefix'],
      TemplateString['postfix'],
      TemplateString['pipesDelim']
    >,
  ]
>;

export type AnyValuesAndPipesInterpolationCase = Record<
  string,
  {
    template: string;
    values: Record<string, Value>;
    pipeNames: string;
    result: string;
  }
>;

export type ValuesAndPipesInterpolationCases<
  Prefix extends string,
  Postfix extends string,
  PipesDelim extends string,
  FirstValueTemplate extends string =
    `${Prefix}${FirstValue['name']}${Postfix}`,
  SecondValueTemplate extends string =
    `${Prefix}${SecondValue['name']}${Postfix}`,
  FirstValueWithFirstPipeTemplate extends string =
    `${Prefix}${FirstValue['name']}${PipesDelim}${FirstPipeName}${Postfix}`,
  FirstValueWithSecondPipeTemplate extends string =
    `${Prefix}${FirstValue['name']}${PipesDelim}${SecondPipeName}${Postfix}`,
  FirstValueWithTwoPipesTemplate extends string =
    `${Prefix}${FirstValue['name']}${PipesDelim}${FirstPipeName}${PipesDelim}${SecondPipeName}${Postfix}`,
  ValueWithSpacesTemplate extends string =
    `${Prefix}   ${FirstValue['name']}   ${Postfix}`,
  NoPrefixTemplate extends string = `${Prefix}${FirstValue['name']}`,
  NoNameTemplate extends string = `${Prefix} ${Postfix}`,
> = {
  valueWithoutSpaces: {
    template: FirstValueTemplate;
    pipeNames: never;
    values: Record<FirstValue['name'], FirstValue['value']>;
    result: FirstValue['value'];
  };
  withoutProvidedValue: {
    template: FirstValueTemplate;
    pipeNames: never;
    values: {};
    result: FirstValueTemplate;
  };
  withSpacesWithoutProvidedValue: {
    template: ValueWithSpacesTemplate;
    pipeNames: never;
    values: {};
    result: ValueWithSpacesTemplate;
  };
  valueWithSpaces: {
    template: ValueWithSpacesTemplate;
    pipeNames: never;
    values: Record<FirstValue['name'], FirstValue['value']>;
    result: FirstValue['value'];
  };
  twoValuesValuesInRow: {
    template: `${FirstValueTemplate}${SecondValueTemplate}`;
    pipeNames: never;
    values: Record<FirstValue['name'], FirstValue['value']> &
      Record<SecondValue['name'], SecondValue['value']>;
    result: `${FirstValue['value']}${SecondValue['value']}`;
  };
  valuesWithDivider: {
    template: `${FirstValueTemplate} ${SomeText} ${SecondValueTemplate}`;
    pipeNames: never;
    values: Record<FirstValue['name'], FirstValue['value']> &
      Record<SecondValue['name'], SecondValue['value']>;
    result: `${FirstValue['value']} ${SomeText} ${SecondValue['value']}`;
  };
  oneValueTwoTimeInRow: {
    template: `${FirstValueTemplate} ${FirstValueTemplate}`;
    pipeNames: never;
    values: Record<FirstValue['name'], FirstValue['value']>;
    result: `${FirstValue['value']} ${FirstValue['value']}`;
  };
  onePipeNoSpaces: {
    template: `${FirstValueWithFirstPipeTemplate}`;
    pipeNames: FirstPipeName;
    values: Record<FirstValue['name'], FirstValue['value']>;
    result: `${string}`;
  };
  onePipeWithSpaces: {
    template: `${Prefix}         ${FirstValue['name']}   ${PipesDelim}   ${FirstPipeName}        ${Postfix}`;
    pipeNames: FirstPipeName;
    values: Record<FirstValue['name'], FirstValue['value']>;
    result: `${string}`;
  };
  multiplePipes: {
    template: `${FirstValueWithTwoPipesTemplate}`;
    pipeNames: FirstPipeName | SecondPipeName;
    values: Record<FirstValue['name'], FirstValue['value']>;
    result: `${string}`;
  };
  multiplePipesWithUnknownPipe: {
    template: `${FirstValueWithTwoPipesTemplate}`;
    pipeNames: FirstPipeName;
    values: Record<FirstValue['name'], FirstValue['value']>;
    result: `${FirstValueWithTwoPipesTemplate}`;
  };
  multiplePipesWithoutValue: {
    template: `${FirstValueWithTwoPipesTemplate}`;
    pipeNames: FirstPipeName | SecondPipeName;
    values: {};
    result: `${FirstValueWithTwoPipesTemplate}`;
  };
  mixedValueAndValueWithPipe: {
    template: `${FirstValueTemplate} ${SomeText} ${Prefix}${SecondValue['name']}${PipesDelim}${FirstPipeName}${Postfix}`;
    pipeNames: FirstPipeName;
    values: Record<FirstValue['name'], FirstValue['value']> &
      Record<SecondValue['name'], SecondValue['value']>;
    result: `${FirstValue['value']} ${SomeText} ${string}`;
  };
  differentPipesForSameValue: {
    template: `${FirstValueWithFirstPipeTemplate} ${FirstValueWithSecondPipeTemplate}`;
    pipeNames: FirstPipeName | SecondPipeName;
    values: Record<FirstValue['name'], FirstValue['value']>;
    result: `${string} ${string}`;
  };
  emptyString: {
    template: StringWithoutTemplate;
    pipeNames: never;
    values: {};
    result: StringWithoutTemplate;
  };
  noPrefix: {
    template: `${NoPrefixTemplate}`;
    pipeNames: never;
    values: Record<FirstValue['name'], FirstValue['value']>;
    result: `${NoPrefixTemplate}`;
  };
  emptyExpression: {
    template: `${NoNameTemplate}`;
    pipeNames: never;
    values: {};
    result: `${NoNameTemplate}`;
  };
  invalidValueName: {
    template: `${Prefix}invalid name with spaces${Postfix}`;
    pipeNames: never;
    values: {};
    result: `${Prefix}invalid name with spaces${Postfix}`;
  };
  invalidPipeName: {
    template: `${Prefix}${FirstValue['name']}${PipesDelim}${SomeText}${Postfix}`;
    pipeNames: SomeText;
    values: Record<FirstValue['name'], FirstValue['value']>;
    result: `${Prefix}${FirstValue['name']}${PipesDelim}${SomeText}${Postfix}`;
  };
};

type ValuesAndPipesInterpolationCheck<
  Prefix extends string,
  Postfix extends string,
  PipesDelim extends string,
  Cases extends AnyValuesAndPipesInterpolationCase =
    ValuesAndPipesInterpolationCases<Prefix, Postfix, PipesDelim>,
  CaseName = keyof Cases,
> = CaseName extends keyof Cases
  ? [Cases[CaseName]['values']] extends [Record<string, any>]
    ? Equal<
        InterpolateValuesAndPipes<
          Cases[CaseName]['template'],
          Prefix,
          Postfix,
          PipesDelim,
          Cases[CaseName]['values'],
          Cases[CaseName]['pipeNames']
        >,
        Cases[CaseName]['result']
      >
    : true
  : never;

type ValuesAndPipesInterpolationTests = TrueCases<
  [
    ValuesAndPipesInterpolationCheck<
      DoubleMustache['prefix'],
      DoubleMustache['postfix'],
      DoubleMustache['pipesDelim']
    >,
    ValuesAndPipesInterpolationCheck<
      TemplateString['prefix'],
      TemplateString['postfix'],
      TemplateString['pipesDelim']
    >,
  ]
>;
