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
  tipoPagamento: number;
  custoPorPessoa: number;
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
      const deveSerVerde = item.tipoPagamento === 1 || item.valorTotalPago >= item.custoPorPessoa;
      const amarelo = item.valorTotalPago > 0 && item.valorTotalPago < item.custoPorPessoa;
      return (
        <strong className={deveSerVerde ? 'text-green-500' : (amarelo ? 'text-yellow-500' : 'text-red-500')}>
          {item.valorTotalPago}
        </strong>
      );
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
  const [quantidadePagas, setQuantidadePagas] = useState(0);
  const [quantidadeNaoPagas, setQuantidadeNaoPagas] = useState(0);
  const [congregacoes, setCongregacoes] = useState<string[]>([]);
  const [selectedCongregacao, setSelectedCongregacao] = useState<string | null>(null);

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

  useEffect(() => {
    if (dadosTabela.length > 0) {
      const { pagas, naoPagas } = dadosTabela.reduce(
        (acc, item) => {
          const estaPaga = item.tipoPagamento === 1 || item.valorTotalPago >= item.custoPorPessoa;
          if (estaPaga) {
            acc.pagas += 1;
          } else {
            acc.naoPagas += 1;
          }
          return acc;
        },
        { pagas: 0, naoPagas: 0 }
      );

      setQuantidadePagas(pagas);
      setQuantidadeNaoPagas(naoPagas);
    }
  }, [dadosTabela]);

  useEffect(() => {
    const fetchCongregacoes = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/congregacao');
        if (!res.ok) {
          throw new Error('Falha ao carregar congregações');
        }
        const data = await res.json();
        setCongregacoes(data.map((congregacao: any) => congregacao.nome));
      } catch (err) {
        console.error('Erro ao carregar congregações', err);
      }
    };

    fetchCongregacoes();
  }, []);

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
      console.log(res);
      setDadosTabela((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, valorTotalPago: valorPago } : item
        )
      );
    } catch (err) {
      console.error('Erro ao atualizar pagamento', err);
    }
  };

  const filteredDadosTabela = selectedCongregacao
    ? dadosTabela.filter(item => item.congregacao === selectedCongregacao)
    : dadosTabela;

  return (
    <div className='flex justify-start flex-col'>
      <Filter onFilterChange={setEventoId} />

      <div className="flex gap-4 mb-4">
        <div className="p-4 bg-green-100 rounded-lg">
          <span className="text-green-700 font-bold">Pagas: {quantidadePagas}</span>
        </div>
        <div className="p-4 bg-red-100 rounded-lg">
          <span className="text-red-700 font-bold">Não Pagas: {quantidadeNaoPagas}</span>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="congregacao" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Filtrar por Congregação:
        </label>
        <select
          id="congregacao"
          value={selectedCongregacao ?? ''}
          onChange={(e) => setSelectedCongregacao(e.target.value)}
          className="block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        >
          <option value="">Todas</option>
          {congregacoes.map((congregacao, index) => (
            <option key={index} value={congregacao}>
              {congregacao}
            </option>
          ))}
        </select>
      </div>

      <Table dadosTabela={filteredDadosTabela} colunasTabela={columns} renderCell={renderCell} onEdit={handleEdit} />
      <FormCadastro />
    </div>
  );
};

export default Home;