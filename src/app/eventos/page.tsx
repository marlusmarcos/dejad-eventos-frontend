'use client'

import React, { useState } from 'react';
import CadastrarPessoaEventoModal from '../participantes/CadastrarPessoaEventoModal';
import CadastrarEvento from './CadastrarEvento';

export default function Eventos() {
  const [isCadastrarPessoaEventoModalOpen, setCadastrarPessoaEventoModalOpen] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <main className="text-center mb-8">
        <h1 className="text-3xl font-bold">Eventos</h1>
      </main>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <button
            onClick={() => setCadastrarPessoaEventoModalOpen(true)}
            className="flex items-center justify-center w-full max-w-xs p-4 mb-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
            </svg>
            Cadastrar pessoas no evento
          </button>
          <CadastrarPessoaEventoModal
            isOpen={isCadastrarPessoaEventoModalOpen}
            onClose={() => setCadastrarPessoaEventoModalOpen(false)}
          />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Cadastrar novo evento</h2>
          <CadastrarEvento />
        </div>
      </div>
    </div>
  );
}