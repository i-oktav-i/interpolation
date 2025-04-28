import type {
  AnyObjectResource,
  AnyResource,
  AnyResourceOrString,
  FlattenResource,
} from './types.ts';

const isEmptyString = (value: string): value is '' => value === '';

const addPrefix = <Value extends string, Prefix extends string>(
  value: Value,
  prefix: Prefix
): Prefix extends '' ? Value : `${Prefix}.${Value}` =>
  (isEmptyString(prefix) ? value : `${prefix}.${value}`) as any;

type ArrayToObject<T extends unknown[]> = {
  [Key in Exclude<keyof T, keyof []> & string]: T[Key];
};

const arrayToObject = <T extends unknown[]>(array: T) =>
  Object(array) as ArrayToObject<T>;

const flattenResourceEntries = (
  resource: AnyResource,
  prefix = ''
): [string, string][] => {
  const objectResource: AnyObjectResource = Array.isArray(resource)
    ? arrayToObject(resource)
    : resource;

  return (
    Object.entries(objectResource) as [string, AnyResourceOrString][]
  ).flatMap(([key, value]) => {
    const currentPath = addPrefix(key, prefix);

    if (typeof value === 'string') return [[currentPath, value]] as const;

    return flattenResourceEntries(value, currentPath);
  });
};

export const flattenResource = <Resource extends AnyResource>(
  resource: Resource
) =>
  Object.fromEntries(
    flattenResourceEntries(resource)
  ) as FlattenResource<Resource>;
