import type {
  InterpolatedValuesNames,
  InterpolateValuesAndPipes,
  Pipe,
  Value,
} from './interpolatedValuesAndPipes.ts';
import { getPipesSplitterRegExp, getValuesAndPipesRegExp } from './utils.ts';

export type ValuesAndPipesTransformerParams<
  ResourceString extends string,
  Prefix extends string,
  Postfix extends string,
  PipesDelim extends string
> = InterpolatedValuesNames<
  ResourceString,
  Prefix,
  Postfix,
  PipesDelim
> extends infer U extends string
  ? [U] extends [never]
    ? { values?: {} }
    : {
        values: Record<U, Value>;
      }
  : never;

export const valuesAndPipesTransformer = (
  resourceString: string,
  params: Record<string, Value>,
  pipes: Record<string, Pipe>,
  prefix: string,
  postfix: string,
  pipesDelim: string
) => {
  const valuesRegExp = getValuesAndPipesRegExp({
    values: params,
    prefix,
    postfix,
    pipesDelim,
    pipes,
  });

  return resourceString.replace(valuesRegExp, (...match) => {
    const valueName = match[1];
    const value = params[valueName];

    const pipesExpression = match[2] as string;

    if (!pipesExpression) return String(value);

    const [, ...pipesNames] = pipesExpression.split(
      getPipesSplitterRegExp(pipesDelim)
    );

    const transformedValue = pipesNames.reduce((memo, pipeName) => {
      const pipe = pipes[pipeName];

      return pipe(memo);
    }, value);

    return String(transformedValue);
  });
};

export const typedValuesAndPipesTransformer = valuesAndPipesTransformer as <
  ResourceString extends string,
  Params extends Record<string, Value>,
  Pipes extends Record<string, Pipe>,
  Prefix extends string,
  Postfix extends string,
  PipesDelim extends string
>(
  resourceString: ResourceString,
  params: Params,
  pipes: Pipes,
  prefix: Prefix,
  postfix: Postfix,
  pipesDelim: PipesDelim
) => InterpolateValuesAndPipes<
  ResourceString,
  Prefix,
  Postfix,
  PipesDelim,
  Params,
  keyof Pipes & string
>;
