import { escapeRegExp } from '../../utils/index.ts';

export type GetConditionsRegParams = {
  prefix: string;
  postfix: string;
  delim: string;
  quot: string;
  conditions: Record<string, unknown>;
};

export const getConditionsRegExp = ({
  conditions,
  prefix,
  postfix,
  delim,
  quot,
}: GetConditionsRegParams) => {
  [prefix, postfix, delim, quot] = [prefix, postfix, delim, quot].map(
    escapeRegExp,
  );

  const conditionsGroup = `(${Object.keys(conditions).join('|')})`;

  const conditionsBranch = `${quot}([^${quot}]*)${quot}`;

  return new RegExp(
    `${prefix}\\s*(!|)${conditionsGroup}\\s*${conditionsBranch}\\s*${delim}\\s*${conditionsBranch}\\s*${postfix}`,
    'g',
  );
};
