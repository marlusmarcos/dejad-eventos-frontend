'use client';
import React, { useState, useEffect } from 'react';

enum TipoPagamento {
  CARTAO_CREDITO = 'CARTAO_CREDITO',
  BOLETO = 'BOLETO',
  PIX = 'PIX',
  DINHEIRO = 'DINHEIRO'
}

interface Pessoa {
  id: number;
  nome: string;
  congregacao: {
    nome: string;
  };
}

interface Evento {
  id: number;
  nome: string;
  descricao: string;
  data: string;
  custoTotal: number;
  status: string;
}

interface CadastrarPessoaEventoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface pessoaEventoDTO {
  pessoa: {
    id: number;
  };
  evento: {
    id: number;
  };
  valor: number;
  data: string;
  parcela: number;
  descricao: string;
  tipoPagamento: TipoPagamento; // Novo campo
}

const CadastrarPessoaEventoModal: React.FC<CadastrarPessoaEventoModalProps> = ({ isOpen, onClose }) => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [selectedPessoa, setSelectedPessoa] = useState<number | null>(null);
  const [selectedEvento, setSelectedEvento] = useState<number | null>(null);
  const [valor, setValor] = useState<number>(0);
  const [data, setData] = useState<string>('');
  const [parcela, setParcela] = useState<number>(1);
  const [descricao, setDescricao] = useState<string>('');
  const [tipoPagamento, setTipoPagamento] = useState<TipoPagamento | null>(null); // Novo estado

  useEffect(() => {
    const fetchPessoas = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/pessoa');
        if (!res.ok) {
          throw new Error('Falha ao carregar pessoas');
        }
        const data: Pessoa[] = await res.json();
        setPessoas(data);
      } catch (err) {
        console.error('Erro ao carregar pessoas', err);
      }
    };

    const fetchEventos = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/evento');
        if (!res.ok) {
          throw new Error('Falha ao carregar eventos');
        }
        const data: Evento[] = await res.json();
        setEventos(data);
      } catch (err) {
        console.error('Erro ao carregar eventos', err);
      }
    };

    fetchPessoas();
    fetchEventos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPessoa === null || selectedEvento === null || tipoPagamento === null) {
      return;
    }
    const pessoaEvento: pessoaEventoDTO = {
      pessoa: { id: selectedPessoa },
      evento: { id: selectedEvento },
      valor,
      data,
      parcela,
      descricao,
      tipoPagamento, // Novo campo
    };
    console.log(JSON.stringify(pessoaEvento));
    try {
      const res = await fetch(`http://localhost:8080/api/pagamento`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pessoaEvento),
      });
      if (!res.ok) {
        throw new Error('Falha ao cadastrar pessoa no evento');
      }
      onClose();
    } catch (err) {
      console.error('Erro ao cadastrar pessoa no evento', err);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div id="default-modal" tabIndex={-1} aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full overflow-y-auto overflow-x-hidden md:inset-0">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Cadastrar Pessoa no Evento
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onClose}
            >
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            <form onSubmit={handleSubmit}>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Pessoa:
                <select
                  value={selectedPessoa ?? ''}
                  onChange={(e) => setSelectedPessoa(parseInt(e.target.value, 10))}
                  required
                  className="block w-full mt-1 p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                >
                  <option value="">Selecione uma pessoa</option>
                  {pessoas.map(pessoa => (
                    <option key={pessoa.id} value={pessoa.id}>
                      {pessoa.nome} - {pessoa.congregacao.nome}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Evento:
                <select
                  value={selectedEvento ?? ''}
                  onChange={(e) => setSelectedEvento(parseInt(e.target.value, 10))}
                  required
                  className="block w-full mt-1 p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                >
                  <option value="">Selecione um evento</option>
                  {eventos.map(evento => (
                    <option key={evento.id} value={evento.id}>
                      {evento.nome}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Valor:
                <input
                  type="number"
                  value={valor}
                  onChange={(e) => setValor(parseFloat(e.target.value))}
                  required
                  className="block w-full mt-1 p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                />
              </label>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Data:
                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  required
                  className="block w-full mt-1 p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                />
              </label>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Parcela:
                <input
                  type="number"
                  value={parcela}
                  onChange={(e) => setParcela(parseInt(e.target.value, 10))}
                  required
                  className="block w-full mt-1 p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                />
              </label>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Descrição:
                <input
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                  className="block w-full mt-1 p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                />
              </label>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Tipo de Pagamento:
                <select
                  value={tipoPagamento ?? ''}
                  onChange={(e) => setTipoPagamento(e.target.value as TipoPagamento)}
                  required
                  className="block w-full mt-1 p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                >
                  <option value="">Selecione o tipo de pagamento</option>
                  {Object.values(TipoPagamento).map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Cadastrar
                </button>
                <button
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  onClick={onClose}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastrarPessoaEventoModal;