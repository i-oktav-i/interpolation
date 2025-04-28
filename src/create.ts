import {
  type AnyResource,
  extract,
  type ExtractResult,
  flattenResource,
  type ValidateResource,
} from './resource/index.ts';
import {
  conditionsTransformer,
  type ConditionsTransformerParams,
  valuesTransformer,
  type ValuesTransformerParams,
} from './transformers/index.ts';

export const create = <
  const Resource extends [Resource] extends [infer U extends AnyResource]
    ? ValidateResource<U, AllowAnyStrings>
    : never,
  AllowAnyStrings extends boolean = false,
  ValuesPrefix extends string = '{{',
  ValuesPostfix extends string = '}}',
  ConditionsPrefix extends string = '{{?',
  ConditionsPostfix extends string = '}}',
  ConditionsDelim extends string = '::',
  ConditionsQuot extends string = '"'
>({
  resource,
  valuesPrefix = '{{' as ValuesPrefix,
  valuesPostfix = '}}' as ValuesPostfix,
  conditionsPrefix = '{{?' as ConditionsPrefix,
  conditionsPostfix = '}}' as ConditionsPostfix,
  conditionsDelim = '::' as ConditionsDelim,
  conditionsQuot = '"' as ConditionsQuot,
}: {
  resource: Resource;
  allowAnyString?: AllowAnyStrings;
  valuesPrefix?: ValuesPrefix;
  valuesPostfix?: ValuesPostfix;
  conditionsPrefix?: ConditionsPrefix;
  conditionsPostfix?: ConditionsPostfix;
  conditionsDelim?: ConditionsDelim;
  conditionsQuot?: ConditionsQuot;
}) => {
  const flatResource = flattenResource(resource);

  const interpolate = <
    Key extends (keyof typeof flatResource & string) | (string & {}),
    const Params extends ConditionsTransformerParams<
      TExtractResult,
      ConditionsPrefix,
      ConditionsPostfix,
      ConditionsDelim,
      ConditionsQuot
    > &
      ValuesTransformerParams<TExtractResult, ValuesPrefix, ValuesPostfix>,
    TExtractResult extends ExtractResult<typeof flatResource, Key>,
    const ParamsParam extends {} extends Params
      ? [params?: Params]
      : [params: Params]
  >(
    key: Key,
    ...[params]: ParamsParam
  ) => {
    const extractedResource = extract(flatResource, key);
    const interpolatedConditions = conditionsTransformer(
      extractedResource,
      params?.values as NonNullable<ParamsParam[0]>['values'],
      conditionsPrefix,
      conditionsPostfix,
      conditionsDelim,
      conditionsQuot
    );
    const interpolatedValues = valuesTransformer(
      interpolatedConditions,
      params?.values as NonNullable<ParamsParam[0]>['values'],
      valuesPrefix,
      valuesPostfix
    );
    return interpolatedValues;
  };

  return {
    resource: flatResource,
    interpolate,
  };
};
