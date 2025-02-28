'use client'

import React, { useState } from 'react';
import CadastrarPessoaEventoModal from '../participantes/CadastrarPessoaEventoModal';

interface Evento {
  nome: string;
  descricao: string;
  data: string;
  custoTotal: number;
  custoPorPessoa: number;
  status: string;
}

export default function Eventos() {

  const [isCadastrarPessoaEventoModalOpen, setCadastrarPessoaEventoModalOpen] = useState(false);
  const [evento, setEvento] = useState<Evento>({
    nome: '',
    descricao: '',
    data: '',
    custoTotal: 0,
    custoPorPessoa: 0,
    status: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log(evento);  // Log the event object to verify it
    
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
    } catch (err) {
      console.error('Erro ao cadastrar evento', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEvento({
      ...evento,
      [name]: value
    });
  };

  return (
    <div>
      <main>
        <h1>Eventos</h1>
      </main>
      <div className='flex justify-between '>
      <div className='flex flex-col px-4'>
      <button onClick={() => setCadastrarPessoaEventoModalOpen(true)} data-modal-target="default-modal" data-modal-toggle="default-modal" className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
  Cadastrar pessoas no evento
      </button>
 

      <CadastrarPessoaEventoModal isOpen={isCadastrarPessoaEventoModalOpen} onClose={() => setCadastrarPessoaEventoModalOpen(false)} />
      </div>
      <div className='flex flex-col px-4'>
        <h2>Cadastrar novo evento</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={evento.nome}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="descricao">Descrição:</label>
            <input
              type="text"
              id="descricao"
              name="descricao"
              value={evento.descricao}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="data">Data:</label>
            <input
              type="datetime-local"
              id="data"
              name="data"
              value={evento.data}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="custoTotal">Custo Total:</label>
            <input
              type="number"
              id="custoTotal"
              name="custoTotal"
              value={evento.custoTotal}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="custoPorPessoa">Custo por Pessoa:</label>
            <input
              type="number"
              id="custoPorPessoa"
              name="custoPorPessoa"
              value={evento.custoPorPessoa}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="status">Status:</label>
            <input
              type="text"
              id="status"
              name="status"
              value={evento.status}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Cadastrar Evento</button>
        </form>
      </div>
      </div>
 
      
      
    </div>
  );
}
