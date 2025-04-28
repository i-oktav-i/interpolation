import type { Equal, TrueCases } from 'type-testing';
import type {
  InterpolateConditions,
  InterpolatedConditionsNames,
  Negation,
} from './interpolatedConditions.ts';

// #region Setup

type FirstCondition = {
  name: 'condition1';
  ifTrue: 'first condition is true';
  ifFalse: 'first condition is false';
};
type SecondCondition = {
  name: 'condition2';
  ifTrue: 'second condition is true';
  ifFalse: 'second condition is false';
};

type DoubleMustache = {
  prefix: '{{?';
  postfix: '}}';
  delim: '::';
  quot: '"';
};

type BashStyle = {
  prefix: '#if';
  postfix: '#endif';
  delim: '#else';
  quot: '`';
};

// #endregion

// #region InterpolatedConditionsNames

type InterpolatedConditionsNamesCheck<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string,
  Result extends string
> = Equal<
  Result,
  InterpolatedConditionsNames<ResourceString, Prefix, Postfix, Delim, Quot>
>;

type AnyInterpolatedConditionsNamesCases = Record<
  string,
  { template: string; result: string }
>;
type InterpolatedConditionsNamesCases<
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string
> = {
  withoutSpacesWithoutNegation: {
    template: `${Prefix}${FirstCondition['name']}${Quot}${FirstCondition['ifTrue']}${Quot}${Delim}${Quot}${FirstCondition['ifFalse']}${Quot}${Postfix}`;
    result: FirstCondition['name'];
  };
  withoutSpacesWithNegation: {
    template: `${Prefix}${Negation}${FirstCondition['name']}${Quot}${FirstCondition['ifTrue']}${Quot}${Delim}${Quot}${FirstCondition['ifFalse']}${Quot}${Postfix}`;
    result: FirstCondition['name'];
  };
  withSpacesWithoutNegation: {
    template: `${Prefix}      ${FirstCondition['name']}           ${Quot}${FirstCondition['ifTrue']}${Quot}     ${Delim}     ${Quot}${FirstCondition['ifFalse']}${Quot}     ${Postfix}`;
    result: FirstCondition['name'];
  };
  withSpacesWithNegation: {
    template: `${Prefix}      ${Negation}${FirstCondition['name']}           ${Quot}${FirstCondition['ifTrue']}${Quot}     ${Delim}     ${Quot}${FirstCondition['ifFalse']}${Quot}     ${Postfix}`;
    result: FirstCondition['name'];
  };
  withSpacesWithWrongNegation: {
    template: `${Prefix}${Negation}      ${FirstCondition['name']}           ${Quot}${FirstCondition['ifTrue']}${Quot}     ${Delim}     ${Quot}${FirstCondition['ifFalse']}${Quot}     ${Postfix}`;
    result: never;
  };
  withoutPrefix: {
    template: `${FirstCondition['name']}${Quot}${FirstCondition['ifTrue']}${Quot}${Delim}${Quot}${FirstCondition['ifFalse']}${Quot}${Postfix}`;
    result: never;
  };
  withoutPostfix: {
    template: `${Prefix}${FirstCondition['name']}${Quot}${FirstCondition['ifTrue']}${Quot}${Delim}${Quot}${FirstCondition['ifFalse']}${Quot}`;
    result: never;
  };
  withoutDelim: {
    template: `${Prefix}${FirstCondition['name']}${Quot}${FirstCondition['ifTrue']}${Quot}${Quot}${FirstCondition['ifFalse']}${Quot}${Postfix}`;
    result: never;
  };
  withExtraChars: {
    template: `${Prefix} wrong ${FirstCondition['name']}${Quot}${FirstCondition['ifTrue']}${Quot}${Delim}${Quot}${FirstCondition['ifFalse']}${Quot}${Postfix}`;
    result: never;
  };
  withAndWithoutNegation: {
    template: `${Prefix}${Negation}${FirstCondition['name']}${Quot}${FirstCondition['ifTrue']}${Quot}${Delim}${Quot}${FirstCondition['ifFalse']}${Quot}${Postfix} ${Prefix}${FirstCondition['name']}${Quot}${FirstCondition['ifTrue']}${Quot}${Delim}${Quot}${FirstCondition['ifFalse']}${Quot}${Postfix}`;
    result: FirstCondition['name'];
  };
  twoConditions: {
    template: `${Prefix}${FirstCondition['name']}${Quot}${FirstCondition['ifTrue']}${Quot}${Delim}${Quot}${FirstCondition['ifFalse']}${Quot}${Postfix} ${Prefix}${SecondCondition['name']}${Quot}${SecondCondition['ifTrue']}${Quot}${Delim}${Quot}${SecondCondition['ifFalse']}${Quot}${Postfix}`;
    result: FirstCondition['name'] | SecondCondition['name'];
  };
};

