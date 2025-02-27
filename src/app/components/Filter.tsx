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
    <div>
      <label htmlFor="evento">Evento:</label>
      <select id="evento" value={selectedEvento ?? ''} onChange={handleEventoChange}>
        <option value="">Selecione um evento</option>
        {eventos.map(evento => (
          <option key={evento.id} value={evento.id}>
            {evento.nome}
          </option>
        ))}
      </select>
    </div>
  );
}