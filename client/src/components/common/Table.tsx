import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
}: TableProps<T>) {
  const { t } = useTranslation();

  return (
    <div className="w-full overflow-x-auto premium-scrollbar rounded-xl border border-[#222b38] bg-[#0d1219]">
      <table className="w-full border-collapse text-left text-sm text-neutral-300">
        <thead className="bg-[#131a24] text-xs font-semibold text-neutral-400 uppercase tracking-wider border-b border-[#222b38]">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#222b38]/50">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-neutral-500 italic">
                {t('common.table_no_data')}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`transition-colors duration-150 ${
                  onRowClick ? 'cursor-pointer hover:bg-neutral-800/40' : 'hover:bg-neutral-800/20'
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                    {col.render ? col.render(row, rowIndex) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
