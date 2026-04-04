import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">NitiNova</Link>
          </div>
          <div className="flex items-center space-x-4 lg:space-x-8">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/upload" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/upload' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Upload
            </Link>
            <Link 
              href="/search" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/search' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Search
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

