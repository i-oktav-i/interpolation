export type GetConfigOptionValue<
  ParamKey extends keyof InterpolationTemplatesDefaultOptions,
> = ParamKey extends infer Key extends keyof InterpolationTemplatesOptions
  ? InterpolationTemplatesOptions[Key]
  : InterpolationTemplatesDefaultOptions[ParamKey];

export type ForbiddenCharsInNamesOption =
  GetConfigOptionValue<'forbiddenCharsInNames'>;

export type ValidateOptionParameter<
  Key extends keyof InterpolationTemplatesDefaultOptions,
  ProvidedValue extends string,
  IsProvidedEmptyString = ProvidedValue extends '' ? true : false,
  IsProvidedStringPrimitive = string extends ProvidedValue ? true : false,
  IsProvidedDefaultValue = [
    InterpolationTemplatesDefaultOptions[Key],
    ProvidedValue,
  ] extends [ProvidedValue, InterpolationTemplatesDefaultOptions[Key]]
    ? true
    : false,
> = true extends IsProvidedEmptyString | IsProvidedStringPrimitive
  ? { [x in Key]: GetConfigOptionValue<Key> }
  : IsProvidedDefaultValue extends true
    ? { [x in Key]?: ProvidedValue }
    : { [x in Key]: ProvidedValue };
