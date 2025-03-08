import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const exportToPDF = () => {
  const input = document.getElementById('table-to-export'); // ID da tabela
  if (input) {
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('tabela.pdf'); // Nome do arquivo PDF
    });
  }
};

const exportToCSV = (dadosTabela: any[], colunasTabela: string[], renderCell: (item: any, column: string) => React.ReactNode) => {
  // Cabeçalho do CSV (nomes das colunas)
  const header = colunasTabela.join(',') + '\n';

  // Dados da tabela em formato CSV
  const rows = dadosTabela.map((item) =>
    colunasTabela.map((coluna) => renderCell(item, coluna)).join(',')
  ).join('\n');

  // Combina cabeçalho e dados
  const csvContent = header + rows;

  // Cria um blob com o conteúdo CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Cria um link para download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'tabela.csv'; // Nome do arquivo
  link.click(); // Dispara o download
  URL.revokeObjectURL(link.href); // Limpa o URL criado
};

interface TableProps {
  dadosTabela: any[];
  colunasTabela: string[];
  renderCell: (item: any, column: string) => React.ReactNode;
  onEdit: (item: any) => void;
}

const Table: React.FC<TableProps> = ({ dadosTabela, colunasTabela, renderCell, onEdit }) => {
  const count = dadosTabela.length;

  return (
    <div className="relative overflow-x-auto pl-0 pr-8">
      <h2 className="text-lg font-semibold mb-4">Total de pessoas: {count}</h2>
      {/* Botão para exportar PDF */}
      <button
        onClick={exportToPDF}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Exportar para PDF
      </button>
      {/* Botão para exportar CSV */}
      <button
        onClick={() => exportToCSV(dadosTabela, colunasTabela, renderCell)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 ml-2"
      >
        Exportar para Google Planilhas (CSV)
      </button>
      {/* Tabela com ID para captura */}
      <table id="table-to-export" className="w-full text-sm text-left rtl:text-right text-gray-800 dark:text-gray-600">
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