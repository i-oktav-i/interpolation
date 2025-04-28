import {
  InterpolateConditions,
  InterpolatedConditionsNames,
} from './interpolatedConditions';

import { getConditionsRegExp } from './utils';

export type ConditionsTransformerParams<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string = '"'
> = InterpolatedConditionsNames<
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

export const conditionsTransformer = <
  ResourceString extends string,
  Params extends Record<string, any>,
  Prefix extends string,
  Postfix extends string,
  Delim extends string,
  Quot extends string = '"'
>(
  resourceString: ResourceString,
  params: Params,
  prefix: Prefix,
  postfix: Postfix,
  delim: Delim,
  quot: Quot = '"' as Quot
): InterpolateConditions<
  ResourceString,
  Prefix,
  Postfix,
  Delim,
  Quot,
  Params
> => {
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
  }) as any;
};
