type IFilter = Record<string, any>;
export const parseFilters = (filters: IFilter = {}): IFilter => {
  const parsedFilters: IFilter = {};

  Object.keys(filters).forEach((key) => {
    if (typeof filters[key] === 'string') {
      parsedFilters[key] = new RegExp(filters[key], 'i');
    } else {
      parsedFilters[key] = filters[key];
    }
  });

  return parsedFilters;
};
