'use client'; // Indica que este é um Client Component

import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Função para exportar para PDF
const exportToPDF = (dadosTabela: any[], colunasTabela: string[], congregacaoSelecionada?: string) => {
  if (!dadosTabela || !colunasTabela) return; // Verifica se os dados estão definidos

  const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF

  // Adicionando título ao PDF
  pdf.setFontSize(16);
  const titulo = congregacaoSelecionada
    ? `Relatório de Participantes - ${congregacaoSelecionada}`
    : 'Relatório de Participantes';
  pdf.text(titulo, 105, 20, { align: 'center' });

  // Definir o estilo da tabela (fontes, etc.)
  pdf.setFontSize(12);

  // Preparar os dados para a tabela
  const header = colunasTabela; // Cabeçalho como array de strings
  const body = dadosTabela.map((item) => {
    return colunasTabela.map((coluna) => {
      // Mapeia as colunas para os campos corretos no objeto
      switch (coluna) {
        case 'participante':
          return item.nomePessoa;
        case 'igreja':
          return item.congregacao;
        case 'evento':
          return item.nomeEvento;
        case 'valor pago':
          const valorPago = parseFloat(item.valorTotalPago);
          const custoPorPessoa = item.custoPorPessoa;
          const tipoPagamento = item.tipoPagamento;
          const deveSerVerde = tipoPagamento === 1 || valorPago >= custoPorPessoa;
          const amarelo = valorPago > 0 && valorPago < custoPorPessoa;

          if (deveSerVerde) {
            return { content: valorPago.toFixed(2), styles: { textColor: [0, 128, 0] } }; // Verde
          } else if (amarelo) {
            return { content: valorPago.toFixed(2), styles: { textColor: [255, 165, 0] } }; // Amarelo
          } else {
            return { content: valorPago.toFixed(2), styles: { textColor: [255, 0, 0] } }; // Vermelho
          }
        default:
          return '';
      }
    });
  });

  // Adicionar a tabela ao PDF
  autoTable(pdf, {
    head: [header], // Cabeçalho como array de arrays
    body: body, // Dados como array de arrays
    startY: 30, // Posição inicial da tabela
    theme: 'grid', // Tema da tabela
    styles: { fontSize: 10 }, // Estilo geral da tabela
    headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] }, // Estilo do cabeçalho
  });

  // Salvar o PDF com o nome de arquivo
  pdf.save('relatorio_participantes.pdf');
};

// Função para exportar para CSV
const exportToCSV = (dadosTabela: any[], colunasTabela: string[]) => {
  if (!dadosTabela || !colunasTabela) return; // Verifica se os dados estão definidos

  // Cabeçalho do CSV (nomes das colunas)
  const header = colunasTabela.join(',') + '\n';

  // Dados da tabela em formato CSV
  const rows = dadosTabela.map((item) =>
    colunasTabela.map((coluna) => {
      switch (coluna) {
        case 'participante':
          return item.nomePessoa;
        case 'igreja':
          return item.congregacao;
        case 'evento':
          return item.nomeEvento;
        case 'valor pago':
          return item.valorTotalPago;
        default:
          return '';
      }
    }).join(',')
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

// Interface para as props do componente Table
interface TableProps {
  dadosTabela: any[];
  colunasTabela: string[];
  renderCell: (item: any, column: string) => React.ReactNode;
  onEdit: (item: any) => void;
  congregacaoSelecionada?: string;
}

// Componente Table
const Table: React.FC<TableProps> = ({
  dadosTabela = [], // Valor padrão para evitar undefined
  colunasTabela = [], // Valor padrão para evitar undefined
  renderCell,
  onEdit,
  congregacaoSelecionada,
}) => {
  const count = dadosTabela.length;

  return (
    <div className="relative overflow-x-auto pl-0 pr-8">
      <h2 className="text-lg font-semibold mb-4">Total de pessoas: {count}</h2>

      {/* Botão para exportar PDF */}
      <button
        onClick={() => exportToPDF(dadosTabela, colunasTabela, congregacaoSelecionada)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Exportar para PDF
      </button>

      {/* Botão para exportar CSV */}
      <button
        onClick={() => exportToCSV(dadosTabela, colunasTabela)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 ml-2"
      >
        Exportar para Google Planilhas (CSV)
      </button>

      {/* Tabela com ID para captura */}
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
                <button onClick={() => onEdit(item)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;