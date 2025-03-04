import React, { useState, useEffect } from 'react';

interface EditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, valorPago: number) => void;
  id: number;
  valorPago: number;
}

const EditPaymentModal: React.FC<EditPaymentModalProps> = ({ isOpen, onClose, onSave, id, valorPago }) => {
  const [newValorPago, setNewValorPago] = useState(valorPago);

  useEffect(() => {
    setNewValorPago(valorPago);
  }, [valorPago]);

  const handleSave = () => {
    const formattedValorPago = parseFloat(newValorPago.toFixed(2));
    console.log('Dados da requisição:', { id, valor: formattedValorPago });
    onSave(id, formattedValorPago);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Editar Pagamento</h2>
        <form>
          <label>
            Valor Pago:
            <input
              type="number"
              value={newValorPago}
              onChange={(e) => setNewValorPago(parseFloat(e.target.value))}
            />
          </label>
          <div className='flex gap-2'>
          <button 
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button" onClick={handleSave}>Salvar</button>
          <button 
          className="block text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          type="button" onClick={onClose}>Cancelar</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditPaymentModal;