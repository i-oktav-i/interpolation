import { TrimRight } from './helpers';

type InterpolatedSelfClosingTagsNames<T extends string> =
  T extends `${string}<${infer RawName}/>${infer Rest}`
    ? TrimRight<RawName> extends infer Name
      ? Name extends `${string}${'<' | ' '}${string}` | ''
        ? InterpolatedSelfClosingTagsNames<`${RawName}/>${Rest}`>
        : Name | InterpolatedSelfClosingTagsNames<Rest>
      : never
    : never;

type InterpolatedCommonTagsNames<T extends string> =
  T extends `${string}<${infer RawName}>${infer RawTagRest}`
    ? RawName extends `${string}${'<' | ' '}${string}` | ''
      ? InterpolatedCommonTagsNames<`${RawName}>${RawTagRest}`>
      : T extends `${string}<${RawName}>${string}</${RawName}>${infer Rest}`
      ? RawName | InterpolatedCommonTagsNames<Rest>
      : InterpolatedCommonTagsNames<RawTagRest>
    : never;

export type InterpolatedTagsNames<T extends string> =
  | InterpolatedSelfClosingTagsNames<T>
  | InterpolatedCommonTagsNames<T>;

export type ReducedResourceToTagsNames<
  ReducedResource extends Record<string, string>
> = {
  [Key in keyof ReducedResource]: InterpolatedTagsNames<ReducedResource[Key]>;
};
