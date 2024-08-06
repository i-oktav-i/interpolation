import { Trim } from './helpers';

export type InterpolatedConditionsNames<
  T extends string,
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string = '"'
> = T extends `${string}${Prefix}${infer RawName}${Quot}${infer IfTrue}${Quot}${infer BeforeDelim}${Delim}${infer BeforeFalse}${Quot}${infer IfFalse}${Quot}${infer BeforePostfix}${Postfix}${infer Rest}`
  ? [Trim<BeforeDelim>, Trim<BeforeFalse>, Trim<BeforePostfix>] extends [
      '',
      '',
      ''
    ]
    ? Trim<RawName> extends infer Name
      ? Name extends `${string} ${string}` | ''
        ? InterpolatedConditionsNames<
            `${RawName}${Quot}${IfTrue}${Quot}${BeforeDelim}${Delim}${BeforeFalse}${Quot}${IfFalse}${Quot}${BeforePostfix}${Postfix}${Rest}`,
            Prefix,
            Postfix,
            Delim,
            Quot
          >
        : Name | InterpolatedConditionsNames<Rest, Prefix, Postfix, Delim, Quot>
      : never
    : never
  : never;

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

type FalsyTypes = false | 0 | '' | null | undefined;

export type InterpolateConditions<
  T extends string,
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string,
  Conditions extends Record<string, any>
> = T extends `${infer Start}${Prefix}${infer RawName}${Quot}${infer IfTrue}${Quot}${infer BeforeDelim}${Delim}${infer BeforeFalse}${Quot}${infer IfFalse}${Quot}${infer BeforePostfix}${Postfix}${infer Rest}`
  ? Trim<RawName> extends infer Name extends keyof Conditions
    ? [Trim<BeforeDelim>, Trim<BeforeFalse>, Trim<BeforePostfix>] extends [
        '',
        '',
        ''
      ]
      ? `${Start}${Conditions[Name] extends FalsyTypes
          ? IfFalse
          : IfTrue}${InterpolateConditions<
          Rest,
          Prefix,
          Postfix,
          Delim,
          Quot,
          Conditions
        >}`
      : `${Start}${Postfix}${InterpolateConditions<
          `${RawName}${Quot}${IfTrue}${Quot}${BeforeDelim}${Delim}${BeforeFalse}${Quot}${IfFalse}${Quot}${BeforePostfix}${Postfix}${Rest}`,
          Prefix,
          Postfix,
          Delim,
          Quot,
          Conditions
        >}`
    : `${Start}${Prefix}${InterpolateConditions<
        `${RawName}${Quot}${IfTrue}${Quot}${BeforeDelim}${Delim}${BeforeFalse}${Quot}${IfFalse}${Quot}${BeforePostfix}${Postfix}${Rest}`,
        Prefix,
        Postfix,
        Delim,
        Quot,
        Conditions
      >}`
  : T;
