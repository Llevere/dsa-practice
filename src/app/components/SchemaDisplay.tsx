import { ParsedTable } from "@/utils/parseSchema";
import RawSQLSchema from "./RawSQLSchema";
export default function SchemaDisplay({ tables, rawSchema }: { tables: ParsedTable[], rawSchema: string[] }) {
    return (
        <div className="space-y-6">
            <RawSQLSchema schema={rawSchema} />

            {tables.map((table) => (
                <div key={table.tableName}>
                    <h3 className="font-semibold mb-2 text-primary">
                        Table: <span className="text-base-content">{table.tableName}</span>
                    </h3>

                    <div className="overflow-x-auto rounded-lg border border-base-300">
                        <table className="table table-sm w-full">
                            <thead className="bg-base-300 text-base-content">
                                <tr>
                                    <th className="text-primary">Column Name</th>
                                    <th className="text-primary">Type</th>
                                </tr>
                            </thead>
                            <tbody className="bg-base-200">
                                {table.columns.map((col, i) => (
                                    <tr key={i} className="hover:bg-base-100 transition">
                                        <td className="text-base-content">{col.name}</td>
                                        <td className="text-base-content">{col.type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
}
