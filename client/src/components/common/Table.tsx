import { useTranslation } from '../../hooks/useTranslation';
import type { TableProps } from '../../types';

export function Table<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
}: TableProps<T>) {
  const { t } = useTranslation();

  return (
    <div className="table-wrapper premium-scrollbar">
      <table className="table-root">
        <thead className="table-head">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="table-th">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-td-empty">
                {t('common.table_no_data')}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`table-row ${onRowClick ? 'table-row-clickable' : 'table-row-static'
                  }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="table-td">
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
