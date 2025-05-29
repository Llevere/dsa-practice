export default function SQLTable({
    rows,
    columns,
}: {
    rows: unknown[][] | null;
    columns: string[];
}) {
    if (!rows) return <p className="text-error">No data</p>;

    return (
        <div className="overflow-auto border rounded mt-1">
            <table className="table table-sm w-full">
                <thead>
                    <tr>
                        {columns.map((col, i) => (
                            <th key={i} className="border px-2 py-1 text-left">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, ri) => (
                        <tr key={ri}>
                            {row.map((cell, ci) => (
                                <td key={ci} className="border px-2 py-1">
                                    {String(cell)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
