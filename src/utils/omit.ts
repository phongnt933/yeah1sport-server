/* eslint-disable @typescript-eslint/no-dynamic-delete */
export const omitIsNil = (
  obj: any = {},
  options: { deep?: boolean; undefinedAsNull?: boolean; emptyObject?: boolean },
): any => {
  const deep = options.deep ?? false;
  const undefinedAsNull = options.undefinedAsNull ?? false;
  const emptyObject = options.emptyObject ?? false;

  Object.keys(obj).forEach((key) => {
    if (
      obj[key] == null ||
      (undefinedAsNull && obj[key] === undefined) ||
      (emptyObject && Object.keys(obj[key]).length === 0)
    ) {
      delete obj[key];
    }
  });

  if (deep) {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object') {
        omitIsNil(obj[key], { deep: true });
      }
    });
  }

  return obj;
};
