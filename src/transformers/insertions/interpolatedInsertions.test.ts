// #region Setup

export type FirstPath = 'path1';
export type SecondPath = 'path2';

export type SomeText = 'Some text';

export type DoubleMustache = {
  prefix: '{{>';
  postfix: '}}';
};

export type TemplateStyle = {
  prefix: '<%=';
  postfix: '%>';
};

type FirstInsertionResource = Record<FirstPath, 'insertion1'>;
type SecondInsertionResource = Record<SecondPath, 'insertion2'>;

export type AnyInterpolateInsertionCases = Record<
  string,
  {
    template: string;
    values: Record<string, string>;
    result: string;
  }
>;

export type InterpolateInsertionCases<
  Prefix extends string,
  Postfix extends string,
  FirstCommonTemplate extends string = `${Prefix}${FirstPath}${Postfix}`,
  SecondCommonTemplate extends string = `${Prefix}${SecondPath}${Postfix}`,
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
  invalidPathWithSpaces: {
    template: `${Prefix}invalid path with spaces${Postfix}`;
    values: FirstInsertionResource;
    result: `${Prefix}invalid path with spaces${Postfix}`;
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

// #endregion
