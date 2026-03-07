// ── CSV Parser ──────────────────────────────────────────────────────────────
export const parseCSV = (text: string): Record<string, string>[] => {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const records: Record<string, string>[] = [];
  let currentRow = "";

  for (let i = 1; i < lines.length; i++) {
    currentRow += (currentRow ? "\n" : "") + lines[i];

    // Count quotes — if odd, the row continues on the next line
    const quoteCount = (currentRow.match(/"/g) || []).length;
    if (quoteCount % 2 !== 0) continue;

    // Parse the completed row
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let c = 0; c < currentRow.length; c++) {
      const ch = currentRow[c];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    values.push(current.trim());

    if (values.length === headers.length) {
      const record: Record<string, string> = {};
      headers.forEach((h, idx) => (record[h] = values[idx]));
      records.push(record);
    }

    currentRow = "";
  }

  return records;
}