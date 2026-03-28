'use client'

import { memo } from 'react';
import Image from 'next/image';

const ServiceItem = memo(function ServiceItem({ service, onBook, isPending }) {
  return (
    <div 
      className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex h-28 transition-all hover:shadow-md ${
        service.optimistic ? 'opacity-70 grayscale' : ''
      }`}
    >
      <div className="w-28 h-full relative flex-shrink-0 bg-gray-100">
        {service.image ? (
          <Image 
            src={service.image} 
            alt={service.name} 
            fill
            sizes="112px"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-blue-50 flex items-center justify-center">
            <span className="text-blue-300 text-xs font-medium">No Img</span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3 min-w-0">
        <h3 className="font-semibold text-gray-800 line-clamp-1">{service.name}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{service.description}</p>
        
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-col">
            <span className="font-bold text-blue-600 text-lg">₹{service.price}</span>
            {service.optimistic && (
              <span className="text-[10px] text-blue-500 animate-pulse font-medium">Syncing...</span>
            )}
          </div>
          
          <button 
            disabled={service.booked || isPending}
            onClick={() => onBook(service.id)}
            className={`px-5 py-1.5 rounded-full font-semibold text-sm transition-all active:scale-95 ${
              service.booked 
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:opacity-50'
            }`}
          >
            {service.booked ? 'Booked' : 'Book'}
          </button>
        </div>
      </div>
    </div>
  );
});

export default ServiceItem;
