import type { Equal, TrueCases } from 'type-testing';
import type {
  InterpolatedInsertionNames,
  InterpolateInsertion,
} from './types.ts';

// #region Setup

type FirstPath = 'path1';
type SecondPath = 'path2';

type SomeText = 'Some text';

type DoubleMustache = {
  prefix: '{{>';
  postfix: '}}';
};

type TemplateStyle = {
  prefix: '<%=';
  postfix: '%>';
};

// #endregion

// #region InterpolatedInsertionNames

type InterpolatedInsertionNamesCheck<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Result extends string
> = Equal<InterpolatedInsertionNames<ResourceString, Prefix, Postfix>, Result>;

type AnyInterpolatedInsertionNamesCases = Record<
  string,
  { template: string; result: string }
>;

type InterpolatedInsertionNamesCases<
  Prefix extends string,
  Postfix extends string,
  FirstCommonTemplate extends string = `${Prefix}${FirstPath}${Postfix}`,
  SecondCommonTemplate extends string = `${Prefix}${SecondPath}${Postfix}`
> = {
  withoutSpaces: {
    template: FirstCommonTemplate;
    result: FirstPath;
  };
  withSpaces: {
    template: `${Prefix}   ${FirstPath}   ${Postfix}`;
    result: FirstPath;
  };
  twoInRow: {
    template: `${FirstCommonTemplate}${SecondCommonTemplate}`;
    result: FirstPath | SecondPath;
  };
  withText: {
    template: `${SomeText}${FirstCommonTemplate} ${SomeText} ${SecondCommonTemplate}${SomeText}`;
    result: FirstPath | SecondPath;
  };
  sameInRow: {
    template: `${FirstCommonTemplate} ${FirstCommonTemplate}`;
    result: FirstPath;
  };
  emptyString: {
    template: SomeText;
    result: never;
  };
  noPostfix: {
    template: `${Prefix}${FirstPath}`;
    result: never;
  };
  noName: {
    template: `${Prefix} ${Postfix}`;
    result: never;
  };
  invalidPathWithSpaces: {
    template: `${Prefix}invalid path with spaces${Postfix}`;
    result: never;
  };
};

type InterpolatedInsertionNamesChecks<
  Prefix extends string,
  Postfix extends string,
  Cases extends AnyInterpolatedInsertionNamesCases = InterpolatedInsertionNamesCases<
    Prefix,
    Postfix
  >,
  CaseName = keyof Cases
> = CaseName extends keyof Cases
  ? InterpolatedInsertionNamesCheck<
      Cases[CaseName]['template'],
      Prefix,
      Postfix,
      Cases[CaseName]['result']
    >
  : never;

type InterpolatedInsertionNamesTests = TrueCases<
  [
    InterpolatedInsertionNamesChecks<
      DoubleMustache['prefix'],
      DoubleMustache['postfix']
    >,
    InterpolatedInsertionNamesChecks<
      TemplateStyle['prefix'],
      TemplateStyle['postfix']
    >
  ]
>;

// #endregion

// #region InterpolateInsertion

type InterpolateInsertionCheck<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  InsertionValues extends Record<string, string>,
  Result extends string
> = Equal<
  InterpolateInsertion<ResourceString, Prefix, Postfix, InsertionValues>,
  Result
>;

type FirstInsertionResource = Record<FirstPath, 'insertion1'>;
type SecondInsertionResource = Record<SecondPath, 'insertion2'>;

type AnyInterpolateInsertionCases = Record<
  string,
  {
    template: string;
    values: Record<string, string>;
    result: string;
  }
>;

type InterpolateInsertionCases<
  Prefix extends string,
  Postfix extends string,
  FirstCommonTemplate extends string = `${Prefix}${FirstPath}${Postfix}`,
  SecondCommonTemplate extends string = `${Prefix}${SecondPath}${Postfix}`
> = {
  basicInsertion: {
    template: FirstCommonTemplate;
    values: FirstInsertionResource;
    result: FirstInsertionResource[FirstPath];
  };
  withSpaces: {
    template: `${Prefix}   ${FirstPath}   ${Postfix}`;
    values: FirstInsertionResource;
    result: FirstInsertionResource[FirstPath];
  };
  twoInRow: {
    template: `${FirstCommonTemplate}${SecondCommonTemplate}`;
    values: FirstInsertionResource & SecondInsertionResource;
    result: `${FirstInsertionResource[FirstPath]}${SecondInsertionResource[SecondPath]}`;
  };
  withText: {
    template: `${SomeText}${FirstCommonTemplate}${SomeText}${SecondCommonTemplate}${SomeText}`;
    values: FirstInsertionResource & SecondInsertionResource;
    result: `${SomeText}${FirstInsertionResource[FirstPath]}${SomeText}${SecondInsertionResource[SecondPath]}${SomeText}`;
  };
  nestedInsertion: {
    template: `${SecondCommonTemplate}`;
    values: FirstInsertionResource &
      Record<SecondPath, `${SomeText} ${FirstCommonTemplate}`>;
    result: `${SomeText} ${FirstInsertionResource[FirstPath]}`;
  };
  missingInsertion: {
    template: `${FirstCommonTemplate}`;
    values: SecondInsertionResource;
    result: `${FirstCommonTemplate}`;
  };
  emptyString: {
    template: '';
    values: FirstInsertionResource;
    result: '';
  };
  onlyText: {
    template: SomeText;
    values: FirstInsertionResource;
    result: SomeText;
  };
};

type InterpolateInsertionChecks<
  Prefix extends string,
  Postfix extends string,
  Cases extends AnyInterpolateInsertionCases = InterpolateInsertionCases<
    Prefix,
    Postfix
  >,
  CaseName = keyof Cases
> = CaseName extends keyof Cases
  ? InterpolateInsertionCheck<
      Cases[CaseName]['template'],
      Prefix,
      Postfix,
      Cases[CaseName]['values'],
      Cases[CaseName]['result']
    >
  : never;

type InterpolateInsertionTests = TrueCases<
  [
    InterpolateInsertionChecks<
      DoubleMustache['prefix'],
      DoubleMustache['postfix']
    >,
    InterpolateInsertionChecks<
      TemplateStyle['prefix'],
      TemplateStyle['postfix']
    >
  ]
>;

// #endregion
