export default function safeParse<T = any>(str: string, defaultValue: any): T {
  try {
    return JSON.parse(str) as T;
  } catch (e) {
    return defaultValue;
  }
}
