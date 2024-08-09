import { Trim } from './helpers';

export type InterpolatedInsertionNames<
  T extends string,
  Prefix extends string,
  Postfix extends string
> = T extends `${string}${Prefix}${infer RawName}${Postfix}${infer Rest}`
  ? Trim<RawName> extends infer Name
    ? Name extends `${string} ${string}` | ''
      ? InterpolatedInsertionNames<
          `${RawName}${Postfix}${Rest}`,
          Prefix,
          Postfix
        >
      : Name | InterpolatedInsertionNames<Rest, Prefix, Postfix>
    : never
  : never;

export type InterpolateInsertion<
  T extends string,
  Prefix extends string,
  Postfix extends string,
  ReducedResource extends Record<string, string>
> = T extends `${infer Start}${Prefix}${infer RawName}${Postfix}${infer Rest}`
  ? Trim<RawName> extends infer Name extends keyof ReducedResource
    ? `${Start}${InterpolateInsertion<
        ReducedResource[Name],
        Prefix,
        Postfix,
        ReducedResource
      >}${InterpolateInsertion<Rest, Prefix, Postfix, ReducedResource>}`
    : `${Start}{{${InterpolateInsertion<
        `${RawName}}}${Rest}`,
        Prefix,
        Postfix,
        ReducedResource
      >}`
  : T;
