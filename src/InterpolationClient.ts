import {
  AnyResource,
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
  conditionsPostfix: '{{';
  conditionsDelim: '::';
  conditionsQuot: '"';
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
  AllowAnyStrings extends boolean = false,
  ReducedResource extends ReduceKeys<Resource> = ReduceKeys<Resource>,
  ValueNames extends ReducedResourceToValueNames<
    ReducedResource,
    ValuesPrefix,
    ValuesPostfix
  > = ReducedResourceToValueNames<ReducedResource, ValuesPrefix, ValuesPostfix>,
  ConditionNames extends ReducedResourceToConditionNames<
    ReducedResource,
    ConditionsPrefix,
    ConditionsPostfix,
    ConditionsDelim,
    ConditionsQuot
  > = ReducedResourceToConditionNames<
    ReducedResource,
    ConditionsPrefix,
    ConditionsPostfix,
    ConditionsDelim,
    ConditionsQuot
  >,
  TagNames extends ReducedResourceToTagsNames<ReducedResource> = ReducedResourceToTagsNames<ReducedResource>
> {
  constructor({
    resource,
    valuesPrefix = '{{' as any,
    valuesPostfix = '}}' as any,
    conditionsPrefix = '{{?' as any,
    conditionsPostfix = valuesPostfix as any,
    conditionsDelim = '::' as any,
    conditionsQuot = '"' as any,
  }: {
    resource: ValidateResource<Resource, AllowAnyStrings>;
    allowAnyString?: AllowAnyStrings;
  } & CheckDefault<'valuesPrefix', ValuesPrefix> &
    CheckDefault<'valuesPostfix', ValuesPostfix> &
    CheckDefault<'conditionsPrefix', ConditionsPrefix> &
    CheckDefault<'conditionsPostfix', ConditionsPostfix> &
    CheckDefault<'conditionsDelim', ConditionsDelim> &
    CheckDefault<'conditionsQuot', ConditionsQuot>) {}
  // @ts-ignore
  interpolate: InterpolationMethodEnhanced<
    ReducedResource,
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
