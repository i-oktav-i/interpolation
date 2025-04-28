import type { Equal, TrueCases } from 'type-testing';
import type {
  InterpolatedValuesNames,
  InterpolateValues,
} from './interpolatedValues';

type FirstValueName = 'value1';
type SecondValueName = 'value2';

type DoubleMustache = {
  prefix: '{{';
  postfix: '}}';
};
type TemplateString = {
  prefix: '${';
  postfix: '}';
};

type InterpolatedValuesNamesCheck<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Result extends string
> = Equal<InterpolatedValuesNames<ResourceString, Prefix, Postfix>, Result>;

type InterpolatedValuesNamesCases<
  Prefix extends string,
  Postfix extends string
> = {
  withoutSpaces: {
    template: `${Prefix}${FirstValueName}${Postfix}`;
    result: FirstValueName;
  };
  withSpaces: {
    template: `${Prefix}   ${FirstValueName}   ${Postfix}`;
    result: FirstValueName;
  };
  twoInRow: {
    template: `${Prefix}${FirstValueName}${Postfix}${Prefix}${SecondValueName}${Postfix}`;
    result: FirstValueName | SecondValueName;
  };
  withAnd: {
    template: `${Prefix}${FirstValueName}${Postfix} and ${Prefix}${SecondValueName}${Postfix}`;
    result: FirstValueName | SecondValueName;
  };
  sameInRow: {
    template: `${Prefix}${FirstValueName}${Postfix} ${Prefix}${FirstValueName}${Postfix}`;
    result: FirstValueName;
  };
  emptyString: {
    template: `Empty string`;
    result: never;
  };
  noPostfix: {
    template: `${Prefix}${FirstValueName}`;
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

const getInterpolatedValuesChecks = <
  Prefix extends string,
  Postfix extends string
>() => {
  type Resources = InterpolatedValuesNamesCases<Prefix, Postfix>;

  type GetCase<CaseName extends keyof Resources> =
    CaseName extends keyof Resources
      ? InterpolatedValuesNamesCheck<
          Resources[CaseName]['template'],
          Prefix,
          Postfix,
          Resources[CaseName]['result']
        >
      : never;

  type TotalCheck = GetCase<keyof Resources>;

  return true as TotalCheck;
};

type InterpolatedValuesNamesChecks<
  Prefix extends string,
  Postfix extends string
> = ReturnType<typeof getInterpolatedValuesChecks<Prefix, Postfix>>;

type InterpolatedValuesNamesTests = TrueCases<
  [
    InterpolatedValuesNamesChecks<
      DoubleMustache['prefix'],
      DoubleMustache['postfix']
    >,
    InterpolatedValuesNamesChecks<
      TemplateString['prefix'],
      TemplateString['postfix']
    >
  ]
>;

type ValuesInterpolationCheck<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Values extends Record<string, string>,
  Result extends string
> = Equal<InterpolateValues<ResourceString, Prefix, Postfix, Values>, Result>;

type FirstValue = 'value1';
type SecondValue = 'value2';

type GetValuesInterpolationCases<
  Prefix extends string,
  Postfix extends string
> = [
  ValuesInterpolationCheck<
    `${Prefix}${FirstValueName}${Postfix}`,
    Prefix,
    Postfix,
    Record<FirstValueName, FirstValue>,
    FirstValue
  >,
  ValuesInterpolationCheck<
    `${Prefix}    ${FirstValueName}    ${Postfix}`,
    Prefix,
    Postfix,
    Record<FirstValueName, FirstValue>,
    FirstValue
  >,
  ValuesInterpolationCheck<
    `${Prefix}${FirstValueName}${Postfix} ${Prefix}${SecondValueName}${Postfix}`,
    Prefix,
    Postfix,
    Record<FirstValueName, FirstValue> & Record<SecondValueName, SecondValue>,
    `${FirstValue} ${SecondValue}`
  >,
  ValuesInterpolationCheck<
    `${Prefix}     ${FirstValueName}   ${Postfix} ${Prefix}       ${SecondValueName}${Postfix}`,
    Prefix,
    Postfix,
    Record<FirstValueName, FirstValue> & Record<SecondValueName, SecondValue>,
    `${FirstValue} ${SecondValue}`
  >
];

type ValuesInterpolationTests = TrueCases<
  [
    ...GetValuesInterpolationCases<
      DoubleMustache['prefix'],
      DoubleMustache['postfix']
    >,
    ...GetValuesInterpolationCases<
      TemplateString['prefix'],
      TemplateString['postfix']
    >
  ]
>;
