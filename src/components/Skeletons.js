// src/components/Skeletons.js

export function ServiceCardSkeleton() {
  return (
    <div className="flex bg-white rounded-xl overflow-hidden shadow-sm animate-pulse mb-4 h-28 border border-gray-100">
      <div className="w-28 bg-gray-200 h-full flex-shrink-0"></div>
      <div className="flex flex-col flex-1 p-3">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-auto"></div>
        <div className="flex justify-between items-center mt-2">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 4 }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="animate-pulse p-4 max-w-md mx-auto w-full">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-24 h-6 bg-gray-200 rounded"></div>
        <div className="w-8 h-8 flex-shrink-0 bg-gray-200 rounded-full"></div>
      </div>
      
      {/* Categories/Filters Skeleton */}
      <div className="flex gap-2 overflow-hidden mb-6">
        <div className="h-10 w-24 bg-gray-200 rounded-full flex-shrink-0"></div>
        <div className="h-10 w-24 bg-gray-200 rounded-full flex-shrink-0"></div>
        <div className="h-10 w-24 bg-gray-200 rounded-full flex-shrink-0"></div>
        <div className="h-10 w-24 bg-gray-200 rounded-full flex-shrink-0"></div>
      </div>

      {/* List Skeleton */}
      <ListSkeleton />
    </div>
  );
}
