import { useState, useEffect } from 'react';
import Table from '../components/Table';

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

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* Você pode passar o eventoId aqui para o filtro */}
      <Table 
        colunasTabela={columns} 
        dadosTabela={dados} 
        onFilterChange={handleFilterChange} 
      />
    </div>
  );
}
