export type Registry = Record<string, unknown>;
type Token = { $value: string | number; unit?: string };
export function resolveTokens(registry: Registry): Record<string, string> {
  const all: Record<string, Token> = Object.assign(
    {},
    registry.primitive,
    registry.semantic,
    registry.component,
  );
  const resolved: Record<string, string> = {};
  function get(key: string, seen: string[] = []): string {
    if (seen.includes(key)) throw new Error(`Cyclic token: ${key}`);
    const token = all[key];
    if (!token) throw new Error(`Unknown token: ${key}`);
    const value = token.$value;
    return typeof value === "string" && value.startsWith("{")
      ? get(value.slice(1, -1), [...seen, key])
      : `${value}${token.unit ?? ""}`;
  }
  for (const key of Object.keys(all)) resolved[key] = get(key);
  return resolved;
}
