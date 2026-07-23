"use client";

import { useState } from "react";
import { useBeerWizardStore } from "@/stores/beer-wizard-store";
import BeerInfoStep from "@/components/beer-wizard/steps/BeerInfoStep";
import CharacteristicsStep from "@/components/beer-wizard/steps/CharacteristicsStep";
import ImageUploadStep from "@/components/beer-wizard/steps/ImageUploadStep";
import ReviewStep from "@/components/beer-wizard/steps/ReviewStep";
import { WizardProgress } from "./WizardProgress";
import { beerStep1Schema, beerStep2Schema } from "@/validations/beer-wizard";
import { useRouter } from "next/navigation";

export default function AddBeerWizard() {
  const router = useRouter();

  const { currentStep, data, nextStep, previousStep, reset } =
    useBeerWizardStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (currentStep === 1) {
      const result = beerStep1Schema.safeParse({
        name: data.name,
        breweryId: data.brewery?.id,
        countryId: data.country?.id,
        styleId: data.style?.id,
        volumeMl: data.volumeMl,
      });

      if (!result.success) {
        alert(result.error.issues[0]?.message);
        return;
      }
    }

    if (currentStep === 2) {
      const result = beerStep2Schema.safeParse({
        abv: data.abv,
        ibu: data.ibu,
        ebu: data.ebu,
        ebc: data.ebc,
        eanBarcode: data.eanBarcode,
      });

      if (!result.success) {
        alert(result.error.issues[0]?.message);
        return;
      }
    }

    if (currentStep === 3 && !data.image) {
      alert("Please upload an image file");
      return;
    }

    if (currentStep < 4) {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    try {
      if (!data.image) {
        alert("Missing image");
        return;
      }

      setIsSubmitting(true);

      const formData = new FormData();

      formData.append("file", data.image);

      formData.append(
        "data",
        JSON.stringify({
          name: data.name,
          country: data.country,
          brewery: data.brewery,
          style: data.style,
          volumeMl: data.volumeMl,
          abv: data.abv,
          ibu: data.ibu,
          ebu: data.ebu,
          ebc: data.ebc,
          eanBarcode: data.eanBarcode,
          rating: data.rating,
        }),
      );

      const res = await fetch("/api/new-beer", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Failed to create beer");
        return;
      }

      // reset wizard state after success
      reset();

      router.push("/beers/success");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <WizardProgress step={currentStep} />

      {currentStep === 1 && <BeerInfoStep />}
      {currentStep === 2 && <CharacteristicsStep />}
      {currentStep === 3 && <ImageUploadStep />}
      {currentStep === 4 && <ReviewStep />}

      <div className="flex justify-between mt-8">
        <button onClick={previousStep} disabled={currentStep === 1}>
          Back
        </button>

        <button
          onClick={currentStep < 4 ? handleNext : handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : currentStep < 4 ? "Next" : "Submit"}
        </button>
      </div>
    </div>
  );
}
