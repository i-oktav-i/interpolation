import { Prettify, UnionToIntersection } from './helpers';

type AnyResourceOrString = AnyResource | string;
type AnyObjectResource = { [key: string]: AnyResourceOrString };
type AnyArrayResource = AnyResourceOrString[];

export type AnyResource = AnyObjectResource | AnyArrayResource;

type AddPrefix<Value extends string, Prefix extends string> = Prefix extends ''
  ? Value
  : `${Prefix}.${Value}`;

type _ReduceKeys<
  Resource extends AnyResource,
  Path extends string
> = UnionToIntersection<
  Exclude<keyof Resource, keyof []> extends infer Keys extends keyof Resource &
    string
    ? Keys extends string
      ? AddPrefix<Keys, Path> extends infer NextPath extends string
        ? Resource[Keys] extends string
          ? { [x in NextPath]: Resource[Keys] }
          : Resource[Keys] extends AnyResource
          ? _ReduceKeys<Resource[Keys], NextPath>
          : never
        : never
      : never
    : never
>;

export type ReduceKeys<Resource extends AnyResource> = Prettify<
  _ReduceKeys<Resource, ''> extends infer Reduced extends Record<string, string>
    ? Reduced
    : never
>;

/**
 * Проверяет элементы массива на допустимые значения локали.
 * Если элемент не соответствует, устанавливает его значение в never
 *
 * @example
 * type Validated = ValidateArray<[
 *    string,
 *    string[],
 *    'value',
 *    { wrongValue: string },
 * ]>;
 *
 * type EqualsTo = [
 *    never,
 *    never,
 *    'value',
 *    { wrongValue: never },
 * ];
 */
type ValidateArrayValues<
  ArrayResource extends AnyArrayResource,
  AllowString extends boolean
> = ArrayResource extends readonly [
  infer First extends AnyResourceOrString,
  ...infer Rest extends AnyArrayResource
]
  ? readonly [
      _ValidateResource<First, AllowString>,
      ...ValidateArrayValues<Rest, AllowString>
    ]
  : [];

/**
 * Проверяет что массив конечной длинны и все его элементы
 *
 * @example
 *
 * type Validated = ValidateArray<string[]>
 * type EqualsTo = never
 *
 * // ==================
 *
 * type Validated = ValidateArray<[
 *    string,
 *    string[],
 *    'value',
 *    { wrongValue: string },
 * ]>;
 *
 * type EqualsTo = [
 *    never,
 *    never,
 *    'value',
 *    { wrongValue: never },
 * ];
 */
type ValidateArray<
  ArrayResource extends AnyArrayResource,
  AllowString extends boolean
> = number extends ArrayResource['length']
  ? never
  : ValidateArrayValues<ArrayResource, AllowString>;

/**
 * Проверяет значение ключей на допустимые значения локали.
 * Не соответствующие значения устанавливаются в never
 *
 * @example
 * type Validated = ValidateObject<{
 *    wrongValue: string;
 *    value: 'value';
 *    array: string[];
 * }>;
 *
 * type EqualsTo = {
 *    wrongValue: never;
 *    value: 'value';
 *    array: never;
 * };
 */
type ValidateObject<
  ObjectResource extends AnyObjectResource,
  AllowString extends boolean
> = {
  [Key in keyof ObjectResource]: _ValidateResource<
    ObjectResource[Key],
    AllowString
  >;
};

/**
 * Глубоко проверяет локаль на допустимые значения.
 *
 * @example
 * type Validated = ValidateResource<{
 *   value: 'value';
 *   wrongValue: string;
 *   wrongArray: string[];
 *   array: [
 *     'value',
 *     string,
 *     string[],
 *     {
 *       wrongValue: string;
 *       value: 'value';
 *     }
 *   ];
 * }>
 *
 * type EqualsTo = {
 *   value: 'value';
 *   wrongValue: never;
 *   wrongArray: never;
 *   array: [
 *     "value",
 *     never,
 *     never,
 *     {
 *        wrongValue: never;
 *        value: 'value';
 *     }
 *   ];
 * }
 */
type _ValidateResource<
  Resource extends AnyResourceOrString,
  AllowString extends boolean = false
> = Resource extends string
  ? [string, AllowString] extends [Resource, false]
    ? never
    : Resource
  : Resource extends AnyArrayResource
  ? ValidateArray<Resource, AllowString>
  : Resource extends AnyObjectResource
  ? ValidateObject<Resource, AllowString>
  : never;

export type ValidateResource<
  Resource extends AnyResource,
  AllowString extends boolean = false
> = _ValidateResource<Resource, AllowString>;
