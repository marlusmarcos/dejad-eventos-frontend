'use client';
import React, { useState } from 'react';
import FormModal from '../components/FormModal';

interface Evento {
  nome: string;
  descricao: string;
  data: string;
  custoTotal: number;
  custoPorPessoa: number;
  status: string;
}

export default function CadastrarEvento() {
  const [isOpen, setIsOpen] = useState(false);
  const [evento, setEvento] = useState<Evento>({
    nome: '',
    descricao: '',
    data: '',
    custoTotal: 0,
    custoPorPessoa: 0,
    status: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEvento({
      ...evento,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(evento);
    try {
      const res = await fetch('http://localhost:8080/api/evento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evento),
      });
      if (!res.ok) {
        throw new Error('Falha ao cadastrar evento');
      }
      console.log('Evento cadastrado com sucesso');
      setIsOpen(false);
    } catch (err) {
      console.error('Erro ao cadastrar evento', err);
    }
  };

  const fields = [
    {
      label: 'Nome',
      name: 'nome',
      type: 'text',
      value: evento.nome,
      onChange: handleInputChange,
    },
    {
      label: 'Descrição',
      name: 'descricao',
      type: 'text',
      value: evento.descricao,
      onChange: handleInputChange,
    },
    {
      label: 'Data',
      name: 'data',
      type: 'datetime-local',
      value: evento.data,
      onChange: handleInputChange,
    },
    {
      label: 'Custo Total',
      name: 'custoTotal',
      type: 'number',
      value: evento.custoTotal,
      onChange: handleInputChange,
    },
    {
      label: 'Custo por Pessoa',
      name: 'custoPorPessoa',
      type: 'number',
      value: evento.custoPorPessoa,
      onChange: handleInputChange,
    },
    {
      label: 'Status',
      name: 'status',
      type: 'text',
      value: evento.status,
      onChange: handleInputChange,
    },
  ];

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center w-full max-w-xs p-4 mb-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
        </svg>
        Cadastrar novo evento
      </button>
      <FormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Cadastrar Evento"
        fields={fields}
        onSubmit={handleSubmit}
      />
    </div>
  );
}