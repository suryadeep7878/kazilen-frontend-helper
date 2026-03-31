// src/app/services/page.js
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchServices, bookService } from '../../lib/api';
import { useUrlState } from '../../hooks/useUrlState';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useScrollRestore } from '../../hooks/useScrollRestore';
import { PageSkeleton, ListSkeleton } from '../../components/Skeletons';
import { Suspense, useTransition } from 'react';
import ServiceItem from '../components/ServiceItem';

function ServicesContent() {
  const queryClient = useQueryClient();
  const { getParams, setParams } = useUrlState();
  const urlFilters = getParams();
  const [isPending, startTransition] = useTransition();
  
  useScrollRestore();

  // Persistent category state
  const [category, setCategory, isMounted] = usePersistentState('selected_category', 'all');

  // React Query for fetching
  const { data: services, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['services', urlFilters, category],
    queryFn: () => fetchServices({ ...urlFilters, category }),
    enabled: isMounted, // only fetch after hydration
  });

  const handleCategoryChange = (cat) => {
    startTransition(() => {
      setCategory(cat);
      setParams({ category: cat !== 'all' ? cat : undefined });
    });
  };

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
    <main className={`min-h-screen bg-gray-50 pb-20 pt-6 px-4 transition-opacity duration-300 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          </div>
          <button 
            onClick={() => refetch()} 
            disabled={isFetching}
            className={`p-2 bg-gray-200 rounded-full active:scale-95 transition ${isFetching ? 'opacity-50' : ''}`}
          >
            ↻
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {['all', 'cleaning', 'plumbing', 'electrical'].map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all ${
                category === cat 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-100' 
                  : 'bg-white text-gray-600 border border-gray-200 shadow-sm hover:border-blue-300'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Service List */}
        {isError && (
           <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-4 text-sm font-medium">
             Failed to load services. Please check your connection.
           </div>
        )}

        {(isFetching || isPending) && !isLoading && (
          <ListSkeleton count={services?.length || 4} />
        )}

        <div className="flex flex-col gap-4">
          {services?.length === 0 && !isError && !isFetching && !isPending && (
            <div className="text-center py-20">
              <p className="text-gray-500 font-medium">No services found in this category.</p>
              <button 
                onClick={() => handleCategoryChange('all')}
                className="text-blue-600 text-sm mt-2 font-semibold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}

          {!(isFetching || isPending) && services?.map(service => (
            <ServiceItem 
              key={service.id} 
              service={service} 
              isPending={bookingMutation.isPending}
              onBook={(id) => bookingMutation.mutate({ serviceId: id })}
            />
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
