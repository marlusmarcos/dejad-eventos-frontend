import React from 'react';
import Header from './Header';
import Sidebar from './SIde';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
     
      <div className="flex-1 flex flex-col">
        <div>
          <Header />
          <div className='py-16'>
          <Sidebar />
          <main className="flex-1 p-4 overflow-y-auto ml-64">
          {children}
        </main>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Layout;