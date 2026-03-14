import { escapeRegExp } from '../../utils/index.ts';
import type { Pipe, Value } from './interpolatedValuesAndPipes.ts';

export type GetValuesAndPipesRegExpParams = {
  prefix: string;
  postfix: string;
  pipesDelim: string;
  values: Record<string, Value>;
  pipes: Record<string, Pipe>;
};

export const getValuesAndPipesRegExp = ({
  values,
  pipes,
  postfix,
  prefix,
  pipesDelim,
}: GetValuesAndPipesRegExpParams) => {
  [prefix, postfix, pipesDelim] = [prefix, postfix, pipesDelim].map(
    escapeRegExp,
  );
  const valuesNames = Object.keys(values);
  const pipeNames = Object.keys(pipes);

  const valuesGroup = valuesNames.length
    ? `(${valuesNames.map(escapeRegExp).join('|')})`
    : `(?!)`;
  const pipesGroup = pipeNames.length
    ? `(?:${pipeNames.map(escapeRegExp).join('|')})`
    : `(?!)`;

  return new RegExp(
    `${prefix}\\s*${valuesGroup}((?:\\s*${pipesDelim}\\s*${pipesGroup})*)\\s*${postfix}`,
    'g',
  );
};

export const getPipesSplitterRegExp = (pipesDelim: string) =>
  new RegExp(`\\s*${escapeRegExp(pipesDelim)}\\s*`, 'g');
