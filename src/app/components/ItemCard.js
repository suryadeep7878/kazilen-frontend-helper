// app/components/ItemCard.js
'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState, memo, useMemo } from 'react'
import { deleteItem } from '../lib/api'

const ItemCard = memo(function ItemCard({ item = {}, onDeleted } = {}) {
  const router = useRouter()
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [error, setError] = useState(null)

  const priceText = useMemo(() => {
    const priceNumber = item.price != null ? Number(item.price) : null
    return priceNumber == null || Number.isNaN(priceNumber) ? '—' : priceNumber.toFixed(2)
  }, [item.price]);

  const shortDesc = useMemo(() => {
    if (!item.description) return '';
    return item.description.length > 120
      ? item.description.slice(0, 120) + '…'
      : item.description
  }, [item.description]);

  const handleEdit = () => {
    if (item?.id) router.push(`/edit/${item.id}`)
    else router.push('/edit')
  }

  const handleDelete = async () => {
    const ok = window.confirm('Delete this item? This action cannot be undone.')
    if (!ok) return
    setError(null)
    setLoadingDelete(true)
    try {
      await deleteItem(item.id)
      if (typeof onDeleted === 'function') onDeleted(item.id)
      else window.location.reload()
    } catch (err) {
      console.error('delete error', err)
      setError(err?.message || 'Failed to delete')
    } finally {
      setLoadingDelete(false)
    }
  }

  const imageSrc = item.imageUrl || item.image || '/door-repair.jpg'

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex-1 pr-4 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-1">{item.category ?? 'Uncategorized'}</p>
        <p className="font-bold text-gray-900 line-clamp-1">{item.name ?? 'Unnamed item'}</p>
        {shortDesc && <p className="text-gray-500 mt-1 text-xs line-clamp-2 leading-relaxed">{shortDesc}</p>}
        <p className="text-blue-600 font-extrabold mt-3 text-lg">₹{priceText}</p>
        {item.createdAt && (
          <p className="text-[10px] text-gray-400 mt-1">
            Added: {new Date(item.createdAt).toLocaleDateString()}
          </p>
        )}
        {error && <p className="text-[10px] text-red-500 mt-2 font-medium bg-red-50 px-2 py-1 rounded inline-block">{error}</p>}
      </div>

      <div className="flex flex-col items-end flex-shrink-0">
        <div className="w-24 h-20 relative rounded-xl overflow-hidden bg-gray-100 shadow-inner">
          <Image
            src={imageSrc}
            alt={item.name ?? 'item image'}
            fill
            className="object-cover"
            sizes="96px"
            loading="lazy"
          />
        </div>

        <div className="mt-3 flex gap-4">
          <button
            onClick={handleEdit}
            className="text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors uppercase tracking-widest"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            disabled={loadingDelete}
            className={`text-xs font-bold uppercase tracking-widest transition-colors ${loadingDelete ? 'text-gray-300' : 'text-red-500 hover:text-red-700'}`}
          >
            {loadingDelete ? '...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
});

export default ItemCard;
