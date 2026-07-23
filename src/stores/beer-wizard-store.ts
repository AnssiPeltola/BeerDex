import { create } from "zustand";
import type {
  CountryOption,
  BreweryOption,
  BeerStyleOption,
} from "@/types/beer-wizard-types";

const MAX_STEP = 4 as const;
const MIN_STEP = 1 as const;
type Step = 1 | 2 | 3 | 4;

// Types for data
export interface BeerWizardData {
  // Step 1 - Basic Beer Info
  name: string;
  country: CountryOption | null;
  brewery: BreweryOption | null;
  style: BeerStyleOption | null;
  volumeMl: number | null;

  // Step 2 - Beer Characteristics
  abv: number | null;
  ibu: number | null;
  ebu: number | null;
  ebc: number | null;
  eanBarcode: string;

  // Step 3 - Image Upload
  image: File | null;

  // Step 4 - Rating / Review
  rating: number | null;
}

interface BeerWizardStore {
  currentStep: 1 | 2 | 3 | 4;
  data: BeerWizardData;

  nextStep: () => void;
  previousStep: () => void;
  setStep: (step: 1 | 2 | 3 | 4) => void;

  updateData: (data: Partial<BeerWizardData>) => void;

  reset: () => void;
}

const initialData: BeerWizardData = {
  // Step 1
  name: "",
  country: null,
  brewery: null,
  style: null,
  volumeMl: null,

  // Step 2
  abv: null,
  ibu: null,
  ebu: null,
  ebc: null,
  eanBarcode: "",

  // Step 3
  image: null,

  // Step 4
  rating: null,
};

export const useBeerWizardStore = create<BeerWizardStore>((set) => ({
  currentStep: 1,

  data: initialData,

  nextStep: () =>
    set((state) => ({
      currentStep:
        state.currentStep < MAX_STEP
          ? ((state.currentStep + 1) as Step)
          : state.currentStep,
    })),

  previousStep: () =>
    set((state) => ({
      currentStep:
        state.currentStep > MIN_STEP
          ? ((state.currentStep - 1) as Step)
          : state.currentStep,
    })),

  setStep: (step) =>
    set({
      currentStep: step,
    }),

  updateData: (newData) =>
    set((state) => ({
      data: {
        ...state.data,
        ...newData,
      },
    })),

  reset: () =>
    set({
      currentStep: 1,
      data: initialData,
    }),
}));
