export function highlightSQL(sql: string): string {
  const keywords = [
    "SELECT",
    "FROM",
    "WHERE",
    "INSERT",
    "INTO",
    "VALUES",
    "CREATE",
    "TABLE",
    "IF",
    "NOT",
    "EXISTS",
    "NULL",
    "JOIN",
    "ON",
    "AS",
    "INT",
    "TEXT",
  ];

  const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");

  return sql.replace(regex, (match) => {
    return `<span class="sql-keyword">${match.toUpperCase()}</span>`;
  });
}
