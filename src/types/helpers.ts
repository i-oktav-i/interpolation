export type TrimLeft<Value extends string> =
  Value extends ` ${infer TrimmedLeft}` ? TrimLeft<TrimmedLeft> : Value;
export type TrimRight<Value extends string> =
  Value extends `${infer TrimmedRight} ` ? TrimRight<TrimmedRight> : Value;
export type Trim<Value extends string> = TrimLeft<TrimRight<Value>>;

export type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type FalsyValue = undefined | null | false;

export type Falsy<T = never> = T | FalsyValue;

export type AnyObject = Record<string, any>;
export type UnknownObject = Record<string, unknown>;
export type EmptyObject = Record<string, never>;

export type EmptyObjectIfNever<T extends UnknownObject> = [T] extends [never]
  ? {}
  : T;

export type TupleToString<T extends (number | string)[]> = T extends [
  infer First extends number | string,
  ...infer Rest extends (number | string)[]
]
  ? `${First}${TupleToString<Rest>}`
  : '';

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type ForbiddenCharsInNames = ' ' | '.';
