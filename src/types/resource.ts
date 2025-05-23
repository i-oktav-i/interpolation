export type AnyResourceOrString = AnyResource | string;
export type AnyObjectResource = { [key: string]: AnyResourceOrString };
export type AnyArrayResource = AnyResourceOrString[];

export type AnyResource = AnyObjectResource | AnyArrayResource;

export type GetResourceAllValues<T extends AnyResourceOrString> =
  T extends string
    ? T
    : GetResourceAllValues<
        T extends AnyObjectResource ? T[keyof T & string] : T[number]
      >;
