import { escapeRegExp } from '../../utils/index.ts';
import { type Value } from './interpolatedValues.ts';

export type GetValuesRegParams = {
  prefix: string;
  postfix: string;
  values: Record<string, Value>;
};

export const getValuesRegExp = ({
  values,
  postfix,
  prefix,
}: GetValuesRegParams) => {
  [prefix, postfix] = [prefix, postfix].map(escapeRegExp);
  const valuesGroup = `(${Object.keys(values).join('|')})`;

  return new RegExp(`${prefix}\\s*${valuesGroup}\\s*${postfix}`, 'g');
};
