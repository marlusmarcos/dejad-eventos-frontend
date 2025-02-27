import React from 'react';
import CashBox from './CashAll';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md fixed w-full z-10 h-16 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Retiro de Jovens</h1>
      <CashBox />
    </header>
  );
};

export default Header;