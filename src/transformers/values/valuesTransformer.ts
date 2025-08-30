import type {
  InterpolatedValuesNames,
  InterpolateValues,
  Value,
} from './interpolatedValues.ts';
import { getValuesRegExp } from './utils.ts';

export type ValuesTransformerParams<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string
> = InterpolatedValuesNames<
  ResourceString,
  Prefix,
  Postfix
> extends infer U extends string
  ? [U] extends [never]
    ? { values?: {} }
    : {
        values: Record<U, Value>;
      }
  : never;

export const valuesTransformer = (
  resourceString: string,
  params: Record<string, Value>,
  prefix: string,
  postfix: string
) => {
  const valuesRegExp = getValuesRegExp({ values: params, prefix, postfix });

  return resourceString.replace(valuesRegExp, (...match) => {
    const valueName = match[1];
    const value = params[valueName];

    return String(value);
  });
};

export const typedValuesTransformer = valuesTransformer as <
  ResourceString extends string,
  const Params extends Record<string, Value>,
  Prefix extends string,
  Postfix extends string
>(
  resourceString: ResourceString,
  params: Params,
  prefix: Prefix,
  postfix: Postfix
) => InterpolateValues<ResourceString, Prefix, Postfix, Params>;
