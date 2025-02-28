'use client';
import Filter from '../components/Filter';
import { useEffect, useState } from 'react';
import React from 'react';
import Table from '../components/Table';
import EditPaymentModal from '../components/EditPaymentModal';
import FormCadastro from '../components/FormCadastro';

interface TabelaData {
  id: number;
  nomePessoa: string;
  congregacao: string;
  nomeEvento: string;
  valorTotalPago: number;
  data: string;
}

const columns = ['participante', 'igreja', 'evento', 'valor pago'];

const renderCell = (item: TabelaData, column: string) => {
  switch (column) {
    case 'participante':
      return item.nomePessoa;
    case 'igreja':
      return item.congregacao;
    case 'evento': 
      return item.nomeEvento;
    case 'valor pago':
      return item.valorTotalPago;
    default:
      return null;
  }
};

const Home: React.FC = () => {
  const [eventoId, setEventoId] = React.useState<number | null>(null);
  const [dadosTabela, setDadosTabela] = React.useState<TabelaData[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<TabelaData | null>(null);

  useEffect(() => {
    if (eventoId === null) return;

    const fetchDados = async () => {
      setError(null);
      try {
        const res = await fetch(`http://localhost:8080/api/pagamento/pessoa/evento/${eventoId}`);
        if (!res.ok) {
          throw new Error('Falha ao carregar dados');
        }
        const data: TabelaData[] = await res.json();
        setDadosTabela(data);
      } catch (err) {
        setError('Erro ao carregar dados');
      }
    };

    fetchDados();
  }, [eventoId]);

  const handleEdit = (item: TabelaData) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSave = async (id: number, valorPago: number) => {
    const formattedValorPago = parseFloat(valorPago.toFixed(1));
    console.log('Dados da requisição:', { id, valor: formattedValorPago });
    
    try {
      const res = await fetch(`http://localhost:8080/api/pagamento/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ valor: formattedValorPago }),
        
      });
      if (!res.ok) {
        
        throw new Error('Falha ao atualizar pagamento');
      }
      console.log(res)
      setDadosTabela((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, valorTotalPago: valorPago } : item
        )
      );
    } catch (err) {
      console.error('Erro ao atualizar pagamento', err);
    }
  };

  return (
    <div>
      <Filter onFilterChange={setEventoId} />
      <Table dadosTabela={dadosTabela} colunasTabela={columns} renderCell={renderCell} onEdit={handleEdit} />
      <FormCadastro />
    </div>
  );
};

export default Home;