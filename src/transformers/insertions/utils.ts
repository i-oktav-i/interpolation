import { escapeRegExp } from '../../utils/index.ts';

export type GetInsertionRegExpParams = {
  prefix: string;
  postfix: string;
};

export const getInsertionRegExp = ({
  prefix,
  postfix,
}: GetInsertionRegExpParams): RegExp => {
  [prefix, postfix] = [prefix, postfix].map(escapeRegExp);

  return new RegExp(`${prefix}\\s*(.+?)\\s*${postfix}`, 'g');
};
