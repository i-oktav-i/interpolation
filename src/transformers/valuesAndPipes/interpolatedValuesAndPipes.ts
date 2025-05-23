import type {
  AnyResource,
  CheckName,
  GetConfigOptionValue,
  GetResourceAllValues,
  Split,
  Trim,
} from '../../types/index.ts';

export type Value = GetConfigOptionValue<'interpolatingValuesConstraint'>;

export type Pipe = (value: Value) => Value;

export type InterpolatedValuesNames<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  PipesDelim extends string,
  Names extends string = never,
  ParsedData extends AnyParsedData = AnyParsedData &
    ParseResourceString<ResourceString, Prefix, Postfix, PipesDelim>
> = [ParsedData['valueName']] extends [never]
  ? [ParsedData['rest']] extends [never]
    ? Names
    : InterpolatedValuesNames<
        ParsedData['rest'],
        Prefix,
        Postfix,
        PipesDelim,
        Names
      >
  : InterpolatedValuesNames<
      ParsedData['rest'],
      Prefix,
      Postfix,
      PipesDelim,
      Names | ParsedData['valueName']
    >;

export type GetAllPipesNames<
  Resource extends AnyResource,
  Prefix extends string,
  Postfix extends string,
  PipesDelim extends string,
  AllValues extends string = GetResourceAllValues<Resource>
> = AllValues extends string
  ? InterpolatedPipesNames<AllValues, Prefix, Postfix, PipesDelim>
  : never;

export type PipesParam<PipeName extends string> = [PipeName] extends [never]
  ? { pipes?: {} }
  : {
      pipes: Record<PipeName & string, Pipe>;
    };

export type InterpolatedPipesNames<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  PipesDelim extends string,
  Names extends string = never,
  ParsedData extends AnyParsedData = ParseResourceString<
    ResourceString,
    Prefix,
    Postfix,
    PipesDelim
  >
> = [ParsedData['pipeName']] extends [never]
  ? [ParsedData['rest']] extends [never]
    ? Names
    : InterpolatedPipesNames<
        ParsedData['rest'],
        Prefix,
        Postfix,
        PipesDelim,
        Names
      >
  : InterpolatedPipesNames<
      ParsedData['rest'],
      Prefix,
      Postfix,
      PipesDelim,
      Names | ParsedData['pipeName']
    >;

export type InterpolateValuesAndPipes<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  PipesDelim extends string,
  Values extends Record<string, Value>,
  PipeName extends string,
  ResultStart extends string = '',
  ParsedData extends AnyParsedData = AnyParsedData &
    ParseResourceString<
      ResourceString,
      Prefix,
      Postfix,
      PipesDelim,
      keyof Values & string,
      PipeName
    >
> = [ParsedData['valueName']] extends [never]
  ? [ParsedData['rest']] extends [never]
    ? `${ResultStart}${ResourceString}`
    : InterpolateValuesAndPipes<
        ParsedData['rest'],
        Prefix,
        Postfix,
        PipesDelim,
        Values,
        PipeName,
        `${ResultStart}${ParsedData['start']}`
      >
  : InterpolateValuesAndPipes<
      ParsedData['rest'],
      Prefix,
      Postfix,
      PipesDelim,
      Values,
      PipeName,
      `${ResultStart}${ParsedData['start']}${[ParsedData['pipeName']] extends [
        never
      ]
        ? Values[ParsedData['valueName']]
        : string}`
    >;

type CheckNames<
  ValueName extends string,
  PipeName extends string,
  ValueNameLimitation extends string,
  PipeNameLimitation extends string
> =
  | CheckName<ValueName>
  | (ValueName extends ValueNameLimitation ? true : false)
  | CheckName<PipeName>
  | (PipeName extends PipeNameLimitation ? true : false) extends true
  ? true
  : false;

type AnyRawParts = {
  expression: string;
  valueName: string;
  pipeName: string;
  start: string;
  rest: string;
};

type GetRawTemplateParts<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  PipesDelim extends string
> = ResourceString extends `${infer Start}${Prefix}${infer Expression}${Postfix}${infer Rest}`
  ? Expression extends `${infer RawName}${PipesDelim}${infer PipesExpression}`
    ? {
        expression: Expression;
        valueName: RawName;
        pipeName: Split<PipesExpression, PipesDelim>;
        start: Start;
        rest: Rest;
      }
    : {
        expression: Expression;
        valueName: Expression;
        pipeName: never;
        start: Start;
        rest: Rest;
      }
  : never;

type AnyParsedData = {
  valueName: string;
  pipeName: string;
  start: string;
  rest: string;
};

type ParseResourceString<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  PipesDelim extends string,
  ValueNameLimitation extends string = string,
  PipeNameLimitation extends string = string,
  RawData extends AnyRawParts = GetRawTemplateParts<
    ResourceString,
    Prefix,
    Postfix,
    PipesDelim
  >,
  ValueName extends string = Trim<RawData['valueName']>,
  PipeName extends string = Trim<RawData['pipeName']>,
  IsTemplateCorrect extends boolean = CheckNames<
    ValueName,
    PipeName,
    ValueNameLimitation,
    PipeNameLimitation
  >
> = [RawData] extends [never]
  ? never
  : IsTemplateCorrect extends true
  ? {
      valueName: ValueName;
      pipeName: PipeName;
      start: RawData['start'];
      rest: RawData['rest'];
    }
  : {
      valueName: never;
      pipeName: never;
      start: `${RawData['start']}${Prefix}`;
      rest: `${RawData['expression']}${Postfix}${RawData['rest']}`;
    };
