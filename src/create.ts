import {
  extract,
  type ExtractResult,
  flattenResource,
  type ValidateResource,
} from './resource/index.ts';
import {
  conditionsTransformer,
  type ConditionsTransformerParams,
  type GetAllPipesNames,
  insertionsTransformer,
  type InterpolateConditions,
  type InterpolateInsertion,
  type InterpolateValuesAndPipes,
  type PipesParam,
  valuesAndPipesTransformer,
  type ValuesAndPipesTransformerParams,
} from './transformers/index.ts';
import { type AnyResource } from './types/resource.ts';

export const create = <
  const Resource extends ValidateResource<
    Resource,
    AllowAnyStrings
  > extends infer U extends AnyResource
    ? U
    : never,
  AllowAnyStrings extends boolean = false,
  ValuesPrefix extends string = '{{',
  ValuesPostfix extends string = '}}',
  PipesDelim extends string = '|',
  ConditionsPrefix extends string = '{{?',
  ConditionsPostfix extends string = '}}',
  ConditionsDelim extends string = '::',
  ConditionsQuot extends string = '"',
  InsertionsPrefix extends string = '{{>',
  InsertionsPostfix extends string = '}}',
  PipeName extends string = GetAllPipesNames<
    Resource,
    ValuesPrefix,
    ValuesPostfix,
    PipesDelim
  > extends infer U extends string
    ? U
    : never
>({
  resource,
  valuesPrefix = '{{' as ValuesPrefix,
  valuesPostfix = '}}' as ValuesPostfix,
  pipesDelim = '|' as PipesDelim,
  conditionsPrefix = '{{?' as ConditionsPrefix,
  conditionsPostfix = '}}' as ConditionsPostfix,
  conditionsDelim = '::' as ConditionsDelim,
  conditionsQuot = '"' as ConditionsQuot,
  insertionsPrefix = '{{>' as InsertionsPrefix,
  insertionsPostfix = '}}' as InsertionsPostfix,
  pipes = {},
}: {
  resource: Resource;
  allowAnyString?: AllowAnyStrings;
  valuesPrefix?: ValuesPrefix;
  valuesPostfix?: ValuesPostfix;
  pipesDelim?: PipesDelim;
  conditionsPrefix?: ConditionsPrefix;
  conditionsPostfix?: ConditionsPostfix;
  conditionsDelim?: ConditionsDelim;
  conditionsQuot?: ConditionsQuot;
  insertionsPrefix?: InsertionsPrefix;
  insertionsPostfix?: InsertionsPostfix;
} & PipesParam<PipeName>) => {
  const flatResource = flattenResource(resource);

  const interpolate = <
    Key extends (keyof typeof flatResource & string) | (string & {}),
    const Params extends ConditionsTransformerParams<
      InsertionsTransformerResult,
      ConditionsPrefix,
      ConditionsPostfix,
      ConditionsDelim,
      ConditionsQuot
    > &
      ValuesAndPipesTransformerParams<
        InsertionsTransformerResult,
        ValuesPrefix,
        ValuesPostfix,
        PipesDelim
      >,
    const ParamsParam extends {} extends Params
      ? [params?: Params]
      : [params: Params],
    TExtractResult extends string | null = ExtractResult<
      typeof flatResource,
      Key
    >,
    Template extends string = TExtractResult extends string
      ? TExtractResult
      : never,
    InsertionsTransformerResult extends string = InterpolateInsertion<
      Template,
      InsertionsPrefix,
      InsertionsPostfix,
      typeof flatResource
    >,
    ConditionsTransformerResult extends string = InterpolateConditions<
      InsertionsTransformerResult,
      ConditionsPrefix,
      ConditionsPostfix,
      ConditionsDelim,
      ConditionsQuot,
      NonNullable<ParamsParam[0]>['values']
    >,
    ValuesAndPipesTransformerResult extends string = InterpolateValuesAndPipes<
      ConditionsTransformerResult,
      ValuesPrefix,
      ValuesPostfix,
      PipesDelim,
      NonNullable<ParamsParam[0]>['values'],
      PipeName
    >
  >(
    key: Key,
    ...[params]: ParamsParam
  ): TExtractResult extends string
    ? ValuesAndPipesTransformerResult
    : TExtractResult => {
    const extractedResource = extract(flatResource, key);

    if (!extractedResource) return extractedResource as any;

    const interpolatedInsertions = insertionsTransformer(
      extractedResource,
      flatResource,
      insertionsPrefix,
      insertionsPostfix
    );

    if (!params?.values) return interpolatedInsertions as any;

    const interpolatedConditions = conditionsTransformer(
      interpolatedInsertions,
      params?.values as NonNullable<ParamsParam[0]>['values'],
      conditionsPrefix,
      conditionsPostfix,
      conditionsDelim,
      conditionsQuot
    );

    const interpolatedValues = valuesAndPipesTransformer(
      interpolatedConditions,
      params?.values as NonNullable<ParamsParam[0]>['values'],
      pipes,
      valuesPrefix,
      valuesPostfix,
      pipesDelim
    );

    return interpolatedValues as any;
  };

  return {
    resource: flatResource,
    interpolate,
  };
};
