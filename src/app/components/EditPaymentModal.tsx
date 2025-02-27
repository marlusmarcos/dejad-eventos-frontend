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
          <button type="button" onClick={handleSave}>Salvar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default EditPaymentModal;