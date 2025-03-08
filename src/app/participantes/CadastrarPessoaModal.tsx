'use client';

import React, { useEffect, useState } from 'react';
import FormModal from '../components/FormModal';

interface CadastrarPessoaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Congregacao {
  id: number;
  nome: string;
  setor: {
    id: number;
    nome: string;
  };
}

interface Pessoa {
  nome: string;
  sexo: string;
  congregacao: {
    id: number;
  };
}

const CadastrarPessoaModal: React.FC<CadastrarPessoaModalProps> = ({ isOpen, onClose }) => {
  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState('');
  const [congregacao, setCongregacao] = useState<Congregacao[]>([]);
  const [selectedCongregacao, setSelectedCongregacao] = useState<string | null>(null);

  useEffect(() => {
    const fetchCongregacoes = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/congregacao');
        if (!res.ok) {
          throw new Error('Falha ao carregar congregações');
        }
        const data = await res.json();
        setCongregacao(data);
      } catch (err) {
        console.error('Erro ao carregar congregações', err);
      }
    };

    fetchCongregacoes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pessoa: Pessoa = { nome, congregacao: { id: parseInt(selectedCongregacao ?? '', 10) }, sexo };
    console.log(pessoa);
    try {
      const res = await fetch('http://localhost:8080/api/pessoa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pessoa),
      });
      if (!res.ok) {
        throw new Error('Falha ao cadastrar pessoa');
      }
      onClose();
    } catch (err) {
      console.error('Erro ao cadastrar pessoa', err);
    }
  };

  const fields = [
    {
      label: 'Nome',
      name: 'nome',
      type: 'text',
      value: nome,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value),
    },
    {
      label: 'Sexo',
      name: 'sexo',
      type: 'text',
      value: sexo,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSexo(e.target.value),
    },
    {
      label: 'Congregação',
      name: 'congregacao',
      type: 'select',
      value: selectedCongregacao ?? '',
      options: congregacao.map((c) => ({ value: c.id, label: c.nome })),
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCongregacao(e.target.value),
    },
  ];

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Cadastrar Pessoa"
      fields={fields}
      onSubmit={handleSubmit}
    />
  );
};

export default CadastrarPessoaModal;