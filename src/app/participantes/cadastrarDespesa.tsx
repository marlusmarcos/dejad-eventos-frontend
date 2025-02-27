'use client';
import { useEffect, useState } from 'react';

interface Evento {
  id: number;
  nome: string;
}

interface Despesa {
  evento: {
    id: number;
  };
  descricao: string;
  valor: number;
  data: string;
}

export default function CadastrarDespesa() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [selectedEvento, setSelectedEvento] = useState<number | null>(null);
  const [descricao, setDescricao] = useState<string>('');
  const [valor, setValor] = useState<number>(0);
  const [data, setData] = useState<string>('');

  useEffect(() => {
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
    fetchEventos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEvento === null) {
      return;
    }
    const despesa: Despesa = {
      evento: { id: selectedEvento },
      descricao,
      valor,
      data,
    };
    console.log(despesa);
    try {
      const res = await fetch('http://localhost:8080/api/despesa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(despesa),
      });
      if (!res.ok) {
        throw new Error('Falha ao cadastrar despesa');
      }
      // Reset form fields after successful submission
      setSelectedEvento(null);
      setDescricao('');
      setValor(0);
      setData('');
    } catch (err) {
      console.error('Erro ao cadastrar despesa', err);
    }
  };

  return (
    <div>
      <h2>Cadastrar Despesa</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Evento:
          <select
            value={selectedEvento ?? ''}
            onChange={(e) => setSelectedEvento(parseInt(e.target.value, 10))}
            required
          >
            <option value="">Selecione um evento</option>
            {eventos.map((evento) => (
              <option key={evento.id} value={evento.id}>
                {evento.nome}
              </option>
            ))}
          </select>
        </label>
        <label>
          Descrição:
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            placeholder="Descrição"
          />
        </label>
        <label>
          Valor:
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(parseFloat(e.target.value))}
            required
            placeholder="Valor"
          />
        </label>
        <label>
          Data:
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
            placeholder="Data"
          />
        </label>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}