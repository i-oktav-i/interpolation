import type { ForbiddenCharsInNamesOption } from './options.ts';

export type TrimLeft<Value extends string> =
  Value extends ` ${infer TrimmedLeft}` ? TrimLeft<TrimmedLeft> : Value;
export type TrimRight<Value extends string> =
  Value extends `${infer TrimmedRight} ` ? TrimRight<TrimmedRight> : Value;
export type Trim<Value extends string> = TrimLeft<TrimRight<Value>>;

export type UnionToIntersection<
  Union,
  UnionAsFunctionsArguments = Union extends unknown
    ? (k: Union) => void
    : never,
  IntersectionOfUnionItems = [UnionAsFunctionsArguments] extends [
    (k: infer I) => void,
  ]
    ? I
    : never,
  Result = [Union] extends [never] ? never : IntersectionOfUnionItems,
> = Result;

export type OneOfUnion<
  Union,
  UnionAsFunctionsReturnType = Union extends unknown ? () => Union : never,
  FunctionsIntersection = UnionToIntersection<UnionAsFunctionsReturnType>,
  UnionElement = FunctionsIntersection extends (() => infer R extends Union)
    ? R
    : never,
> = UnionElement;

type AnyKey = string | number | symbol;

type AllKeys<Union> = Union extends unknown ? keyof Union : never;
type GetAllKeyTypes<Union, TKey extends AnyKey> = Union extends {
  [key in TKey]: infer TValue;
}
  ? TValue
  : never;

export type MergeUnion<Union> = {
  [Key in AllKeys<Union>]: GetAllKeyTypes<Union, Key>;
};

type FalsyValue = undefined | null | false;

export type Falsy<T = never> = T | FalsyValue;

export type AnyObject = Record<string, any>;
export type UnknownObject = Record<string, unknown>;
export type EmptyObject = Record<string, never>;

export type EmptyObjectIfNever<T extends UnknownObject> = [T] extends [never]
  ? {}
  : T;

type TextValue = string | number;

export type Join<
  TTuple extends TextValue[],
  Delim extends string = '',
  Result extends string = '',
  CurrentDelim extends string = Result extends '' ? '' : Delim,
  First extends TextValue = TTuple extends [infer First, ...TextValue[]]
    ? First
    : never,
  Rest extends TextValue[] = TTuple extends [First, ...infer Rest]
    ? Rest
    : never,
> = number extends TTuple['length']
  ? string
  : [First] extends [never]
    ? Result
    : Join<Rest, Delim, `${Result}${CurrentDelim}${First}`>;

export type Prettify<T> = T extends object
  ? { [K in keyof T]: Prettify<T[K]> }
  : T;

export type TupleOf<
  T,
  Length extends number,
  Buff extends T[] = [],
> = Buff['length'] extends Length ? Buff : TupleOf<T, Length, [T, ...Buff]>;

type Enumerate<
  T extends number,
  Buff extends number[] = [],
> = Buff['length'] extends T
  ? Buff[number]
  : Enumerate<T, [...Buff, Buff['length']]>;

export type Range<
  RangeStartOfEnd extends number,
  RangeEnd extends number = never,
> = [RangeEnd] extends [never]
  ? Enumerate<RangeStartOfEnd>
  : Exclude<Enumerate<RangeEnd>, Enumerate<RangeStartOfEnd>>;

export type CheckName<Name extends string> = Name extends
  | `${string}${ForbiddenCharsInNamesOption}${string}`
  | ''
  ? false
  : true;

export type Split<
  T extends string,
  Delim extends string,
  Result extends string = never,
> = T extends `${infer First}${Delim}${infer Rest}`
  ? Split<Rest, Delim, Result | First>
  : Result | T;
