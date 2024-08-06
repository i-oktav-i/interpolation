import { Trim } from './helpers';

export type InterpolatedValuesNames<
  T extends string,
  Prefix extends string,
  Postfix extends string
> = T extends `${string}${Prefix}${infer RawName}${Postfix}${infer Rest}`
  ? Trim<RawName> extends infer Name
    ? Name extends `${string} ${string}` | ''
      ? InterpolatedValuesNames<`${RawName}${Postfix}${Rest}`, Prefix, Postfix>
      : Name | InterpolatedValuesNames<Rest, Prefix, Postfix>
    : never
  : never;

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
  T extends string,
  Prefix extends string,
  Postfix extends string,
  Values extends Record<string, string | number>
> = T extends `${infer Start}${Prefix}${infer RawName}${Postfix}${infer Rest}`
  ? Trim<RawName> extends infer Name
    ? Name extends keyof Values
      ? `${Start}${Values[Name]}${InterpolateValues<
          Rest,
          Prefix,
          Postfix,
          Values
        >}`
      : `${Start}{{${InterpolateValues<
          `${RawName}}}${Rest}`,
          Prefix,
          Postfix,
          Values
        >}`
    : never
  : T;
