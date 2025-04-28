import type { ForbiddenCharsInNames, Trim } from '../../types/index.ts';

export type Negation = '!';
export type FalsyType = false | 0 | '' | null | undefined;

type IsEmptyString<T extends string> = T extends '' ? true : false;
type IsCorrectName<Name extends string> = Name extends
  | `${string}${ForbiddenCharsInNames}${string}`
  | ''
  ? false
  : true;

// Check if name correct and there no any additional characters in template
type IsTemplateCorrect<
  Name extends string,
  BeforeDelim extends string,
  BeforeFalse extends string,
  BeforePostfix extends string,
  NameLimitation extends string = string
> = [
  IsCorrectName<Name>,
  Name extends NameLimitation ? true : false,
  IsEmptyString<Trim<BeforeDelim>>,
  IsEmptyString<Trim<BeforeFalse>>,
  IsEmptyString<Trim<BeforePostfix>>
] extends [true, true, true, true, true]
  ? true
  : false;

type AnyRawParts = {
  name: string;
  ifTrue: string;
  ifFalse: string;
  start: string;
  rest: string;
  beforeDelim: string;
  beforeFalse: string;
  beforePostfix: string;
};

// Extract main template parts from resource string
type GetRawTemplateParts<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string
> = ResourceString extends `${infer Start}${Prefix}${infer Name}${Quot}${infer IfTrue}${Quot}${infer BeforeDelim}${Delim}${infer BeforeFalse}${Quot}${infer IfFalse}${Quot}${infer BeforePostfix}${Postfix}${infer Rest}`
  ? {
      name: Trim<Name>;
      ifTrue: IfTrue;
      ifFalse: IfFalse;
      start: Start;
      rest: Rest;
      beforeDelim: BeforeDelim;
      beforeFalse: BeforeFalse;
      beforePostfix: BeforePostfix;
    }
  : never;

type AnyParsedData = {
  name: string;
  ifTrue: string;
  ifFalse: string;
  start: string;
  rest: string;
};

// Parse resource string to get name, ifTrue, ifFalse and rest
type ParseResourceString<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string,
  NameLimitation extends string = string,
  RawData extends AnyRawParts = GetRawTemplateParts<
    ResourceString,
    Prefix,
    Postfix,
    Delim,
    Quot
  >,
  TrimmedName extends string = Trim<RawData['name']>,
  Name extends string = TrimmedName extends `${Negation}${infer Name}`
    ? Name
    : TrimmedName,
  TemplateCorrectness = IsTemplateCorrect<
    Name,
    RawData['beforeDelim'],
    RawData['beforeFalse'],
    RawData['beforePostfix'],
    NameLimitation
  >,
  Negate extends boolean = TrimmedName extends `${Negation}${string}`
    ? true
    : false,
  ConditionalValues = Negate extends true
    ? { ifTrue: RawData['ifFalse']; ifFalse: RawData['ifTrue'] }
    : { ifTrue: RawData['ifTrue']; ifFalse: RawData['ifFalse'] }
> = [RawData] extends [never]
  ? never
  : TemplateCorrectness extends true
  ? {
      name: Name;
      start: RawData['start'];
      rest: RawData['rest'];
    } & ConditionalValues
  : {
      name: never;
      ifTrue: never;
      ifFalse: never;
      start: RawData['start'];
      rest: `${RawData['name']}${Quot}${RawData['ifTrue']}${Quot}${RawData['beforeDelim']}${Delim}${RawData['beforeFalse']}${Quot}${RawData['ifFalse']}${Quot}${RawData['beforePostfix']}${Postfix}${RawData['rest']}`;
    };

export type InterpolatedConditionsNames<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string = '"',
  ConditionsNames extends string = never,
  ParsedData extends AnyParsedData = AnyParsedData &
    ParseResourceString<ResourceString, Prefix, Postfix, Delim, Quot>
> = [ParsedData['name']] extends [never]
  ? [ParsedData['rest']] extends [never]
    ? ConditionsNames
    : InterpolatedConditionsNames<
        ParsedData['rest'],
        Prefix,
        Postfix,
        Delim,
        Quot,
        ConditionsNames
      >
  : InterpolatedConditionsNames<
      ParsedData['rest'],
      Prefix,
      Postfix,
      Delim,
      Quot,
      ConditionsNames | ParsedData['name']
    >;

export type InterpolateConditions<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string,
  Conditions extends Record<string, any>,
  ResultStart extends string = '',
  ParsedData extends AnyParsedData = AnyParsedData &
    ParseResourceString<
      ResourceString,
      Prefix,
      Postfix,
      Delim,
      Quot,
      keyof Conditions & string
    >,
  RawStart extends string = ResourceString extends `${infer Start}${ParsedData['rest']}`
    ? Start
    : '',
  ConditionValue = Conditions[ParsedData['name']],
  FalsyIntersection = ConditionValue & FalsyType,
  FalsyInterpolatingValue extends string = [FalsyIntersection] extends [never]
    ? never
    : ParsedData['ifFalse'],
  TruthyInterpolatingValue extends string = ConditionValue extends FalsyType
    ? never
    : ParsedData['ifTrue']
> = [ParsedData['name']] extends [never]
  ? [ParsedData['rest']] extends [never]
    ? `${ResultStart}${ResourceString}`
    : InterpolateConditions<
        ParsedData['rest'],
        Prefix,
        Postfix,
        Delim,
        Quot,
        Conditions,
        `${ResultStart}${RawStart}`
      >
  : InterpolateConditions<
      ParsedData['rest'],
      Prefix,
      Postfix,
      Delim,
      Quot,
      Conditions,
      `${ResultStart}${ParsedData['start']}${
        | TruthyInterpolatingValue
        | FalsyInterpolatingValue}`
    >;
