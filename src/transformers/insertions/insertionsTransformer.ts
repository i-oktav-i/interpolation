import type { InterpolateInsertion } from './types.ts';
import { getInsertionRegExp } from './utils.ts';

export const insertionsTransformer = <
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Values extends Record<string, string>
>(
  resourceString: ResourceString,
  values: Values,
  prefix: Prefix,
  postfix: Postfix
): InterpolateInsertion<ResourceString, Prefix, Postfix, Values> => {
  const insertionsRegExp = getInsertionRegExp({ prefix, postfix });

  return resourceString.replace(insertionsRegExp, (...match) => {
    const insertionName = match[1].trim();

    const insertion = values[insertionName];

    return insertion !== undefined
      ? insertionsTransformer(insertion, values, prefix, postfix)
      : match[0];
  }) as any;
};
