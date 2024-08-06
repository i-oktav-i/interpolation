import { UnionToIntersection } from './helpers';

type AnyResourceOrString = AnyResource | string;
type AnyObjectResource = { [key: string]: AnyResourceOrString };
type AnyArrayResource = AnyResourceOrString[];

export type AnyResource = AnyObjectResource | AnyArrayResource;

type ValueKeys<Resource extends AnyResource> = Exclude<
  keyof Resource & string,
  keyof []
> extends infer Keys extends keyof Resource
  ? {
      [Key in Keys]: Resource[Key] extends string ? Key : never;
    }[Keys]
  : never;

type AddPrefix<Value extends string, Prefix extends string> = Prefix extends ''
  ? Value
  : `${Prefix}.${Value}`;

type ReduceValueKeys<
  Resource extends AnyResource,
  TValueKeys extends keyof Resource & string,
  Prefix extends string
> = {
  [Key in TValueKeys as AddPrefix<Key, Prefix>]: Resource[Key];
};

type ReduceNotValueKeys<
  Resource extends AnyResource,
  TNotValueKeys extends keyof Resource & string,
  Prefix extends string
> = UnionToIntersection<
  TNotValueKeys extends string
    ? Resource[TNotValueKeys] extends infer InnerResource extends AnyResource
      ? _ReduceKeys<InnerResource, AddPrefix<TNotValueKeys, Prefix>>
      : never
    : never
>;

type _ReduceKeys<
  Resource extends AnyResource,
  Prefix extends string
> = ValueKeys<Resource> extends infer TValueKeys extends keyof Resource & string
  ? ReduceValueKeys<Resource, TValueKeys, Prefix> &
      ReduceNotValueKeys<
        Resource,
        Exclude<keyof Resource & string, TValueKeys | keyof []>,
        Prefix
      >
  : never;

export type ReduceKeys<Resource extends AnyResource> = _ReduceKeys<
  Resource,
  ''
> extends infer Reduced extends Record<string, string>
  ? Reduced
  : never;

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
