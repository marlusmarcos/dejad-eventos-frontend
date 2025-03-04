'use client';
import React, { useState } from 'react';
import CadastrarPessoaModal from './CadastrarPessoaModal';
import CadastrarPessoaEventoModal from './CadastrarPessoaEventoModal';
import ParticipantesList from './ParticipantesList';
import CadastrarDespesa from '../despesas/cadastrarDespesa';
import Pagamentos from './ListarPagamentosIndividual';

const ParticipantesPage: React.FC = () => {
  const [isCadastrarPessoaModalOpen, setCadastrarPessoaModalOpen] = useState(false);
  const [isListarPessoasModalOpen, setListarPessoasModalOpen] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <main className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Participantes</h1>
        <p className="text-lg mb-8">Bem-vindo à página de participantes!</p>
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setCadastrarPessoaModalOpen(true)}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Cadastrar Pessoa
          </button>
          <button
            onClick={() => setListarPessoasModalOpen(true)}
            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Listar Pessoas
          </button>
        </div>
      </main>
      <CadastrarPessoaModal isOpen={isCadastrarPessoaModalOpen} onClose={() => setCadastrarPessoaModalOpen(false)} />
      <Pagamentos />
      {isListarPessoasModalOpen && <ParticipantesList />}
    </div>
  );
};

export default ParticipantesPage;