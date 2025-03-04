import React, { useEffect, useState } from 'react';
import EditPaymentModal from '../components/EditPaymentModal';
import Table from '../components/Table';

interface Congregacao {
  id: number;
  nome: string;
  setor: {
    id: number;
    nome: string;
  };
}

interface Pessoa {
  id: number;
  nome: string;
  congregacao: Congregacao;
}

interface Pagamento {
  id: number;
  pessoa: Pessoa;
  evento: {
    id: number;
    nome: string;
    descricao: string;
    data: string;
    custoTotal: number;
    custoPorPessoa: number;
    status: string;
  };
  valor: number;
  data: string;
  parcela: number;
  descricao: string | null;
}

const columns = ['Nome', 'Congregação', 'Descrição', 'Valor'];

const renderCell = (item: Pagamento, column: string) => {
  switch (column) {
    case 'Nome':
      return item.pessoa.nome;
    case 'Congregação':
      return item.pessoa.congregacao.nome;
    case 'Descrição':
      return item.descricao || 'Sem descrição';
    case 'Valor':
      return item.valor;
    default:
      return null;
  }
};

const Pagamentos: React.FC = () => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [selectedPessoaId, setSelectedPessoaId] = useState<number | null>(null);
  const [selectedPagamento, setSelectedPagamento] = useState<Pagamento | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Buscar a lista de pessoas
  useEffect(() => {
    const fetchPessoas = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/pessoa'); // Rota para pegar a lista de pessoas
        if (response.ok) {
          const data = await response.json();
          setPessoas(data);
          console.log(data);
        } else {
          console.error('Falha ao carregar pessoas');
        }
      } catch (error) {
        console.error('Erro ao buscar pessoas:', error);
      }
    };
    fetchPessoas();
  }, []);

  // Buscar os pagamentos com base na pessoa selecionada
  const buscarPagamentos = async () => {
    try {
      console.log(selectedPessoaId);
      const response = await fetch(`http://localhost:8080/api/pagamento/individual/pessoa/${selectedPessoaId}`); // Substitua com a rota correta
      if (response.ok) {
        const data = await response.json();
        setPagamentos(data);
      } else {
        console.error('Falha ao carregar pagamentos');
      }
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
    }
  };

  const handleEdit = (pagamento: Pagamento) => {
    setSelectedPagamento(pagamento);
    setIsModalOpen(true);
  };

  const handleSave = async (id: number, valorPago: number) => {
    const formattedValorPago = parseFloat(valorPago.toFixed(2));
    console.log('Dados da requisição:', { id, valor: formattedValorPago });
    
    try {
      const res = await fetch(`http://localhost:8080/api/pagamento/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ valor: formattedValorPago }),
      });
      if (!res.ok) {
        throw new Error('Falha ao atualizar pagamento');
      }
      console.log(res);
      setPagamentos((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, valor: formattedValorPago } : item
        )
      );
    } catch (err) {
      console.error('Erro ao atualizar pagamento', err);
    }
  };

  return (
    <div>
      <h1>Busca de Pagamentos</h1>

      {/* Select para escolher uma pessoa */}
      <div>
        <label htmlFor="pessoa">Escolha uma pessoa: </label>
        <select
          id="pessoa"
          value={selectedPessoaId || ''}
          onChange={(e) => setSelectedPessoaId(Number(e.target.value))}
        >
          <option value="">Selecione uma pessoa</option>
          {pessoas.map((pessoa) => (
            <option key={pessoa.id} value={pessoa.id}>
              {pessoa.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Botão de buscar */}
      <div>
        <button className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
        onClick={buscarPagamentos}>Buscar</button>
      </div>

      {/* Tabela de pagamentos */}
      <Table
        dadosTabela={pagamentos}
        colunasTabela={columns}
        renderCell={renderCell}
        onEdit={handleEdit}
      />

      {selectedPagamento && (
        <EditPaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          id={selectedPagamento.id}
          valorPago={selectedPagamento.valor}
        />
      )}
    </div>
  );
};

export default Pagamentos;