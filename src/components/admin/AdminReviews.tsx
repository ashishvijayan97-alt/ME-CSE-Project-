import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  Star,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Search,
  Check,
  X,
  Clock,
} from 'lucide-react';

export const AdminReviews: React.FC = () => {
  const { reviews, products, updateReviewStatus } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');

  const filteredReviews = reviews.filter((r) => {
    if (statusFilter !== 'all' && (r.status || 'approved') !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.userName.toLowerCase().includes(q);
      const matchComment = r.comment.toLowerCase().includes(q);
      const matchTitle = r.title.toLowerCase().includes(q);
      if (!matchName && !matchComment && !matchTitle) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Moderate Customer Reviews</h2>
          <p className="text-xs text-slate-500">
            Review user feedback, verify authentic purchases, and approve or reject submissions
          </p>
        </div>

        <div className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl font-bold">
          {reviews.length} Total Reviews
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'approved', 'pending', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid / List */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => {
          const product = products.find((p) => p.id === rev.productId);

          return (
            <div
              key={rev.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {rev.userName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{rev.userName}</span>
                      <span className="text-[10px] text-slate-400">on {rev.createdAt}</span>
                    </div>
                    {product && (
                      <span className="text-[11px] text-indigo-600 font-semibold">
                        Product: {product.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-current' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      rev.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rev.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {(rev.status || 'approved').toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">{rev.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => updateReviewStatus(rev.id, 'approved')}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-lg transition flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>

                <button
                  onClick={() => updateReviewStatus(rev.id, 'rejected')}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold text-xs rounded-lg transition flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
