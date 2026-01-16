export default function deepMerge(target: any, source: any): any {
  const output = { ...target };
  if (typeof source === 'object') {
    for (const key in source) {
      if (source[key] instanceof Object) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }
  }
  return output;
}
