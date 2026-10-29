import React from 'react';

interface ProductSkeletonProps {
  count?: number;
}

export const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div 
          key={idx}
          className="bg-white rounded-lg border border-gray-100 p-3 flex flex-col justify-between h-[360px] animate-pulse shadow-sm"
          data-testid="product-skeleton"
        >
          {/* Badge & Image placeholder */}
          <div className="relative w-full h-44 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div className="absolute top-2 left-2 w-12 h-5 bg-gray-200 rounded" />
          </div>

          {/* Details placeholder */}
          <div className="mt-3 flex-1 flex flex-col justify-between">
            <div>
              <div className="w-16 h-3 bg-gray-200 rounded mb-2" />
              <div className="w-full h-4 bg-gray-200 rounded mb-1.5" />
              <div className="w-3/4 h-4 bg-gray-200 rounded" />
            </div>

            {/* Price & Action button placeholder */}
            <div className="mt-4 pt-2 border-t border-gray-50 flex items-center justify-between">
              <div>
                <div className="w-20 h-5 bg-gray-200 rounded mb-1" />
                <div className="w-14 h-3 bg-gray-100 rounded" />
              </div>
              <div className="w-24 h-9 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
