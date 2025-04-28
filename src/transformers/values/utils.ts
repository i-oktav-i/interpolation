import { escapeRegExp } from '../../utils';

export type GetValuesRegParams = {
  prefix: string;
  postfix: string;
  values: Record<string, string | number>;
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
