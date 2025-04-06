import { ForbiddenCharsInNames, Trim } from './helpers';

export type Negation = '!';

type FalsyTypes = false | 0 | '' | null | undefined;

export type InterpolatedConditionsNames<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string = '"',
  ConditionsNames extends string = never
> = ResourceString extends `${string}${Prefix}${infer RawName}${Quot}${infer IfTrue}${Quot}${infer BeforeDelim}${Delim}${infer BeforeFalse}${Quot}${infer IfFalse}${Quot}${infer BeforePostfix}${Postfix}${infer Rest}`
  ? [Trim<BeforeDelim>, Trim<BeforeFalse>, Trim<BeforePostfix>] extends [
      '',
      '',
      ''
    ]
    ? Trim<RawName> extends infer Name extends string
      ? Name extends `${string}${ForbiddenCharsInNames}${string}` | ''
        ? InterpolatedConditionsNames<
            `${RawName}${Quot}${IfTrue}${Quot}${BeforeDelim}${Delim}${BeforeFalse}${Quot}${IfFalse}${Quot}${BeforePostfix}${Postfix}${Rest}`,
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
            | ConditionsNames
            | (Name extends `${Negation}${infer NameWithoutNegation}`
                ? NameWithoutNegation
                : Name)
          >
      : never
    : never
  : ConditionsNames;

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
  ResultStart extends string = ''
> = ResourceString extends `${infer Start}${Prefix}${infer RawName}${Quot}${infer IfTrue}${Quot}${infer BeforeDelim}${Delim}${infer BeforeFalse}${Quot}${infer IfFalse}${Quot}${infer BeforePostfix}${Postfix}${infer Rest}`
  ? Trim<RawName> extends infer TrimmedName
    ? TrimmedName extends `${
        | Negation
        | ''}${infer Name extends keyof Conditions & string}`
      ? [Trim<BeforeDelim>, Trim<BeforeFalse>, Trim<BeforePostfix>] extends [
          '',
          '',
          ''
        ]
        ? InterpolateConditions<
            Rest,
            Prefix,
            Postfix,
            Delim,
            Quot,
            Conditions,
            `${ResultStart}${Start}${Conditions[Name] extends infer ConditionValue
              ? ConditionValue extends FalsyTypes
                ? TrimmedName extends `${Negation}${string}`
                  ? IfTrue
                  : IfFalse
                : TrimmedName extends `${Negation}${string}`
                ? IfFalse
                : IfTrue
              : never}`
          >
        : InterpolateConditions<
            `${RawName}${Quot}${IfTrue}${Quot}${BeforeDelim}${Delim}${BeforeFalse}${Quot}${IfFalse}${Quot}${BeforePostfix}${Postfix}${Rest}`,
            Prefix,
            Postfix,
            Delim,
            Quot,
            Conditions,
            `${ResultStart}${Start}${Postfix}`
          >
      : InterpolateConditions<
          `${RawName}${Quot}${IfTrue}${Quot}${BeforeDelim}${Delim}${BeforeFalse}${Quot}${IfFalse}${Quot}${BeforePostfix}${Postfix}${Rest}`,
          Prefix,
          Postfix,
          Delim,
          Quot,
          Conditions,
          `${ResultStart}${Start}${Postfix}`
        >
    : never
  : `${ResultStart}${ResourceString}`;
