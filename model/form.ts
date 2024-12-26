type FieldError = Record<string, string[]>;

export class FormError extends Error {
  constructor(private fieldErrors: FieldError) {
    super('');
  }

  public get fieldError(): Record<string, string> {
    return Object.entries(this.fieldErrors).reduce((acc, [key, errors]) => {
      return {
        ...acc,
        [key]: errors?.[0] ?? '',
      };
    }, {});
  }
}
