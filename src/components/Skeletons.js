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

export function DetailsSkeleton() {
  return (
    <div className="animate-pulse max-w-md mx-auto w-full pt-6">
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 mt-4 h-[28rem] flex flex-col items-center">
        <div className="w-32 h-32 bg-gray-200 rounded-full mb-6"></div>
        <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
        <div className="h-5 bg-gray-200 rounded-md w-1/3 mb-8"></div>
        
        <div className="flex justify-around w-full border-t border-gray-100 pt-8 mb-6 mt-auto">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EditFormSkeleton() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-white pt-6 pb-24">
      <div className="animate-pulse max-w-md w-full px-4 mx-auto">
        <div className="h-10 bg-gray-200 w-full rounded mb-6"></div>
        
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm flex flex-col gap-4">
          <div>
            <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full border border-gray-300"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full border border-gray-300"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
            <div className="h-20 bg-gray-200 rounded w-full border border-gray-300"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full border border-gray-300"></div>
          </div>
          <div className="flex gap-3 mt-4">
            <div className="h-12 bg-gray-300 rounded-md flex-1"></div>
            <div className="h-12 bg-gray-300 rounded-md px-8 w-24"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function SkeletonButton({ className = "", text = "Loading..." }) {
  return (
    <div className={`animate-pulse bg-gray-300 text-gray-400 font-semibold py-3 flex justify-center items-center rounded-xl pointer-events-none ${className}`}>
      {text}
    </div>
  );
}

export function SkeletonText({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}
