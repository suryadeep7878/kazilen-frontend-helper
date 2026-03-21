// src/app/services/page.js
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchServices, bookService } from '../../lib/api';
import { useUrlState } from '../../hooks/useUrlState';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useScrollRestore } from '../../hooks/useScrollRestore';
import { PageSkeleton } from '../../components/Skeletons';
import { Suspense } from 'react';

function ServicesContent() {
  const queryClient = useQueryClient();
  const { getParams, setParams } = useUrlState();
  const urlFilters = getParams();
  
  useScrollRestore();

  // Persistent category state
  const [category, setCategory, isMounted] = usePersistentState('selected_category', 'all');

  // React Query for fetching
  const { data: services, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['services', urlFilters, category],
    queryFn: () => fetchServices({ ...urlFilters, category }),
    enabled: isMounted, // only fetch after hydration
  });

  // Optimistic Mutation for Booking
  const bookingMutation = useMutation({
    mutationFn: bookService,
    onMutate: async (newBooking) => {
      await queryClient.cancelQueries({ queryKey: ['services'] });
      const previousServices = queryClient.getQueryData(['services', urlFilters, category]);

      // Optimistically update
      if (previousServices) {
        queryClient.setQueryData(['services', urlFilters, category], old => 
          old?.map(s => s.id === newBooking.serviceId ? { ...s, booked: true, optimistic: true } : s)
        );
      }
      return { previousServices };
    },
    onError: (err, newBooking, context) => {
      // Rollback on failure
      queryClient.setQueryData(['services', urlFilters, category], context.previousServices);
      alert('Booking failed. Your request might be queued via Background Sync if offline.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  if (!isMounted || isLoading) return <PageSkeleton />;

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-6 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <button onClick={() => refetch()} className="p-2 bg-gray-200 rounded-full active:scale-95 transition">
            ↻
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {['all', 'cleaning', 'plumbing', 'electrical'].map(cat => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setParams({ category: cat !== 'all' ? cat : undefined });
              }}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-colors ${
                category === cat 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 shadow-sm'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Service List */}
        {isError && (
           <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-4">
             Failed to load services. Please check your connection.
           </div>
        )}

        {isFetching && !isLoading && (
          <div className="text-sm text-gray-500 mb-4 animate-pulse">Updating...</div>
        )}

        <div className="flex flex-col gap-4">
          {services?.length === 0 && !isError && (
            <div className="text-center text-gray-500 mt-10">No services found.</div>
          )}

          {services?.map(service => (
            <div key={service.id} className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex h-28 ${service.optimistic ? 'opacity-70' : ''}`}>
               {service.image ? (
                  <img src={service.image} alt={service.name} className="w-28 h-full object-cover flex-shrink-0 bg-gray-100"/>
               ) : (
                  <div className="w-28 h-full bg-blue-50 flex-shrink-0 flex items-center justify-center">
                    <span className="text-blue-300">No Img</span>
                  </div>
               )}
               <div className="flex flex-col flex-1 p-3">
                 <h3 className="font-semibold text-gray-800 line-clamp-1">{service.name}</h3>
                 <p className="text-xs text-gray-500 mt-1 line-clamp-1">{service.description}</p>
                 <div className="flex justify-between items-center mt-auto">
                   <span className="font-bold text-blue-600">${service.price}</span>
                   <button 
                     disabled={service.booked || bookingMutation.isPending}
                     onClick={() => bookingMutation.mutate({ serviceId: service.id })}
                     className={`px-4 py-1.5 rounded-full font-medium text-sm transition-transform active:scale-95 ${
                        service.booked 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                     }`}
                   >
                     {service.booked ? 'Booked' : 'Book'}
                   </button>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ServicesContent />
    </Suspense>
  );
}