type InterpolatedConditionsNamesChecks<
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string,
  Cases extends AnyInterpolatedConditionsNamesCases = InterpolatedConditionsNamesCases<
    Prefix,
    Postfix,
    Delim,
    Quot
  >,
  CaseName = keyof Cases
> = CaseName extends keyof Cases
  ? InterpolatedConditionsNamesCheck<
      Cases[CaseName]['template'],
      Prefix,
      Postfix,
      Delim,
      Quot,
      Cases[CaseName]['result']
    >
  : never;

type InterpolatedConditionsNamesTests = TrueCases<
  [
    InterpolatedConditionsNamesChecks<
      DoubleMustache['prefix'],
      DoubleMustache['postfix'],
      DoubleMustache['delim'],
      DoubleMustache['quot']
    >,
    InterpolatedConditionsNamesChecks<
      BashStyle['prefix'],
      BashStyle['postfix'],
      BashStyle['delim'],
      BashStyle['quot']
    >
  ]
>;

// #endregion

// #region InterpolateConditions

type InterpolateConditionsCheck<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string,
  Conditions extends Record<string, any>,
  Result extends string
> = Equal<
  InterpolateConditions<
    ResourceString,
    Prefix,
    Postfix,
    Delim,
    Quot,
    Conditions
  >,
  Result
>;

type AnyInterpolateConditionsCases = Record<
  string,
  { template: string; result: string; values: Record<string, unknown> }
>;
type InterpolateConditionsCases<
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string,
  CommonTemplate extends string = `${Prefix}${FirstCondition['name']}${Quot}${FirstCondition['ifTrue']}${Quot}${Delim}${Quot}${FirstCondition['ifFalse']}${Quot}${Postfix}`,
  WrongTemplate extends string = `${FirstCondition['name']}${Quot}${FirstCondition['ifTrue']}${Quot}${Delim}${Quot}${FirstCondition['ifFalse']}${Quot}${Postfix}`
> = {
  withoutNegationWithTrueCondition: {
    template: CommonTemplate;
    values: Record<FirstCondition['name'], true>;
    result: FirstCondition['ifTrue'];
  };
  withoutNegationWithFalseCondition: {
    template: `${Prefix}${FirstCondition['name']}${Quot}${FirstCondition['ifTrue']}${Quot}${Delim}${Quot}${FirstCondition['ifFalse']}${Quot}${Postfix}`;
    values: Record<FirstCondition['name'], false>;
    result: FirstCondition['ifFalse'];
  };
  withNegationWithTrueCondition: {
    template: `${Prefix}${Negation}${FirstCondition['name']}${Quot}${FirstCondition['ifTrue']}${Quot}${Delim}${Quot}${FirstCondition['ifFalse']}${Quot}${Postfix}`;
    values: Record<FirstCondition['name'], true>;
    result: FirstCondition['ifFalse'];
  };
  withNegationWithFalseCondition: {
    template: `${Prefix}${Negation}${FirstCondition['name']}${Quot}${FirstCondition['ifTrue']}${Quot}${Delim}${Quot}${FirstCondition['ifFalse']}${Quot}${Postfix}`;
    values: Record<FirstCondition['name'], false>;
    result: FirstCondition['ifTrue'];
  };
  withoutPrefix: {
    template: WrongTemplate;
    values: Record<FirstCondition['name'], true>;
    result: WrongTemplate;
  };
  doubleConditionValue: {
    template: `${Prefix}${FirstCondition['name']}${Quot}${FirstCondition['ifTrue']}${Quot}${Delim}${Quot}${FirstCondition['ifFalse']}${Quot}${Postfix}`;
    values: Record<FirstCondition['name'], boolean>;
    result: FirstCondition['ifTrue'] | FirstCondition['ifFalse'];
  };
  withoutValues: {
    template: CommonTemplate;
    values: {};
    result: CommonTemplate;
  };
};

type InterpolateConditionsChecks<
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string,
  Cases extends AnyInterpolateConditionsCases = InterpolateConditionsCases<
    Prefix,
    Postfix,
    Delim,
    Quot
  >,
  CaseName = keyof Cases
> = CaseName extends keyof Cases
  ? InterpolateConditionsCheck<
      Cases[CaseName]['template'],
      Prefix,
      Postfix,
      Delim,
      Quot,
      Cases[CaseName]['values'],
      Cases[CaseName]['result']
    >
  : never;

type InterpolateConditionsTests = TrueCases<
  [
    InterpolateConditionsChecks<
      DoubleMustache['prefix'],
      DoubleMustache['postfix'],
      DoubleMustache['delim'],
      DoubleMustache['quot']
    >,
    InterpolateConditionsChecks<
      BashStyle['prefix'],
      BashStyle['postfix'],
      BashStyle['delim'],
      BashStyle['quot']
    >
  ]
>;
// #endregion
