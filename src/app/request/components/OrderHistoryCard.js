"use client";

import { memo } from "react";

const OrderHistoryCard = memo(function OrderHistoryCard({ orders }) {

  const getStatusStyle = (s) => {
    switch (s) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "ongoing":
        return "text-blue-600 bg-blue-50";
      case "accepted":
        return "text-indigo-600 bg-indigo-50";
      case "rejected":
        return "text-red-500 bg-red-50";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  // ✅ Empty state
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center text-slate-400 text-sm py-6">
        No order history yet
      </div>
    );
  }

  return (
    <div className="space-y-3">

      {orders.map((item) => (
        <div
          key={item.id}
          className="border rounded-xl p-4 bg-white shadow-sm"
        >

          {/* Top Row */}
          <div className="flex justify-between items-center mb-1">
            <p className="font-bold text-slate-800">
              {item.name}
            </p>

            <span
              className={`text-[10px] px-2 py-1 rounded-full font-semibold ${getStatusStyle(item.status)}`}
            >
              {item.status?.toUpperCase()}
            </span>
          </div>

          {/* Description (optional) */}
          {item.description && (
            <p className="text-[10px] text-slate-400 uppercase font-bold">
              {item.description}
            </p>
          )}

          {/* Customer (optional) */}
          {item.customer && (
            <p className="text-sm text-slate-600">
              {item.customer}
            </p>
          )}

          {/* Address (optional) */}
          {item.address && (
            <p className="text-xs text-slate-400">
              {item.address}
            </p>
          )}

          {/* Bottom Row */}
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-slate-400">
              {item.time || "Just now"}
            </span>

            <span className="font-bold text-indigo-600">
              ₹{item.price}
            </span>
          </div>

        </div>
      ))}

    </div>
  );
});

export default OrderHistoryCard;