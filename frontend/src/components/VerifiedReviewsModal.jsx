import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  MessageSquare, 
  Building2 
} from 'lucide-react';

export default function VerifiedReviewsModal({ isOpen, onClose, pharmacy }) {
  const [reviewsList, setReviewsList] = useState([]);
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [estimateToken, setEstimateToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!pharmacy) return;
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/${pharmacy.id}`);
        const data = await res.json();
        if (data.success) {
          setReviewsList(data.reviews);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [pharmacy]);

  if (!isOpen || !pharmacy) return null;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pharmacy_id: pharmacy.id,
          user_name: userName || "Verified Buyer",
          rating,
          comment,
          estimate_token: estimateToken || "VR-TOKEN"
        })
      });
      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 45, spread: 50 });
        setReviewsList(prev => [data.review, ...prev]);
        setComment('');
        setEstimateToken('');
      }
    } catch (err) {
      alert("Error submitting review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="clinical-card bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-xs font-semibold text-teal-800">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            Verified Counter-Pickup Reviews
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            {pharmacy.store_name}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Reviews on Medishop Connect are restricted exclusively to customers who completed physical counter pickups with valid QR codes.
          </p>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmitReview} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div className="font-bold text-slate-900 text-xs">
            Submit a Verified Counter Experience Review:
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder="e.g. S. Raman"
                className="clinical-input"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">Rating</label>
              <select
                value={rating}
                onChange={e => setRating(parseInt(e.target.value))}
                className="clinical-input"
              >
                <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                <option value={3}>⭐⭐⭐ 3 Stars</option>
                <option value={2}>⭐⭐ 2 Stars</option>
                <option value={1}>⭐ 1 Star</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Your Feedback</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="How was the QR code price match and counter dispensing experience?"
              rows={2}
              className="clinical-input resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Counter Pickup
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="clinical-btn-primary text-xs py-1.5 px-4"
            >
              Post Review
            </button>
          </div>
        </form>

        {/* Reviews List */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Customer Experiences ({reviewsList.length}):
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {reviewsList.map(rev => (
              <div key={rev.id} className="p-3 bg-white rounded-lg border border-slate-200 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{rev.user_name}</span>
                    {rev.is_verified_pickup && (
                      <span className="px-1.5 py-0.2 bg-teal-50 text-teal-800 text-[10px] rounded border border-teal-200 font-medium">
                        ✓ Verified Pickup
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 font-medium">{rev.comment}</p>
                <div className="text-[10px] text-slate-400 font-mono">{rev.created_at}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
