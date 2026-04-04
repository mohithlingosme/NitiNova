import React from 'react';
import Link from 'next/link';
import Button from './Button';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              NitiNova
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/search">
              <span className="text-gray-600 hover:text-gray-900">Search</span>
            </Link>
            <Link href="/upload">
              <span className="text-gray-600 hover:text-gray-900">Upload</span>
            </Link>
            <Button>Login</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
