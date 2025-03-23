import { ForbiddenCharsInNames, Trim } from './helpers';

export type Negation = '!';
export type FalsyType = false | 0 | '' | null | undefined;

type IsEmptyString<T extends string> = T extends '' ? true : false;
type IsCorrectName<Name extends string> = Name extends
  | `${string}${ForbiddenCharsInNames}${string}`
  | ''
  ? false
  : true;

type ExtractField<T, FiledName extends string> = Extract<
  T,
  { [K in FiledName]: string }
>[FiledName];

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

// Extract main template parts from resource string
type GetRawTemplateParts<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string
> = ResourceString extends `${infer Start}${Prefix}${infer Name}${Quot}${infer IfTrue}${Quot}${infer BeforeDelim}${Delim}${infer BeforeFalse}${Quot}${infer IfFalse}${Quot}${infer BeforePostfix}${Postfix}${infer Rest}`
  ? {
      name: Name;
      ifTrue: IfTrue;
      ifFalse: IfFalse;
      start: Start;
      rest: Rest;
      beforeDelim: BeforeDelim;
      beforeFalse: BeforeFalse;
      beforePostfix: BeforePostfix;
    }
  : never;

// Parse resource string to get name, ifTrue, ifFalse and rest
type ParseResourceString<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string,
  NameLimitation extends string = string,
  RawData = GetRawTemplateParts<ResourceString, Prefix, Postfix, Delim, Quot>,
  Start extends string = ExtractField<RawData, 'start'>,
  RawName extends string = Trim<ExtractField<RawData, 'name'>>,
  Name extends string = RawName extends `${Negation}${infer Name}`
    ? Name
    : RawName,
  IfTrue extends string = ExtractField<RawData, 'ifTrue'>,
  BeforeDelim extends string = ExtractField<RawData, 'beforeDelim'>,
  BeforeFalse extends string = ExtractField<RawData, 'beforeFalse'>,
  IfFalse extends string = ExtractField<RawData, 'ifFalse'>,
  BeforePostfix extends string = ExtractField<RawData, 'beforePostfix'>,
  Rest extends string = ExtractField<RawData, 'rest'>,
  TemplateCorrectness = IsTemplateCorrect<
    Name,
    BeforeDelim,
    BeforeFalse,
    BeforePostfix,
    NameLimitation
  >,
  Negate extends boolean = RawName extends `${Negation}${string}`
    ? true
    : false,
  ConditionalValues = Negate extends true
    ? { ifTrue: IfFalse; ifFalse: IfTrue }
    : { ifTrue: IfTrue; ifFalse: IfFalse }
> = [RawData] extends [never]
  ? never
  : TemplateCorrectness extends true
  ? {
      name: Name;
      start: Start;
      rest: Rest;
    } & ConditionalValues
  : {
      start: Start;
      rest: `${Name}${Quot}${IfTrue}${Quot}${BeforeDelim}${Delim}${BeforeFalse}${Quot}${IfFalse}${Quot}${BeforePostfix}${Postfix}${Rest}`;
    };

export type InterpolatedConditionsNames<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string = '"',
  ConditionsNames extends string = never,
  ParsedData = ParseResourceString<
    ResourceString,
    Prefix,
    Postfix,
    Delim,
    Quot
  >,
  Name extends string = ExtractField<ParsedData, 'name'>,
  Rest extends string = ExtractField<ParsedData, 'rest'>
> = [Name] extends [never]
  ? [Rest] extends [never]
    ? ConditionsNames
    : InterpolatedConditionsNames<
        Rest,
        Prefix,
        Postfix,
        Delim,
        Quot,
        ConditionsNames
      >
  : InterpolatedConditionsNames<
      Rest,
      Prefix,
      Postfix,
      Delim,
      Quot,
      ConditionsNames | Name
    >;

export type ReducedResourceToConditionNames<
  ReducedResource extends Record<string, string>,
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string = '"'
> = {
  [Key in keyof ReducedResource]: InterpolatedConditionsNames<
    ReducedResource[Key],
    Prefix,
    Postfix,
    Delim,
    Quot
  >;
};

export type InterpolateConditions<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string,
  Conditions extends Record<string, any>,
  ResultStart extends string = '',
  ParsedData = ParseResourceString<
    ResourceString,
    Prefix,
    Postfix,
    Delim,
    Quot,
    keyof Conditions & string
  >,
  Name extends string = ExtractField<ParsedData, 'name'>,
  IfTrue extends string = ExtractField<ParsedData, 'ifTrue'>,
  IfFalse extends string = ExtractField<ParsedData, 'ifFalse'>,
  Start extends string = ExtractField<ParsedData, 'start'>,
  Rest extends string = ExtractField<ParsedData, 'rest'>,
  RawStart extends string = ResourceString extends `${infer Start}${Rest}`
    ? Start
    : '',
  InterpolatingValue extends string = Conditions[Name] extends FalsyType
    ? IfFalse
    : IfTrue
> = [Name] extends [never]
  ? [Rest] extends [never]
    ? `${ResultStart}${ResourceString}`
    : InterpolateConditions<
        Rest,
        Prefix,
        Postfix,
        Delim,
        Quot,
        Conditions,
        `${ResultStart}${RawStart}`
      >
  : InterpolateConditions<
      Rest,
      Prefix,
      Postfix,
      Delim,
      Quot,
      Conditions,
      `${ResultStart}${Start}${InterpolatingValue}`
    >;
