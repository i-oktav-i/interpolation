import { TrimRight } from './helpers';

type InterpolatedSelfClosingTagsNames<
  ResourceString extends string,
  Names extends string = never
> = ResourceString extends `${string}<${infer RawName}/>${infer Rest}`
  ? TrimRight<RawName> extends infer Name extends string
    ? Name extends `${string}${'<' | ' '}${string}` | ''
      ? InterpolatedSelfClosingTagsNames<`${RawName}/>${Rest}`, Names>
      : InterpolatedSelfClosingTagsNames<Rest, Names | Name>
    : never
  : Names;

type InterpolatedCommonTagsNames<
  ResourceString extends string,
  Names extends string = never
> = ResourceString extends `${string}<${infer RawName}>${infer RawTagRest}`
  ? RawName extends `${string}${'<' | ' '}${string}` | ''
    ? InterpolatedCommonTagsNames<`${RawName}>${RawTagRest}`, Names>
    : ResourceString extends `${string}<${RawName}>${string}</${RawName}>${infer Rest}`
    ? InterpolatedCommonTagsNames<Rest, Names | RawName>
    : InterpolatedCommonTagsNames<RawTagRest, Names>
  : Names;

export type InterpolatedTagsNames<ResourceString extends string> =
  | InterpolatedSelfClosingTagsNames<ResourceString>
  | InterpolatedCommonTagsNames<ResourceString>;

export type ReducedResourceToTagsNames<
  ReducedResource extends Record<string, string>
> = {
  [Key in keyof ReducedResource]: InterpolatedTagsNames<ReducedResource[Key]>;
};
