"use client";
import { useState } from "react";
import {
  useCreateReviewMutation,
  useDeleteReviewMutation,
} from "@/app/store/apis/ReviewApi";
import {
  Star,
  MessageSquare,
  User,
  Clock,
  ThumbsUp,
  Trash2,
  AlertCircle,
  Send,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useGetMeQuery } from "@/app/store/apis/UserApi";

interface ProductReviewsProps {
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    userId: string;
    user?: { name: string };
  }[];
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  reviews,
  productId,
}) => {
  const { data } = useGetMeQuery(undefined);
  const userId = data?.user?.id;
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});

  const [createReview, { isLoading: isSubmitting, error }] =
    useCreateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        userId,
        rating,
        comment,
      }).unwrap();
      setRating(5);
      setComment("");
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId).unwrap();
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const renderStars = (starCount: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={15}
        className={`${
          index < starCount
            ? "text-amber-400 fill-amber-400"
            : "text-slate-600"
        }`}
      />
    ));
  };

  const ratingLabels: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  const averageRating = reviews?.length
    ? (
        reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
      ).toFixed(1)
    : "0";

  return (
    <div className="p-6 sm:p-8 text-slate-100">
      {/* Header */}
      <div className="border-b border-white/10 pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="text-amber-400" size={20} />
          Customer Reviews
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          {reviews.length} {reviews.length === 1 ? "verified review" : "verified reviews"} for this item
        </p>
      </div>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="text-center sm:text-left sm:border-r border-white/10 sm:pr-8">
            <div className="text-3xl sm:text-4xl font-extrabold text-gold-gradient">
              {averageRating}
            </div>
            <div className="flex justify-center sm:justify-start mt-1 gap-0.5">
              {renderStars(Math.round(Number(averageRating)))}
            </div>
            <p className="text-slate-400 text-xs mt-1">
              Based on {reviews.length} Indian buyers
            </p>
          </div>
        </div>
      )}

      {/* Review Form */}
      {userId ? (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6 mb-6">
          <h3 className="text-sm sm:text-base font-bold text-white mb-3 flex items-center gap-2">
            <ThumbsUp className="text-amber-400" size={16} />
            Write a Review
          </h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Your Rating
              </label>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setRating(index + 1)}
                      className="transition-transform hover:scale-125"
                    >
                      <Star
                        size={22}
                        className={`${
                          index < rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {rating} · {ratingLabels[rating]}
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="comment"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              >
                Feedback & Experience
              </label>
              <textarea
                id="comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-white/15 rounded-xl p-3 text-sm focus:border-amber-400 transition-all bg-white/[0.04] text-white placeholder-slate-400"
                placeholder="Share your experience with quality, fit or packaging..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <Send size={14} />
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 mb-6 text-amber-300 flex items-center text-xs">
          <AlertCircle size={15} className="mr-2 flex-shrink-0" />
          <span>Sign in to leave a verified buyer review.</span>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        <h3 className="text-sm sm:text-base font-bold text-white mb-2 flex items-center gap-2">
          <User className="text-amber-400" size={16} />
          Customer Feedback ({reviews.length})
        </h3>
        {reviews.length === 0 ? (
          <div className="text-center py-8 bg-white/[0.02] border border-white/10 rounded-xl">
            <MessageSquare size={28} className="mx-auto text-slate-500 mb-2" />
            <p className="text-slate-400 text-xs">
              No reviews yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border border-white/10 rounded-xl p-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-full flex items-center justify-center text-xs font-bold">
                    {review?.user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-xs sm:text-sm">
                        {review?.user?.name || "Customer"}
                      </span>
                      <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center mt-0.5">
                      <Clock size={11} className="mr-1" />
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                {(data?.user?.role === "ADMIN" || userId === review.userId) && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10 transition-colors"
                    title="Delete review"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="bg-white/[0.02] rounded-lg p-2.5 mt-2">
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {expandedReviews[review.id] ||
                  (review.comment?.length || 0) <= 200
                    ? review.comment
                    : `${review.comment?.slice(0, 200)}...`}
                  {(review.comment?.length || 0) > 200 && (
                    <button
                      onClick={() => toggleReviewExpansion(review.id)}
                      className="text-amber-400 hover:underline text-xs font-semibold ml-2"
                    >
                      {expandedReviews[review.id] ? "Show less" : "Read more"}
                    </button>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
