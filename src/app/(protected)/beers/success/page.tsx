"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBeerWizardStore } from "@/stores/beer-wizard-store";

export default function BeerSuccessPage() {
  const router = useRouter();
  const reset = useBeerWizardStore((s) => s.reset);

  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    if (timeLeft === 0) {
      reset(); // clear wizard state
      router.push("/"); // go home
    }

    return () => clearTimeout(timer);
  }, [timeLeft, router, reset]);

  return (
    <div className="max-w-lg mx-auto text-center mt-20 space-y-4">
      <h1 className="text-2xl font-bold">🍺 Beer created!</h1>

      <p className="text-gray-600">
        Redirecting to home in {timeLeft} seconds...
      </p>
    </div>
  );
}
