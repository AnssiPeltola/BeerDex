"use client";

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
  const { currentStep, data, nextStep, previousStep } = useBeerWizardStore();

  const handleNext = () => {
    if (currentStep === 1) {
      const result = beerStep1Schema.safeParse({
        name: data.name,
        breweryId: data.breweryId,
        countryId: data.countryId,
        styleId: data.styleId,
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
      return;
    }

    router.push("/beers/success");
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

        <button onClick={handleNext}>
          {currentStep < 4 ? "Next" : "Submit"}
        </button>
      </div>
    </div>
  );
}
