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

type AnyParams = ConditionsTransformerParams<any, any, any, any> &
  ValuesAndPipesTransformerParams<any, any, any, any>;

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
    const ParamsParam extends TConditionsTransformerParams &
      TValuesAndPipesTransformerParams extends infer ParamsParams extends AnyParams
      ? {} extends ParamsParams
        ? [params?: ParamsParams]
        : [params: ParamsParams]
      : never,
    TExtractResult extends ExtractResult<typeof flatResource, Key>,
    Template extends TExtractResult extends string ? TExtractResult : never,
    InsertionsTransformerResult extends InterpolateInsertion<
      Template,
      InsertionsPrefix,
      InsertionsPostfix,
      typeof flatResource
    >,
    ConditionsTransformerResult extends InsertionsTransformerResult extends infer U extends string
      ? InterpolateConditions<
          U,
          ConditionsPrefix,
          ConditionsPostfix,
          ConditionsDelim,
          ConditionsQuot,
          NonNullable<NonNullable<ParamsParam[0]>['values']>
        >
      : never,
    ValuesAndPipesTransformerResult extends ConditionsTransformerResult extends infer U extends string
      ? InterpolateValuesAndPipes<
          U,
          ValuesPrefix,
          ValuesPostfix,
          PipesDelim,
          NonNullable<NonNullable<ParamsParam[0]>['values']>,
          PipeName
        >
      : never,
    TConditionsTransformerParams extends ConditionsTransformerParams<
      InsertionsTransformerResult,
      ConditionsPrefix,
      ConditionsPostfix,
      ConditionsDelim,
      ConditionsQuot
    >,
    TValuesAndPipesTransformerParams extends ValuesAndPipesTransformerParams<
      ConditionsTransformerResult,
      ValuesPrefix,
      ValuesPostfix,
      PipesDelim
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
      params.values,
      conditionsPrefix,
      conditionsPostfix,
      conditionsDelim,
      conditionsQuot
    );

    const interpolatedValues = valuesAndPipesTransformer(
      interpolatedConditions,
      params.values,
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
