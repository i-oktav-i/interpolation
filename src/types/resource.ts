export type AnyResourceOrString = AnyResource | string;
export type AnyObjectResource = { readonly [key: string]: AnyResourceOrString };
export type AnyArrayResource = readonly AnyResourceOrString[];

export type AnyResource = AnyObjectResource | AnyArrayResource;

export type GetResourceAllValues<T extends AnyResourceOrString> =
  T extends string
    ? T
    : GetResourceAllValues<
        T extends AnyObjectResource ? T[keyof T & string] : T[number]
      >;
