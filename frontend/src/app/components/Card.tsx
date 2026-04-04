import React, { ReactNode } from 'react';
import { SearchResult } from '../types';

interface CardProps {
  children?: ReactNode;
  className?: string;
  title?: string;
  case?: SearchResult;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, case: result }) => {
  return (
    <div className={`bg-white shadow-lg rounded-lg p-6 border hover:shadow-xl transition-shadow ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {result ? (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{result.title}</h3>
          <p className="text-sm text-gray-500 mb-3">{result.court}</p>
          <p className="text-gray-700 mb-4 line-clamp-3">{result.snippet}</p>
          <div className="flex justify-between items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              result.score > 0.8 ? 'bg-green-100 text-green-800' :
              result.score > 0.6 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              Score: {(result.score * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default Card;
