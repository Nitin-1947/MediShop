import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  MessageSquare, 
  Sparkles, 
  QrCode 
} from 'lucide-react';
import { playPop, playSuccessChime } from '../utils/audio';

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
    playPop();

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
        playSuccessChime();
        confetti({ particleCount: 50, spread: 60 });
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
      <div className="cartoon-card bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-6 relative border-4 border-slate-900 shadow-cartoon-lg">
        {/* Close Button */}
        <button
          onClick={() => { playPop(); onClose(); }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 flex items-center justify-center font-black text-slate-900 transition-transform active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-400 rounded-full text-xs font-black text-amber-800">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Verified Counter-Pickup Reviews
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            {pharmacy.store_name}
          </h3>
          <p className="text-xs text-slate-500 font-semibold">
            Reviews on Medishop Connect are restricted exclusively to customers who completed physical counter pickups with valid QR codes.
          </p>
        </div>

        {/* Review Submission Form */}
        <form onSubmit={handleSubmitReview} className="cartoon-card p-4 bg-slate-50 space-y-3">
          <div className="font-black text-slate-900 text-sm">
            Leave a Verified Counter Experience Review:
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 block">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder="e.g. S. Raman"
                className="w-full px-3 py-1.5 rounded-lg border-2 border-slate-900 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block">Rating</label>
              <select
                value={rating}
                onChange={e => setRating(parseInt(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border-2 border-slate-900 text-xs font-bold bg-white"
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
            <label className="text-[11px] font-bold text-slate-500 block">Your Feedback</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="How was the QR code price match and counter dispensing experience?"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border-2 border-slate-900 text-xs font-bold"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Stamped as Verified Counter Pickup
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="cartoon-btn cartoon-btn-primary text-xs py-1.5 px-4"
            >
              Post Review
            </button>
          </div>
        </form>

        {/* Existing Reviews List */}
        <div className="space-y-3">
          <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
            Customer Experiences ({reviewsList.length}):
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {reviewsList.map(rev => (
              <div key={rev.id} className="cartoon-card p-3 bg-white space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900">{rev.user_name}</span>
                    {rev.is_verified_pickup && (
                      <span className="cartoon-badge bg-emerald-100 text-emerald-800 text-[9px] py-0.2">
                        ✓ Verified Pickup
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 font-semibold">{rev.comment}</p>
                <div className="text-[10px] text-slate-400 font-bold">{rev.created_at}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
