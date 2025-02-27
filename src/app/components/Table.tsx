import { on } from 'events';
import React from 'react';

interface TableProps {
  dadosTabela: any[];
  colunasTabela: string[];
  renderCell: (item: any, column: string) => React.ReactNode;
  onEdit: (item: any) => void;
}

const Table: React.FC<TableProps> = ({ dadosTabela, colunasTabela, renderCell, onEdit }) => {

  return (
    <div className="relative overflow-x-auto pl-0">
      <table className="w-full text-sm text-left rtl:text-right text-gray-800 dark:text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {colunasTabela.map((coluna, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                {coluna}
              </th>
            ))}
            <th scope="col" className="px-6 py-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {dadosTabela.map((item, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? 'bg-white' : 'bg-blue-100'
              } border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200`}
            >
              {colunasTabela.map((coluna, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  {renderCell(item, coluna)}
                </td>
              ))}
              <td className="px-6 py-4">
                <button onClick={() => onEdit(item)}>Editar </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;