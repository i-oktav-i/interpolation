import { ForbiddenCharsInNames, Trim } from '../../types';

export type Value = string | number;

export type InterpolatedValuesNames<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Names extends string = never
> = ResourceString extends `${string}${Prefix}${infer RawName}${Postfix}${infer Rest}`
  ? Trim<RawName> extends infer Name extends string
    ? Name extends `${string}${ForbiddenCharsInNames}${string}` | ''
      ? InterpolatedValuesNames<
          `${RawName}${Postfix}${Rest}`,
          Prefix,
          Postfix,
          Names
        >
      : InterpolatedValuesNames<Rest, Prefix, Postfix, Names | Name>
    : never
  : Names;

export type ReducedResourceToValueNames<
  ReducedResource extends Record<string, string>,
  Prefix extends string,
  Postfix extends string
> = {
  [Key in keyof ReducedResource]: InterpolatedValuesNames<
    ReducedResource[Key],
    Prefix,
    Postfix
  >;
};

export type InterpolateValues<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Values extends Record<string, string | number>,
  ResultStart extends string = ''
> = ResourceString extends `${infer Start}${Prefix}${infer RawName}${Postfix}${infer Rest}`
  ? Trim<RawName> extends infer Name extends keyof Values
    ? InterpolateValues<
        Rest,
        Prefix,
        Postfix,
        Values,
        `${ResultStart}${Start}${Values[Name]}`
      >
    : InterpolateValues<
        `${RawName}${Postfix}${Rest}`,
        Prefix,
        Postfix,
        Values,
        `${ResultStart}${Start}${Prefix}`
      >
  : `${ResultStart}${ResourceString}`;
