'use client';
import React, { useState, useEffect } from 'react';

interface Pessoa {
  id: number;
  nome: string;
  congregacao: {
    nome: string;
  } ;
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
    const pessoaEvento: pessoaEventoDTO = {
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
      onClose();
    } catch (err) {
      console.error('Erro ao cadastrar pessoa no evento', err);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Cadastrar Pessoa no Evento</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Pessoa:
            <select value={selectedPessoa ?? ''} onChange={(e) => setSelectedPessoa(parseInt(e.target.value, 10))} required>
              <option value="">Selecione uma pessoa</option>
              {pessoas.map(pessoa => (
                <option key={pessoa.id} value={pessoa.id}>
                  {pessoa.nome} - {pessoa.congregacao.nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            Evento:
            <select value={selectedEvento ?? ''} onChange={(e) => setSelectedEvento(parseInt(e.target.value, 10))} required>
              <option value="">Selecione um evento</option>
              {eventos.map(evento => (
                <option key={evento.id} value={evento.id}>
                  {evento.nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            Valor:
            <input type="number" value={valor} onChange={(e) => setValor(parseFloat(e.target.value))} required />
          </label>
          <label>
            Data:
            <input type="date" value={data} onChange={(e) => setData(e.target.value)} required />
          </label>
          <label>
            Parcela:
            <input type="number" value={parcela} onChange={(e) => setParcela(parseInt(e.target.value, 10))} required />
          </label>
          <label>
            Descrição:
            <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
          </label>
          <button type="submit">Cadastrar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default CadastrarPessoaEventoModal;