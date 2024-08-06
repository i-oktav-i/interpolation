import { InterpolateConditions } from './conditions';
import { EmptyObjectIfNever, Falsy, UnknownObject } from './helpers';
import { InterpolateValues } from './values';

type ToValuesObject<Keys extends string> = {
  [Key in Keys]: string | number;
};
type ToConditionsObject<Keys extends string> = {
  [Key in Keys]: unknown;
};
type ToFalsyOrValuesObject<Keys extends string> = {
  [Key in Keys]: Falsy<string | number>;
};

type ParamsValues<
  ValueKeys extends string,
  ConditionKeys extends string
> = ValueKeys & ConditionKeys extends infer KeysIntersection extends string
  ? EmptyObjectIfNever<ToValuesObject<Exclude<ValueKeys, KeysIntersection>>> &
      EmptyObjectIfNever<
        ToConditionsObject<Exclude<ConditionKeys, KeysIntersection>>
      > &
      EmptyObjectIfNever<ToFalsyOrValuesObject<KeysIntersection>>
  : never;

type InterpolationParamsValues<
  Key extends string,
  Reduced extends Record<string, string>,
  ValueNames extends Record<keyof Reduced, string>,
  ConditionNames extends Record<keyof Reduced, string>
> = Extract<Key, keyof Reduced> extends infer ReducedKey extends keyof Reduced
  ? [ReducedKey] extends [never]
    ? {}
    : [ValueNames[ReducedKey], ConditionNames[ReducedKey]] extends [
        infer TValueNames extends string,
        infer TConditionNames extends string
      ]
    ? ParamsValues<TValueNames, TConditionNames>
    : never
  : {};

type InterpolationParamsTags<
  Key extends string,
  Reduced extends Record<string, string>,
  TagsNames extends Record<keyof Reduced, string>,
  TagFunction extends (value: string) => any
> = Extract<Key, keyof Reduced> extends infer ReducedKey extends keyof Reduced
  ? [ReducedKey] extends [never]
    ? {}
    : [TagsNames[ReducedKey]] extends [infer TTagsNames extends string]
    ? Record<TTagsNames, TagFunction>
    : never
  : {};

type InterpolationParams<
  Key extends string,
  Reduced extends Record<string, string>,
  ValueNames extends Record<keyof Reduced, string>,
  ConditionNames extends Record<keyof Reduced, string>,
  TagsNames extends Record<keyof Reduced, string>,
  TagFunction extends (value: string) => any
> = [
  EmptyObjectIfNever<
    InterpolationParamsValues<Key, Reduced, ValueNames, ConditionNames>
  >,
  EmptyObjectIfNever<
    InterpolationParamsTags<Key, Reduced, TagsNames, TagFunction>
  >
] extends [
  infer TValues extends Record<string, any>,
  infer TTags extends Record<string, any>
]
  ? [keyof TValues | keyof TTags] extends [never]
    ? [params?: { values?: UnknownObject; tags?: UnknownObject }]
    : [keyof TValues] extends [never]
    ? [params: { values?: UnknownObject; tags: TTags & UnknownObject }]
    : [keyof TTags] extends [never]
    ? [params: { values: TValues & UnknownObject; tags?: UnknownObject }]
    : [params: { values: TValues & UnknownObject; tags: TTags & UnknownObject }]
  : never;

type InterpolationReturn<
  Key extends string,
  ReducedResource extends Record<string, string>,
  ValueNames extends Record<keyof ReducedResource, string>,
  ConditionNames extends Record<keyof ReducedResource, string>,
  TagsNames extends Record<keyof ReducedResource, string>,
  TagFunction extends (value: string) => any
> = Key extends keyof ReducedResource
  ? [TagsNames[Key]] extends [never]
    ? [ValueNames[Key] | ConditionNames[Key]] extends [never]
      ? ReducedResource[Key]
      : string
    : (string | ReturnType<TagFunction>)[]
  : null;

type InterpolationReturnEnhanced<
  Key extends string,
  ReducedResource extends Record<string, string>,
  ValueNames extends Record<keyof ReducedResource, string>,
  ConditionNames extends Record<keyof ReducedResource, string>,
  TagsNames extends Record<keyof ReducedResource, string>,
  TValuesPrefix extends string,
  TValuesPostfix extends string,
  TConditionsPrefix extends string,
  TConditionsPostfix extends string,
  TConditionsDelim extends string,
  TConditionsQuot extends string,
  TagFunction extends (value: string) => any,
  Params extends InterpolationParams<
    Key,
    ReducedResource,
    ValueNames,
    ConditionNames,
    TagsNames,
    TagFunction
  >
> = Key extends keyof ReducedResource
  ? [TagsNames[Key]] extends [never]
    ? [ValueNames[Key] | ConditionNames[Key]] extends [never]
      ? ReducedResource[Key]
      : InterpolateValues<
          InterpolateConditions<
            ReducedResource[Key],
            TConditionsPrefix,
            TConditionsPostfix,
            TConditionsDelim,
            TConditionsQuot,
            Params[0]['values']
          >,
          TValuesPrefix,
          TValuesPostfix,
          Params[0]['values']
        >
    : (string | ReturnType<TagFunction>)[]
  : null;

export interface InterpolationMethod<
  ReducedResource extends Record<string, string>,
  ValueNames extends Record<keyof ReducedResource, string>,
  ConditionNames extends Record<keyof ReducedResource, string>,
  TagsNames extends Record<keyof ReducedResource, string>,
  TagFunction extends (value: string) => any
> {
  <
    Key extends keyof ReducedResource | (string & {}),
    Params extends InterpolationParams<
      Key & string,
      ReducedResource,
      ValueNames,
      ConditionNames,
      TagsNames,
      TagFunction
    > = InterpolationParams<
      Key & string,
      ReducedResource,
      ValueNames,
      ConditionNames,
      TagsNames,
      TagFunction
    >
  >(
    key: Key,
    ...params: Params
  ): InterpolationReturn<
    Key & string,
    ReducedResource,
    ValueNames,
    ConditionNames,
    TagsNames,
    TagFunction
  >;
}

export interface InterpolationMethodEnhanced<
  ReducedResource extends Record<string, string>,
  ValueNames extends Record<keyof ReducedResource, string>,
  ConditionNames extends Record<keyof ReducedResource, string>,
  TagsNames extends Record<keyof ReducedResource, string>,
  TValuesPrefix extends string,
  TValuesPostfix extends string,
  TConditionsPrefix extends string,
  TConditionsPostfix extends string,
  TConditionsDelim extends string,
  TConditionsQuot extends string,
  TagFunction extends (value: string) => any
> {
  <
    Key extends keyof ReducedResource | (string & {}),
    const Params extends InterpolationParams<
      Key & string,
      ReducedResource,
      ValueNames,
      ConditionNames,
      TagsNames,
      TagFunction
    >
  >(
    key: Key,
    ...params: Params
  ): InterpolationReturnEnhanced<
    Key & string,
    ReducedResource,
    ValueNames,
    ConditionNames,
    TagsNames,
    TValuesPrefix,
    TValuesPostfix,
    TConditionsPrefix,
    TConditionsPostfix,
    TConditionsDelim,
    TConditionsQuot,
    TagFunction,
    Params
  >;
}
