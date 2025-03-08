'use client';
import React, { useState, useEffect } from 'react';
import FormModal from './FormModal';

interface Pessoa {
  id: number;
  nome: string;
  sexo: string;
  congregacao: {
    nome: string;
  };
}

interface Evento {
  id: number;
  nome: string;
}

const FormCadastro: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [selectedPessoa, setSelectedPessoa] = useState<number | null>(null);
  const [selectedEvento, setSelectedEvento] = useState<number | null>(null);
  const [valor, setValor] = useState<number>(0);
  const [data, setData] = useState<string>('');
  const [parcela, setParcela] = useState<number>(1);
  const [descricao, setDescricao] = useState<string>('');

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
    if (selectedPessoa === null || selectedEvento === null) {
      return;
    }
    const pessoaEvento = {
      pessoa: { id: selectedPessoa },
      evento: { id: selectedEvento },
      valor,
      data,
      parcela,
      descricao,
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
      setIsOpen(false);
    } catch (err) {
      console.error('Erro ao cadastrar pessoa no evento', err);
    }
  };

  const fields = [
    {
      label: 'Pessoa',
      name: 'pessoa',
      type: 'select',
      value: selectedPessoa ?? '',
      options: pessoas.map(pessoa => ({ value: pessoa.id, label: `${pessoa.nome} - ${pessoa.congregacao.nome}` })),
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPessoa(parseInt(e.target.value, 10)),
    },
    {
      label: 'Evento',
      name: 'evento',
      type: 'select',
      value: selectedEvento ?? '',
      options: eventos.map(evento => ({ value: evento.id, label: evento.nome })),
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedEvento(parseInt(e.target.value, 10)),
    },
    {
      label: 'Valor',
      name: 'valor',
      type: 'number',
      value: valor,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValor(parseFloat(e.target.value)),
    },
    {
      label: 'Data',
      name: 'data',
      type: 'date',
      value: data,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setData(e.target.value),
    },
    {
      label: 'Parcela',
      name: 'parcela',
      type: 'number',
      value: parcela,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setParcela(parseInt(e.target.value, 10)),
    },
    {
      label: 'Descrição',
      name: 'descricao',
      type: 'text',
      value: descricao,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDescricao(e.target.value),
    },
  ];

  return (
    <div>
      <button onClick={() => setIsOpen(true)}
        className="flex items-center justify-center w-full max-w-xs p-4 mb-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 my-2"
        
        >Cadastrar Pessoa no Evento</button>
      <FormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Cadastrar Pessoa no Evento"
        fields={fields}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default FormCadastro;