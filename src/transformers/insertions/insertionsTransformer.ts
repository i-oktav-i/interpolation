import type { InterpolateInsertion } from './types.ts';
import { getInsertionRegExp } from './utils.ts';

export const insertionsTransformer = (
  resourceString: string,
  values: Record<string, string>,
  prefix: string,
  postfix: string
): string => {
  const insertionsRegExp = getInsertionRegExp({ prefix, postfix });

  return resourceString.replace(insertionsRegExp, (...match) => {
    const insertionName = match[1].trim();

    const insertion = values[insertionName];

    return insertion !== undefined
      ? insertionsTransformer(insertion, values, prefix, postfix)
      : match[0];
  });
};

export const typedInsertionsTransformer = insertionsTransformer as unknown as <
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  Values extends Record<string, string>
>(
  resourceString: ResourceString,
  values: Values,
  prefix: Prefix,
  postfix: Postfix
) => InterpolateInsertion<ResourceString, Prefix, Postfix, Values>;
