import Link from 'next/link';

export default function Side() {
  return (
	<div><aside className="px-2  rounded-sm bg-gray-800 text-white fixed h-full">
    <nav>
      <ul>
        <li className="mb-2">
          <Link href="/home" className="hover:text-blue-400">Início</Link>
        </li>
        <li className="mb-2">
          <a href="/participantes" className="hover:text-blue-400">Participantes</a>
        </li>
        <li className="mb-2">
          <a href="/despesas" className="hover:text-blue-400">Despesas</a>
        </li>
        
      </ul>
    </nav>
  </aside>
	</div>
  );
}