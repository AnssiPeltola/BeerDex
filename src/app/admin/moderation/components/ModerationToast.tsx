"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function ModerationToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const toastType = searchParams.get("toast");

    if (!toastType) {
      return;
    }

    switch (toastType) {
      case "style-approved":
        toast.success("Style approved successfully!");
        break;

      case "style-rejected":
        toast.success("Style rejected successfully!");
        break;

      case "brewery-approved":
        toast.success("Brewery approved successfully!");
        break;

      case "brewery-rejected":
        toast.success("Brewery rejected successfully!");
        break;
    }

    const params = new URLSearchParams(searchParams);

    params.delete("toast");

    router.replace(
      params.toString() ? `${pathname}?${params.toString()}` : pathname,
      {
        scroll: false,
      },
    );
  }, [pathname, router, searchParams]);

  return null;
}
