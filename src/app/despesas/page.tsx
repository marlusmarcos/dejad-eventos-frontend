'use client';
import { useEffect, useState } from 'react';
import Table from '../components/Table';

export interface Evento {
  id: number;
  nome: string;
  descricao: string;
  data: string;
  custoTotal: number;
  custoPorPessoa: number;
  status: string;
}

export interface Despesa {
  id: number;
  evento: Evento;
  descricao: string;
  valor: number;
  data: string;
}

export interface DespesaDTO {
  evento: string;
  descricao: string;
  valor: number;
  data: string;
}

const columns = ['Evento', 'Descrição', 'Valor', 'Data'];

export default function Despesas() {
  const [despesas, setDespesas] = useState<DespesaDTO[]>([]);

  const fetchDespesas = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/despesa');
      if (!response.ok) {
        throw new Error('Erro ao buscar as despesas');
      }
      const data: Despesa[] = await response.json();
      console.log(data);
      const despesasDTO = data.map(despesa => ({
        evento: despesa.evento.nome,
        descricao: despesa.descricao,
        valor: despesa.valor,
        data: new Date(despesa.data).toLocaleDateString(),
      }));
      setDespesas(despesasDTO);
    } catch (err) {
      console.error('Erro ao carregar despesas', err);
    }
  };

  useEffect(() => {
    fetchDespesas();
  }, []);

  const renderCell = (item: DespesaDTO, column: string) => {
    switch (column) {
      case 'Evento':
        return item.evento;
      case 'Descrição':
        return item.descricao;
      case 'Valor':
        return item.valor;
      case 'Data':
        return item.data;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Despesas</h1>
      <button onClick={fetchDespesas} className='bg-slate-500 border-spacing-1 px-2 text-white'>Listar despesas</button>
      <div>
        <Table dadosTabela={despesas} colunasTabela={columns} renderCell={renderCell} />
      </div>
    </div>
  );
}