export type ExtractResult<
  Resource extends Record<string, string>,
  Key extends string
> = Key extends keyof Resource ? Resource[Key] : null;

export const extract = <
  Resource extends Record<string, string>,
  Key extends string
>(
  resource: Resource,
  key: Key
): ExtractResult<Resource, Key> => {
  return (key in resource ? resource[key] : null) as any;
};
