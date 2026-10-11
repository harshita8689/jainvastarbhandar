import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-subtle animate-pulse flex flex-col h-full">
      <div className="aspect-[4/5] bg-gray-200" />
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-3">
        <div>
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-1" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="pt-4 border-t border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-8 bg-gray-200 rounded" />
            <div className="h-8 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
