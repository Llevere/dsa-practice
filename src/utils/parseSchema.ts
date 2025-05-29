export type ParsedTable = {
  tableName: string;
  columns: { name: string; type: string }[];
};

export function parseSchemaStatements(schema: string[]): ParsedTable[] {
  const results: ParsedTable[] = [];

  for (const statement of schema) {
    const match = statement.match(
      /create table if not exists (\w+)\s*\((.+)\)/i
    );
    if (!match) continue;

    const tableName = match[1];
    const columnsRaw = match[2];

    const columns = columnsRaw
      .split(",")
      .map((col) => col.trim())
      .map((col) => {
        const [name, typeRaw] = col.split(/\s+/, 2);
        const type = typeRaw?.toLowerCase().replace(/\(.+?\)/, "") || "unknown";
        return { name, type };
      });

    results.push({ tableName, columns });
  }

  return results;
}
