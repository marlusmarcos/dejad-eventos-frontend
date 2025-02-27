'use client'
import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';

const CashBox = () => {
  const [totalCaixa, setTotalCaixa] = useState(0);


  useEffect (() => {
    const fetchTotalCaixa = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/caixa');
        if (!res.ok) {
          throw new Error('Falha ao carregar o total do caixa');
        }
        const data = await res.json();
        setTotalCaixa(data);
      } catch (err) {
        console.error('Erro ao carregar o total do caixa', err);
      }
    };

    fetchTotalCaixa();
  }, []);

  useEffect(() => {
    const client = new Client({
    
      brokerURL: 'http://localhost:8080/ws',  // Endereço WebSocket do backend Spring
      connectHeaders: {},
      debug: function (str) {
        console.log(str);
      },
      onConnect: () => {
        client.subscribe('/topic/cash', (message) => {
          setTotalCaixa(JSON.parse(message.body));
          console.log('Mensagem recebida', message.body);  
        });
      },
      onStompError: (frame) => {
        console.error('Erro no WebSocket', frame);
      }
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div>
      <h1>Total do Caixa</h1>
      <p>{formatCurrency(totalCaixa)}</p>
    </div>
  );
};

export default CashBox;
