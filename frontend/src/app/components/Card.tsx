import { Case } from '../types';
import Link from 'next/link';

interface CaseCardProps {
  case: Case;
}

export default function CaseCard({ case: c }: CaseCardProps) {
  return (
    <Link href={`/case/${c.id}`} className="block">
      <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600">{c.name}</h3>
        <p className="text-gray-600 mb-3 line-clamp-2">{c.summary}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{c.court}</span>
          <span>{new Date(c.date).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}

