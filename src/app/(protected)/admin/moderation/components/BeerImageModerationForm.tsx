"use client";

import { approveBeerImage } from "../actions/approveBeerImage";
import { rejectBeerImage } from "../actions/rejectBeerImage";
import type { PendingBeerModerationDTO } from "@/repositories/beer.repository";
import { BeerImageLightbox } from "./BeerImageLightbox";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  initialModerationActionState,
  type ModerationActionState,
} from "../actions/moderationActionState";

type BeerImageModerationFormProps = {
  beer: PendingBeerModerationDTO;
};

async function moderateImage(
  prevState: ModerationActionState,
  formData: FormData,
): Promise<ModerationActionState> {
  const intent = formData.get("intent");

  if (intent === "approve") {
    const result = await approveBeerImage(prevState, formData);
    // keep prior status on failure, so a failed reject doesn't erase an earlier approve
    return result.success ? result : { ...result, status: prevState.status };
  }

  if (intent === "reject") {
    const result = await rejectBeerImage(prevState, formData);
    return result.success ? result : { ...result, status: prevState.status };
  }

  return prevState;
}

export function BeerImageModerationForm({
  beer,
}: BeerImageModerationFormProps) {
  const [state, formAction, isPending] = useActionState(
    moderateImage,
    initialModerationActionState,
  );

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Image Moderation
        </h3>
        <p className="text-sm text-slate-600">
          Inspect the submitted image before approving the beer.
        </p>
      </div>

      <BeerImageLightbox src={beer.image} alt={beer.name} />

      <form action={formAction} className="flex flex-wrap gap-3 pt-1">
        <input type="hidden" name="imageId" value={beer.imageId ?? ""} />
        <button
          type="submit"
          name="intent"
          value="approve"
          disabled={!beer.imageId || state.status === "approved" || isPending}
          className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Working…" : "Approve Image"}
        </button>
        <button
          type="submit"
          name="intent"
          value="reject"
          disabled={!beer.imageId || state.status === "rejected" || isPending}
          className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Working…" : "Reject Image"}
        </button>
      </form>
    </section>
  );
}
