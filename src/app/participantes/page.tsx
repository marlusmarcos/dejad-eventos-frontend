'use client';
import React, { useState } from 'react';
import CadastrarPessoaModal from './CadastrarPessoaModal';
import CadastrarPessoaEventoModal from './CadastrarPessoaEventoModal';
import ParticipantesList from './ParticipantesList';
import CadastrarDespesa from './cadastrarDespesa';
import Pagamentos from './ListarPagamentosIndividual';

const ParticipantesPage: React.FC = () => {
  const [isCadastrarPessoaModalOpen, setCadastrarPessoaModalOpen] = useState(false);
  const [isCadastrarPessoaEventoModalOpen, setCadastrarPessoaEventoModalOpen] = useState(false);
  const [isListarPessoasModalOpen, setListarPessoasModalOpen] = useState(false);

  return (
    <div> 
          <div>
      <h1>Participantes</h1>
      <p>Bem-vindo à página de participantes!</p>
      <button onClick={() => setCadastrarPessoaModalOpen(true)}>Cadastrar Pessoa</button>
      <button onClick={() => setCadastrarPessoaEventoModalOpen(true)}>Cadastrar Pessoa no Evento</button>
      <button onClick={() => setListarPessoasModalOpen(true)}>Listar Pessoas </button>
      {/* <ParticipantesList /> */}
      <CadastrarPessoaModal isOpen={isCadastrarPessoaModalOpen} onClose={() => setCadastrarPessoaModalOpen(false)} />
      <CadastrarPessoaEventoModal isOpen={isCadastrarPessoaEventoModalOpen} onClose={() => setCadastrarPessoaEventoModalOpen(false)} />
      <CadastrarDespesa/>
      <Pagamentos/>
    </div>
    <div>
            {isListarPessoasModalOpen &&
       <ParticipantesList />
      }
    </div>
    </div>


  );
};

export default ParticipantesPage;