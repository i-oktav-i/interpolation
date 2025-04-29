export type GetConfigOptionValue<
  ParamKey extends keyof InterpolationTemplatesDefaultOptions
> = ParamKey extends infer Key extends keyof InterpolationTemplatesOptions
  ? InterpolationTemplatesOptions[Key]
  : InterpolationTemplatesDefaultOptions[ParamKey];

export type ForbiddenCharsInNamesOption =
  GetConfigOptionValue<'forbiddenCharsInNames'>;
