import React, { useState, useEffect } from 'react';

const columns = [
  { label: 'Participante', field: 'nomePessoa' },
  { label: 'Igreja', field: 'congregacao' },
  { label: 'Evento', field: 'nomeEvento' },
  { label: 'Valor Pago', field: 'valorTotalPago' },
];

export default function ParentComponent() {
  const [dados, setDados] = useState<any[]>([]); // Dados da tabela
  const [eventoId, setEventoId] = useState<number | null>(null); // Evento ID para filtragem
  const [error, setError] = useState<string | null>(null);

  // Função para buscar os dados
  const fetchDados = async () => {
    if (eventoId === null) return;

    setError(null);
    try {
      const res = await fetch(
        `http://localhost:8080/api/pagamento/pessoa/evento/${eventoId}`
      );
      if (!res.ok) {
        throw new Error('Falha ao carregar dados');
      }
      const data = await res.json();
      setDados(data);
    } catch (err) {
      setError('Erro ao carregar dados');
    }
  };

  // Requisição sempre que o eventoId mudar
  useEffect(() => {
    fetchDados();
  }, [eventoId]);

  const handleFilterChange = (newEventoId: number | null) => {
    setEventoId(newEventoId); 
  };

  // Função para renderizar células com lógica de cor
  const renderCell = (item: any, column: string) => {
    if (column === 'Valor Pago') {
      const valorPago = item.valorTotalPago;
      const tipoPagamento = item.tipoPagamento; // Supondo que o tipoPagamento esteja no item
      const valorEvento = item.evento?.custoTotal; // Supondo que o custoTotal do evento esteja no item

      // Condição para aplicar o estilo verde
      const deveSerVerde = tipoPagamento === 1 || valorPago > valorEvento;

      return (
        <span className={deveSerVerde ? 'text-green-500' : ''}>
          {valorPago}
        </span>
      );
    }

    // Para outras colunas, retorna o valor normalmente
    return item[column];
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Pagamentos</h1>

      {/* Filtro por Evento ID (opcional) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Filtrar por Evento ID:
          <input
            type="number"
            value={eventoId ?? ''}
            onChange={(e) => handleFilterChange(parseInt(e.target.value, 10))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </label>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dados.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {renderCell(item, col.field)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => console.log('Editar', item)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}