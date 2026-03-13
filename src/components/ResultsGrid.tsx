import type { StockResult } from '@/types';
import ResultCard from './ResultCard';

interface ResultsGridProps {
  results: StockResult[];
}

export default function ResultsGrid({ results }: ResultsGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 max-md:grid-cols-1">
      {results.map((result) => (
        <ResultCard key={result.id} result={result} />
      ))}
    </div>
  );
}
