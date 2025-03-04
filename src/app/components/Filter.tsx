import { useState, useEffect } from 'react';

interface Evento {
  id: number;
  nome: string;
}

interface FilterProps {
  onFilterChange: (eventoId: number) => void;
}

export default function Filter({ onFilterChange }: FilterProps) {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [selectedEvento, setSelectedEvento] = useState<number | null>(null);

  useEffect(() => {
    // Função para buscar eventos da API
    const fetchEventos = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/evento'); // URL da sua API para eventos
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

  const handleEventoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const eventoId = parseInt(e.target.value, 10);
    setSelectedEvento(eventoId);
    onFilterChange(eventoId);
  };

  return (



    <div className='flex flex-col justify-start'>
      
<form className="max-w-sm mx-auto">
  <label htmlFor="evento" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
  <select id="evento" value={selectedEvento ?? ''} onChange={handleEventoChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    <option value="">Selecione um evento</option>
    {eventos.map(evento => (
      <option key={evento.id} value={evento.id}>
        {evento.nome}
      </option>
    ))}
  </select>
</form>



{/* 
          <div>
      <h1>oii</h1>
    </div>



      <label htmlFor="evento">Evento:</label>
      <select id="evento" value={selectedEvento ?? ''} onChange={handleEventoChange}>
        <option value="">Selecione um evento</option>
        {eventos.map(evento => (
          <option key={evento.id} value={evento.id}>
            {evento.nome}
          </option>
        ))}
      </select> */}
    </div>
  );
}