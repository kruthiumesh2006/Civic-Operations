import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import {
  Star,
  CheckCircle2,
  MessageSquare,
  UploadCloud,
  Sparkles,
  MapPin,
  Send
} from 'lucide-react';

export default function CitizenReviews() {
  const { complaints, submitFeedback } = useCivic();

  const resolvedTickets = complaints.filter(c => c.status === 'Resolved');
  const [selectedTicketId, setSelectedTicketId] = useState(resolvedTickets[0]?.id || complaints[0]?.id || 'CM-2075');
  const [rating, setRating] = useState(5);
  const [issueResolved, setIssueResolved] = useState('Yes');
  const [reviewText, setReviewText] = useState('');
  const [feedbackPhoto, setFeedbackPhoto] = useState('');

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFeedbackPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    await submitFeedback(selectedTicketId, rating, reviewText, {
      feedbackPhoto,
      issueResolved: issueResolved === 'Yes'
    });
    setReviewText('');
    setFeedbackPhoto('');
  };

  const reviewedList = complaints.filter(c => c.feedback && c.rating);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Citizen Closure Verification & Satisfaction Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Citizen Feedback & Verified Reviews
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Rate completed civic repairs, confirm whether the issue was resolved on-site, and upload optional post-resolution photographs.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center space-x-4">
          <div className="text-center">
            <span className="text-3xl font-black text-amber-400 font-mono">4.9</span>
            <div className="flex text-amber-400 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
          </div>
          <div className="text-xs text-slate-400 border-l border-slate-800 pl-4">
            <p className="font-bold text-white">98.2% Verified Resolution</p>
            <p>Feeds Admin SLA Dashboard</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Submit Feedback Form | Right 2 Cols = Reviews & Demo Testimonials */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Citizen Feedback Form */}
        <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 h-fit">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Submit Resolution Feedback</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Ticket to Rate
            </label>
            <select
              value={selectedTicketId}
              onChange={(e) => setSelectedTicketId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            >
              {complaints.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.title.slice(0, 42)} ({c.status})
                </option>
              ))}
            </select>
          </div>

          {/* 5-Star Rating */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Five-Star Quality Rating *
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRating(s)}
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:scale-110 transition"
                >
                  <Star className={`w-5 h-5 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                </button>
              ))}
              <span className="text-xs font-bold text-amber-400 ml-2">{rating} / 5 Stars</span>
            </div>
          </div>

          {/* Was the issue resolved? */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Was the civic issue satisfactorily resolved? *
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              {['Yes', 'Partially', 'No'].map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setIssueResolved(opt)}
                  className={`py-2 rounded-xl border transition ${
                    issueResolved === opt
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Written Review */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Written Citizen Review *
            </label>
            <textarea
              rows="3"
              required
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Describe the quality and speed of the municipal repair work..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Optional Feedback Photograph */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Optional Feedback Photograph
            </label>
            <label className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center justify-center space-x-2 cursor-pointer">
              <UploadCloud className="w-4 h-4 text-cyan-400" />
              <span>{feedbackPhoto ? '✓ Photo Attached' : 'Upload Post-Repair Photo'}</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg transition"
          >
            <Send className="w-4 h-4" />
            <span>Submit Feedback</span>
          </button>
        </form>

        {/* Right 2 Columns: Verified Citizen Testimonials (Labelled Demo Content + Live Submitted Reviews) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviewedList.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < (rev.rating || 5) ? 'fill-amber-400' : 'text-slate-700'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    #{rev.id} • Demo / Verified Content
                  </span>
                </div>

                <p className="text-xs text-slate-200 italic leading-relaxed">"{rev.feedback}"</p>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-xs font-bold text-white truncate">{rev.title}</p>
                  <p className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{rev.area}</span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{rev.reportedBy}</p>
                  <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Issue Resolved: Yes</span>
                  </span>
                </div>
                <span className="text-[11px] text-cyan-400 font-medium">{rev.department}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
