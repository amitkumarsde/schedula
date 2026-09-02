"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import Button from "@/components/ui/Button";
import FormTextarea from "@/components/ui/FormTextarea";
import { saveReview } from "@/features/appointments/api/appointmentService";
import { toast } from "react-toastify";
import type { Review } from "@/types";

type AppointmentReviewProps = {
  appointmentId: string;
  userId: string;
  existingReview: Review | null;
  onUpdated: () => void;
};

// A row of stars, read-only when no onSelect is given.
function Stars({ value, onSelect }: { value: number; onSelect?: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onSelect}
          onClick={() => onSelect?.(n)}
          aria-label={`${n} star`}
          className={onSelect ? "cursor-pointer" : "cursor-default"}
        >
          <Star className={`h-6 w-6 ${n <= value ? "fill-yellow-500 text-yellow-500" : "text-line"}`} />
        </button>
      ))}
    </div>
  );
}

// The patient rates and comments on a completed appointment.
export default function AppointmentReview({
  appointmentId,
  userId,
  existingReview,
  onUpdated,
}: AppointmentReviewProps) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [isBusy, setIsBusy] = useState(false);

  // Already reviewed: show it read-only.
  if (existingReview) {
    return (
      <div className="space-y-2">
        <Stars value={existingReview.rating} />
        {existingReview.comment && <p className="text-sm text-ink">{existingReview.comment}</p>}
      </div>
    );
  }

  async function handleSubmit() {
    if (rating < 1) {
      toast.error("Please pick a rating");
      return;
    }

    setIsBusy(true);
    try {
      await saveReview(appointmentId, userId, rating, comment);
      toast.success("Thanks for your review");
      onUpdated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the review");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <Stars value={rating} onSelect={setRating} />

      <FormTextarea
        label="Comment"
        name="comment"
        value={comment}
        onChange={setComment}
        placeholder="How was your visit?"
        rows={3}
      />

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isBusy}>
          {isBusy ? "Saving..." : "Submit review"}
        </Button>
      </div>
    </div>
  );
}
