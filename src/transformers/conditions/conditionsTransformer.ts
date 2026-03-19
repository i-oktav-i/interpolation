import type {
  InterpolateConditions,
  InterpolatedConditionsNames,
} from './interpolatedConditions.ts';

import { getConditionsRegExp } from './utils.ts';

export type ConditionsTransformerParams<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string = '"',
> =
  InterpolatedConditionsNames<
    ResourceString,
    Prefix,
    Postfix,
    Delim,
    Quot
  > extends infer U extends string
    ? [U] extends [never]
      ? { values?: {} }
      : {
          values: Record<U, unknown>;
        }
    : never;

export const conditionsTransformer = (
  resourceString: string,
  params: Record<string, unknown>,
  prefix: string,
  postfix: string,
  delim: string,
  quot: string = '"',
) => {
  const conditionsRegExp = getConditionsRegExp({
    conditions: params,
    delim,
    postfix,
    prefix,
    quot,
  });

  return resourceString.replace(conditionsRegExp, (...match) => {
    const negate = match[1] === '!';
    const conditionName = match[2];
    const ifTrue = match[3];
    const ifFalse = match[4];

    return Boolean(params[conditionName]) === negate ? ifFalse : ifTrue;
  });
};

export const typedConditionsTransformer = conditionsTransformer as <
  ResourceString extends string,
  Params extends Record<string, any>,
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string = '"',
>(
  resourceString: ResourceString,
  params: Params,
  prefix: Prefix,
  postfix: Postfix,
  delim: Delim,
  quot: Quot,
) => InterpolateConditions<
  ResourceString,
  Prefix,
  Postfix,
  Delim,
  Quot,
  Params
>;
