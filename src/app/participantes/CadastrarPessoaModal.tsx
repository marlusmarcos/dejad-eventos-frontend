'use client';

import { useEffect, useState } from "react";

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
  }
}

interface Pessoa {
  nome: string;
  congregacao: {
    id: number;
  };
}

const CadastrarPessoaModal: React.FC<CadastrarPessoaModalProps> = ({ isOpen, onClose }) => {
  const [nome, setNome] = useState('');
  const [congregacao, setCongregacao] = useState<Congregacao[]>([]);
  const [selectedCongregacao, setSelectedCongregacao] = useState<string | null>(null);

  const handleEventoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const congregacaoValue = e.target.value;
    setSelectedCongregacao(congregacaoValue);
    console.log(congregacaoValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pessoa: Pessoa = { nome, congregacao: { id: parseInt(selectedCongregacao ?? '', 10) } };
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

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Cadastrar Pessoa</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nome:
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </label>
          <label>
            Congregação:
            <select
              id="years"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleEventoChange}
              value={selectedCongregacao ?? ''}
            >
              <option value="">Selecione uma congregação</option>
              {congregacao.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Cadastrar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default CadastrarPessoaModal;