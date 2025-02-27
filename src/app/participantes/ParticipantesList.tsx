'use client';
import React, { useState, useEffect } from 'react';
import Table from '../components/Table';


interface TabelaData {
  nomePessoa: string;
  congregacao:  string;
}
const renderCell = (item: TabelaData, column: string) => {
    switch (column) {
      case 'nome':
        return item.nomePessoa;
      case 'igreja':
        return item.congregacao;
      default:
        return null;
    }
  };
const columns = ['nome', 'igreja'];

const ParticipantesList: React.FC = ( ) => {
  const [pessoas, setPessoas] = useState<TabelaData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPessoas = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/pessoa');
        if (!res.ok) {
          throw new Error('Falha ao carregar pessoas');
        }
        const data: TabelaData[] = await res.json();
        const pessoasDto = data.map((pessoa : any) => ({
          nomePessoa: pessoa.nome,
          congregacao: pessoa.congregacao.nome
        }));
        setPessoas(pessoasDto);
        console.log(pessoasDto);
      } catch (err) {
        setError('Erro ao carregar pessoas');
      } finally {
        setLoading(false);
      }
    };

    fetchPessoas();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Table dadosTabela={pessoas} 
      colunasTabela={columns} 
      renderCell={renderCell}
      />

    </div>
  );
};

export default ParticipantesList;