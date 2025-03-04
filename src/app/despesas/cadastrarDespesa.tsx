'use client';
import { useEffect, useState } from 'react';
import FormModal from '../components/FormModal';

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

  const [isOpen, setIsOpen] = useState(false);
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

const fields = [

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
      label: 'Descrição',
      name: 'descricao',
      type: 'text',
      value: descricao,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDescricao(e.target.value),
    },
  ];



  return (
    <div>
      <button className="block text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
       onClick={() => setIsOpen(true)}>nova despesa</button>
      <FormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Cadastrar nova despesa"
        fields={fields}
        onSubmit={handleSubmit}
      />


    </div>
  );
}