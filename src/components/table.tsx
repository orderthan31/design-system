import React from "react";
import "./table.css";
export type DataColumn<T> = {
  id: string;
  header: string;
  value: (row: T) => string | number;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
};
export type TableProps<T> = {
  caption: string;
  rows: readonly T[];
  columns: readonly DataColumn<T>[];
  rowKey: (row: T) => React.Key;
};
export function Table<T>({ caption, rows, columns, rowKey }: TableProps<T>) {
  return (
    <div
      className="ds-table-scroll"
      tabIndex={0}
      role="region"
      aria-label={`${caption} 스크롤 영역`}
    >
      <table className="ds-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td key={column.id}>
                  {column.render?.(row) ?? column.value(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
