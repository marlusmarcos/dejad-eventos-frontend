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
      <div></div>
      <div>
      <button onClick={() => setCadastrarPessoaEventoModalOpen(true)}>Cadastrar Pessoa no Evento</button>
      <CadastrarPessoaEventoModal isOpen={isCadastrarPessoaEventoModalOpen} onClose={() => setCadastrarPessoaEventoModalOpen(false)} />
      </div>
      
      <div>
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
  );
}
