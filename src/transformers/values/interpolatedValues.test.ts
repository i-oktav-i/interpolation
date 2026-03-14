import type { Equal, TrueCases } from 'type-testing';
import type {
  InterpolatedValuesNames,
  InterpolateValues,
} from './interpolatedValues.ts';

export type FirstValue = { name: 'first'; value: 'first value' };

export type SecondValue = { name: 'second'; value: 'second value' };

type UnionValue = { name: 'union'; value: 123 | 'qwe' };

export type DoubleMustache = {
  prefix: '{{';
  postfix: '}}';
};

export type TemplateString = {
  prefix: '${';
  postfix: '}';
};

type StringWithoutTemplate = 'Empty string';

type InterpolatedValuesNamesCheck<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Result extends string,
> = Equal<InterpolatedValuesNames<ResourceString, Prefix, Postfix>, Result>;

type AnyInterpolatedValuesNamesCases = Record<
  string,
  { template: string; result: string }
>;

type InterpolatedValuesNamesCases<
  Prefix extends string,
  Postfix extends string,
> = {
  withoutSpaces: {
    template: `${Prefix}${FirstValue['name']}${Postfix}`;
    result: FirstValue['name'];
  };
  withSpaces: {
    template: `${Prefix}   ${FirstValue['name']}   ${Postfix}`;
    result: FirstValue['name'];
  };
  twoInRow: {
    template: `${Prefix}${FirstValue['name']}${Postfix}${Prefix}${SecondValue['name']}${Postfix}`;
    result: FirstValue['name'] | SecondValue['name'];
  };
  withAnd: {
    template: `${Prefix}${FirstValue['name']}${Postfix} and ${Prefix}${SecondValue['name']}${Postfix}`;
    result: FirstValue['name'] | SecondValue['name'];
  };
  sameInRow: {
    template: `${Prefix}${FirstValue['name']}${Postfix} ${Prefix}${FirstValue['name']}${Postfix}`;
    result: FirstValue['name'];
  };
  emptyString: {
    template: `Empty string`;
    result: never;
  };
  noPostfix: {
    template: `${Prefix}${FirstValue['name']}`;
    result: never;
  };
  noName: {
    template: `${Prefix} ${Postfix}`;
    result: never;
  };
  invalidNameWithSpaces: {
    template: `${Prefix}invalid name with spaces${Postfix}`;
    result: never;
  };
};

type InterpolatedValuesNamesChecks<
  Prefix extends string,
  Postfix extends string,
  Cases extends AnyInterpolatedValuesNamesCases = InterpolatedValuesNamesCases<
    Prefix,
    Postfix
  >,
  CaseName = keyof Cases,
> = CaseName extends keyof Cases
  ? InterpolatedValuesNamesCheck<
      Cases[CaseName]['template'],
      Prefix,
      Postfix,
      Cases[CaseName]['result']
    >
  : never;

type InterpolatedValuesNamesTests = TrueCases<
  [
    InterpolatedValuesNamesChecks<
      DoubleMustache['prefix'],
      DoubleMustache['postfix']
    >,
    InterpolatedValuesNamesChecks<
      TemplateString['prefix'],
      TemplateString['postfix']
    >,
  ]
>;

type InterpolateValuesCheck<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Values extends Record<string, string | number>,
  Result extends string,
> = Equal<Result, InterpolateValues<ResourceString, Prefix, Postfix, Values>>;

export type AnyInterpolateValuesCases = Record<
  string,
  {
    template: string;
    values: Record<string, any>;
    result: string;
  }
>;

export type InterpolateValuesCases<
  Prefix extends string,
  Postfix extends string,
  CommonTemplate extends string = `${Prefix}${FirstValue['name']}${Postfix}`,
  NoPrefixTemplate extends string = `${Prefix}${FirstValue['name']}`,
  NoNameTemplate extends string = `${Prefix} ${Postfix}`,
> = {
  withoutSpaces: {
    template: CommonTemplate;
    values: Record<FirstValue['name'], FirstValue['value']>;
    result: FirstValue['value'];
  };
  withoutValue: {
    template: CommonTemplate;
    values: {};
    result: CommonTemplate;
  };
  withSpaces: {
    template: `${Prefix}   ${FirstValue['name']}   ${Postfix}`;
    values: Record<FirstValue['name'], FirstValue['value']>;
    result: FirstValue['value'];
  };
  twoInRow: {
    template: `${Prefix}${FirstValue['name']}${Postfix}${Prefix}${SecondValue['name']}${Postfix}`;
    values: Record<FirstValue['name'], FirstValue['value']> &
      Record<SecondValue['name'], SecondValue['value']>;
    result: `${FirstValue['value']}${SecondValue['value']}`;
  };
  withAnd: {
    template: `${Prefix}${FirstValue['name']}${Postfix} and ${Prefix}${SecondValue['name']}${Postfix}`;
    values: Record<FirstValue['name'], FirstValue['value']> &
      Record<SecondValue['name'], SecondValue['value']>;
    result: `${FirstValue['value']} and ${SecondValue['value']}`;
  };
  sameInRow: {
    template: `${Prefix}${FirstValue['name']}${Postfix} ${Prefix}${FirstValue['name']}${Postfix}`;
    values: Record<FirstValue['name'], FirstValue['value']>;
    result: `${FirstValue['value']} ${FirstValue['value']}`;
  };
  emptyString: {
    template: StringWithoutTemplate;
    values: {};
    result: StringWithoutTemplate;
  };
  noPostfix: {
    template: NoPrefixTemplate;
    values: Record<FirstValue['name'], FirstValue['value']>;
    result: NoPrefixTemplate;
  };
  noName: {
    template: NoNameTemplate;
    values: Record<FirstValue['name'], FirstValue['value']>;
    result: NoNameTemplate;
  };
  unionValue: {
    template: `${Prefix}${UnionValue['name']}${Postfix}`;
    values: Record<UnionValue['name'], UnionValue['value']>;
    result: `${UnionValue['value']}`;
  };
  unionAndFirst: {
    template: `${Prefix}${UnionValue['name']}${Postfix} ${Prefix}${FirstValue['name']}${Postfix}`;
    values: Record<UnionValue['name'], UnionValue['value']> &
      Record<FirstValue['name'], FirstValue['value']>;
    result: `${UnionValue['value']} ${FirstValue['value']}`;
  };
};

type ValuesInterpolationCheck<
  Prefix extends string,
  Postfix extends string,
  Cases extends AnyInterpolateValuesCases = InterpolateValuesCases<
    Prefix,
    Postfix
  >,
  CaseName = keyof Cases,
> = CaseName extends keyof Cases
  ? InterpolateValuesCheck<
      Cases[CaseName]['template'],
      Prefix,
      Postfix,
      Cases[CaseName]['values'],
      Cases[CaseName]['result']
    >
  : never;

type ValuesInterpolationTests = TrueCases<
  [
    ValuesInterpolationCheck<
      DoubleMustache['prefix'],
      DoubleMustache['postfix']
    >,
    ValuesInterpolationCheck<
      TemplateString['prefix'],
      TemplateString['postfix']
    >,
  ]
>;
