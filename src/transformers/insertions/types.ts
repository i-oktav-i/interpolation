import type { Trim } from '../../types/index.ts';

export type InterpolatedInsertionNames<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Paths extends string = never
> = ResourceString extends `${string}${Prefix}${infer RawPath}${Postfix}${infer Rest}`
  ? Trim<RawPath> extends infer Path extends string
    ? Path extends `${string} ${string}` | ''
      ? InterpolatedInsertionNames<
          `${RawPath}${Postfix}${Rest}`,
          Prefix,
          Postfix,
          Paths
        >
      : InterpolatedInsertionNames<Rest, Prefix, Postfix, Paths | Path>
    : never
  : Paths;

export type InterpolateInsertion<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  ReducedResource extends Record<string, string>,
  ResultStart extends string = ''
> = ResourceString extends `${infer Start}${Prefix}${infer RawResourcePath}${Postfix}${infer Rest}`
  ? Trim<RawResourcePath> extends infer ResourcePath extends keyof ReducedResource
    ? InterpolateInsertion<
        Rest,
        Prefix,
        Postfix,
        ReducedResource,
        InterpolateInsertion<
          InterpolateInsertion<
            ReducedResource[ResourcePath],
            Prefix,
            Postfix,
            ReducedResource
          >,
          Prefix,
          Postfix,
          ReducedResource,
          `${ResultStart}${Start}`
        >
      >
    : InterpolateInsertion<
        `${RawResourcePath}${Postfix}${Rest}`,
        Prefix,
        Postfix,
        ReducedResource,
        `${ResultStart}${Start}${Prefix}`
      >
  : `${ResultStart}${ResourceString}`;
