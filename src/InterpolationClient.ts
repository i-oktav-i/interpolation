import {
  AnyResource,
  InterpolateInsertionsToReducesResource,
  InterpolationMethodEnhanced,
  ReducedResourceToConditionNames,
  ReducedResourceToTagsNames,
  ReducedResourceToValueNames,
  ReduceKeys,
  ValidateResource,
} from './types';

type GetParamsValue<ParamKey extends keyof InterpoLationClientDefaultParams> =
  ParamKey extends infer Key extends keyof InterpoLationClientParams
    ? InterpoLationClientParams[Key]
    : InterpoLationClientDefaultParams[ParamKey];

type InterpoLationClientDefaultParams = {
  valuesPrefix: '{{';
  valuesPostfix: '}}';
  conditionsPrefix: '{{?';
  conditionsPostfix: '}}';
  conditionsDelim: '::';
  conditionsQuot: '"';
  insertionPrefix: '{{$';
  insertionPostfix: '}}';
};

interface InterpoLationClientParams {}

type CheckDefault<
  Key extends keyof InterpoLationClientDefaultParams,
  ProvidedValue extends string
> = ProvidedValue extends ''
  ? { [x in Key]: GetParamsValue<Key> }
  : string extends ProvidedValue
  ? { [x in Key]: GetParamsValue<Key> }
  : [InterpoLationClientDefaultParams[Key], ProvidedValue] extends [
      ProvidedValue,
      InterpoLationClientDefaultParams[Key]
    ]
  ? { [x in Key]?: ProvidedValue }
  : { [x in Key]: ProvidedValue };

export class InterpolationClient<
  Resource extends AnyResource,
  const ValuesPrefix extends string = GetParamsValue<'valuesPrefix'>,
  const ValuesPostfix extends string = GetParamsValue<'valuesPostfix'>,
  const ConditionsPrefix extends string = GetParamsValue<'conditionsPrefix'>,
  const ConditionsPostfix extends string = GetParamsValue<'conditionsPostfix'>,
  const ConditionsDelim extends string = GetParamsValue<'conditionsDelim'>,
  const ConditionsQuot extends string = GetParamsValue<'conditionsQuot'>,
  const InsertionPrefix extends string = GetParamsValue<'insertionPrefix'>,
  const InsertionPostfix extends string = GetParamsValue<'insertionPostfix'>,
  AllowAnyStrings extends boolean = false,
  ReducedResource extends Record<string, string> = ReduceKeys<Resource>,
  ReducedResourceWithInsertions extends Record<
    string,
    string
  > = InterpolateInsertionsToReducesResource<
    ReducedResource,
    InsertionPrefix,
    InsertionPostfix
  >,
  ValueNames extends Record<
    keyof ReducedResourceWithInsertions,
    string
  > = ReducedResourceToValueNames<
    ReducedResourceWithInsertions,
    ValuesPrefix,
    ValuesPostfix
  >,
  ConditionNames extends Record<
    keyof ReducedResourceWithInsertions,
    string
  > = ReducedResourceToConditionNames<
    ReducedResourceWithInsertions,
    ConditionsPrefix,
    ConditionsPostfix,
    ConditionsDelim,
    ConditionsQuot
  >,
  TagNames extends Record<
    keyof ReducedResourceWithInsertions,
    string
  > = ReducedResourceToTagsNames<ReducedResourceWithInsertions>
> {
  constructor({
    resource,
    valuesPrefix = '{{',
    valuesPostfix = '}}',
    conditionsPrefix = '{{?',
    conditionsPostfix = '}}',
    conditionsDelim = '::',
    conditionsQuot = '"',
    insertionPrefix = '{{$',
    insertionPostfix = '}}',
  }: {
    resource: ValidateResource<Resource, AllowAnyStrings>;
    allowAnyString?: AllowAnyStrings;
  } & CheckDefault<'valuesPrefix', ValuesPrefix> &
    CheckDefault<'valuesPostfix', ValuesPostfix> &
    CheckDefault<'conditionsPrefix', ConditionsPrefix> &
    CheckDefault<'conditionsPostfix', ConditionsPostfix> &
    CheckDefault<'conditionsDelim', ConditionsDelim> &
    CheckDefault<'conditionsQuot', ConditionsQuot> &
    CheckDefault<'insertionPrefix', InsertionPrefix> &
    CheckDefault<'insertionPostfix', InsertionPostfix>) {}
  // @ts-ignore
  interpolate: InterpolationMethodEnhanced<
    ReducedResourceWithInsertions,
    ValueNames,
    ConditionNames,
    TagNames,
    ValuesPrefix,
    ValuesPostfix,
    ConditionsPrefix,
    ConditionsPostfix,
    ConditionsDelim,
    ConditionsQuot,
    (value: string) => { value: string }
  >;
}
